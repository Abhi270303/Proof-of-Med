import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  ArrowRight,
  Loader2,
  FileJson,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

const OrderFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [jsonFile, setJsonFile] = useState(null);
  const [proofContent, setProofContent] = useState("");
  const [pubsContent, setPubsContent] = useState("");
  const [address, setAddress] = useState("");
  const [totalPrice, setTotalPrice] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [medicineIds, setMedicineIds] = useState([]);
  const [medHash, setMedHash] = useState("");
  const [detailHash, setDetailHash] = useState("");
  const { signer, address: USER_ADDRESS, provider } = useWalletContext();
  const [data, setData] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const validateAndExtractJson = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);

      if (!data.prescription || !data.proofDetails) {
        throw new Error("Invalid JSON structure");
      }

      const proofFileContent = data.proofDetails.proof_file?.content;
      const pubsFileContent = data.proofDetails.pubs_file?.content;

      const prepareMedDetails = (medicines) => {
        const details = medicines.flatMap((med) => [
          med.medicineId,
          med.quantity,
        ]);
        const padded = [...details, ...Array(10 - details.length).fill(1)];
        return padded.slice(0, 10);
      };

      const extractedMedicineIds =
        prepareMedDetails(data.prescription?.medicines) || [];
      const med_hash = data?.med_hash || "";
      const detail_hash = data?.detail_hash || "";

      if (!proofFileContent || !pubsFileContent) {
        throw new Error("Missing proof or pubs content");
      }

      setProofContent(proofFileContent);
      setPubsContent(pubsFileContent);
      setMedicineIds(extractedMedicineIds);
      setMedHash(med_hash);
      setDetailHash(detail_hash);
      return true;
    } catch (error) {
      toast.warning("Invalid JSON Format", "Please upload a valid JSON file.");
      setJsonFile(null);
      setProofContent("");
      setPubsContent("");
      setMedicineIds([]);
      setDetailHash("");
      setMedHash("");
      return false;
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 1) {
      toast.warning("Multiple Files Detected", "Please upload only one file.");
      return;
    }

    const file = files[0];
    if (file.type !== "application/json") {
      toast.warning("Invalid File Type", "Please upload a JSON file.");
      return;
    }

    handleFileProcessing(file);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.warning("Invalid File Type", "Please upload a JSON file.");
      return;
    }

    handleFileProcessing(file);
  }, []);

  const handleFileProcessing = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (validateAndExtractJson(content)) {
        setJsonFile(file);
        toast.success("File Uploaded Successfully");
      }
    };
    reader.readAsText(file);
  };

  const getPrice = async (medicineIds) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const response = await contract.getPrice(medicineIds);
      return response;
    } catch (error) {
      console.error("Error getting price:", error);
      throw error;
    }
  };

  const verifyProof = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch("http://localhost:8000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof: proofContent,
          publicSignals: pubsContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Verification request failed");
      }

      const responseData = await response.json();
      setData(responseData);
      if (responseData?.txHash) {
        setCurrentStep(2);
        toast.success("Verification Successful");
      } else {
        throw new Error("Proof verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify the proof. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofContent || !pubsContent) {
      toast.warning("Missing Proof Data");
      return;
    }
    await verifyProof();
  };

  useEffect(() => {
    if (txHash) {
      const timer = setTimeout(() => {
        router.push("/app");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [txHash, router]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      let tx = await contract.buyMedicine(
        data.leaf,
        data.attestationId,
        data.proof,
        data.numberOfLeaves,
        data.leafIndex,
        address,
        medicineIds,
        {
          value: ethers.parseEther("0"),
        }
      );

      setTxHash(tx.hash);

      provider.once(tx.hash, (transaction) => {
        toast.success("Order Placed Successfully");
        setIsLoading(false);
        setIsCompleted(true);
      });
    } catch (error) {
      toast.error("Failed to place the order. Please try again.");
      setIsLoading(false);
    }
  };

  const renderTransactionDetails = () => {
    if (!txHash) return null;

    return (
      <Alert className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/20 mb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Transaction Hash
            </span>
            <a
              href={`https://sepolia.arbiscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center gap-1"
            >
              View <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <code className="text-xs text-orange-600 dark:text-orange-400 break-all">
            {txHash}
          </code>
        </div>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-background p-4 md:p-6">
      <Card
        className={`max-w-2xl w-full mx-auto rounded-3xl border-0 shadow-xl shadow-orange-900/5 transition-all duration-500 ${
          isCompleted ? "bg-green-50 dark:bg-green-900/10" : ""
        }`}
      >
        <div className="p-8 space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === 1
                    ? "bg-[#EA580B] text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <div
                className={`w-20 h-0.5 transition-all duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-orange-100"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === 2
                    ? "bg-[#EA580B] text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : "2"}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {renderTransactionDetails()}

          {currentStep === 1 ? (
            <form onSubmit={handleSubmitProof} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-[#EA580B] bg-orange-50 dark:bg-orange-900/10"
                    : "border-orange-600/20 hover:border-orange-600/40 hover:bg-orange-50 dark:hover:bg-orange-900/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto flex items-center justify-center">
                    <FileJson className="w-8 h-8 text-[#EA580B]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Upload JSON Proof</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Drag and drop your JSON file here, or click to select
                    </p>
                  </div>
                  {jsonFile ? (
                    <Alert className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
                      <Check className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        {jsonFile.name} uploaded successfully
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Input
                      type="file"
                      accept="application/json"
                      onChange={handleFileInput}
                      className="hidden"
                      id="json-upload"
                    />
                  )}
                  <label
                    htmlFor="json-upload"
                    className="inline-block px-4 py-2 bg-orange-50 dark:bg-orange-900/10 text-[#EA580B] rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-200"
                  >
                    Select File
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#EA580B] hover:bg-[#EA580B]/90 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                disabled={!proofContent || !pubsContent || isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {isVerifying ? "Verifying Proof..." : "Continue to Order"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    Delivery Address
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="h-12 rounded-xl border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10"
                    disabled={isLoading || isCompleted}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-base font-medium">
                    Total Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    placeholder="Total price will be calculated automatically"
                    className="h-12 rounded-xl border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10"
                    disabled={true}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                  isCompleted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-[#EA580B] hover:bg-[#EA580B]/90 text-white"
                }`}
                disabled={!address || !totalPrice || isLoading || isCompleted}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : isCompleted ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <Check className="w-5 h-5 mr-2" />
                )}
                {isLoading
                  ? "Processing Order..."
                  : isCompleted
                  ? "Order Complete!"
                  : "Place Order"}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderFlow;
