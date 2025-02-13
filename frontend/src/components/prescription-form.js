import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, CheckCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useWalletContext } from "@/privy/walletContext";
import { poseidon4, poseidon10 } from "poseidon-lite";

const PrescriptionForm = () => {
  const [medicines, setMedicines] = useState([
    { medicineId: 1, quantity: 1 },
    { medicineId: 2, quantity: 1 },
    { medicineId: 3, quantity: 1 },
    { medicineId: 4, quantity: 1 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { signer, address: DOCTOR_ADDRESS } = useWalletContext();

  const [walletAddress, setWalletAddress] = useState(
    "0xfCefe53c7012a075b8a711df391100d9c431c468"
  );
  const [frequency, setFrequency] = useState("3");

  // Previous helper functions remain the same...
  const addressToField = (address) => {
    return BigInt("0x" + address.slice(2));
  };

  const prepareMedDetails = (medicines) => {
    const details = medicines.flatMap((med) => [med.medicineId, med.quantity]);
    const padded = [...details, ...Array(10 - details.length).fill(1)];
    console.log(padded.slice(0, 10))
    return padded.slice(0, 10);
  };

  const calculateHashes = (clientAddress, freq, medDetails) => {
    const docAddress = addressToField(DOCTOR_ADDRESS);
    const clientAddressBigInt = addressToField(clientAddress);
    const useOnce = BigInt(0);
    const freqBigInt = BigInt(freq);

    const detailHash = poseidon4([
      docAddress,
      clientAddressBigInt,
      useOnce,
      freqBigInt,
    ]);
    const medHash = poseidon10(medDetails);

    return {
      detailHash: detailHash.toString(),
      medHash: medHash.toString(),
    };
  };

  const downloadProofData = (proofData) => {
    const blob = new Blob([JSON.stringify(proofData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prescription_proof.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const freq = parseInt(frequency);
      const message = formatBlockchainInfo(walletAddress, medicines, freq);
      const signatureValue = await signer.signMessage(message);
      const medDetails = prepareMedDetails(medicines);
      const { detailHash, medHash } = calculateHashes(
        walletAddress,
        freq,
        medDetails
      );

      const requestBody = {
        doc_address: DOCTOR_ADDRESS,
        client_address: walletAddress,
        use_once: 0,
        freq: parseInt(frequency),
        med_details: medDetails,
        med_hash: medHash,
        detail_hash: detailHash,
        hashed_message: [
          223, 13, 20, 228, 203, 52, 174, 15, 63, 31, 150, 62, 159, 197, 107,
          231, 211, 221, 217, 6, 235, 89, 253, 8, 56, 101, 41, 52, 29, 32, 9,
          225,
        ],
        pub_key_x_solver: [
          165, 178, 123, 213, 13, 102, 98, 207, 221, 114, 165, 223, 179, 150,
          140, 9, 13, 18, 120, 142, 111, 187, 65, 84, 109, 250, 124, 191, 137,
          194, 49, 119,
        ],
        pub_key_y_solver: [
          110, 166, 131, 66, 135, 29, 153, 57, 221, 100, 196, 73, 18, 49, 150,
          48, 101, 194, 75, 74, 36, 215, 186, 152, 206, 153, 179, 112, 54, 113,
          4, 177,
        ],
        signature_solver: [
          132, 100, 191, 209, 126, 114, 194, 237, 153, 71, 214, 126, 215, 93,
          210, 84, 148, 144, 66, 12, 180, 250, 156, 47, 87, 104, 61, 241, 14,
          205, 64, 119, 125, 226, 188, 144, 59, 161, 87, 158, 232, 43, 24, 17,
          148, 1, 245, 37, 54, 234, 32, 48, 115, 196, 115, 123, 37, 159, 178,
          246, 179, 214, 180, 214,
        ],
      };

      const response = await fetch("http://localhost:8001/generate-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to generate proof");
      }

      const data = await response.json();

      const medicineList = medicines.map((med) => med.medicineId);

      // Combine frontend and backend data
      const combinedProofData = {
        prescription: {
          walletAddress,
          medicines,
          frequency: freq,
        },
        proofDetails: {
          proof_file: data.proof_file,
          pubs_file: data.pubs_file,
        },
        med_hash: medHash,
        detail_hash: detailHash,
        med_ids: medicineList,
      };

      // Download the combined data
      downloadProofData(combinedProofData);

      toast.success("Proof generated and downloaded successfully");
    } catch (error) {
      console.error("Error generating proof:", error);
      toast.error("Failed to generate proof");
    } finally {
      setIsLoading(false);
    }
  };

  const addMedicine = () => {
    setMedicines([...medicines, { medicineId: 0, quantity: 0 }]);
  };

  const removeMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const updateMedicine = (index, field, value) => {
    const numericValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(numericValue)) {
      const newMedicines = [...medicines];
      newMedicines[index][field] = numericValue;
      setMedicines(newMedicines);
    }
  };

  const formatBlockchainInfo = (clientAdd, medicines, freq) => {
    const medicineString = medicines
      .map((med) => `${med.medicineId}:${med.quantity}`)
      .join(",");
    return `Client Address: ${clientAdd}\nMedicines: ${medicineString}\nFrequency: ${freq}`;
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-background p-4 md:p-6">
      <Card className="max-w-3xl mx-auto rounded-3xl border-0 shadow-xl shadow-orange-900/5">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="h-full w-full flex flex-col justify-between">
              <div className="space-y-8">
                {/* Wallet Address */}
                <div className="space-y-3">
                  <Label
                    htmlFor="walletAddress"
                    className="text-base font-medium"
                  >
                    Client Wallet Address
                  </Label>
                  <Input
                    id="walletAddress"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="h-12 rounded-xl font-mono text-sm border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10"
                    disabled={isLoading}
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Prescription Frequency
                  </Label>
                  <Select
                    value={frequency}
                    onValueChange={setFrequency}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Daily</SelectItem>
                      <SelectItem value="2">Twice Daily</SelectItem>
                      <SelectItem value="3">Thrice Daily</SelectItem>
                      <SelectItem value="7">Weekly</SelectItem>
                      <SelectItem value="30">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#EA580B] hover:bg-[#EA580B]/90 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                {isLoading ? "Generating Proof..." : "Get Proof"}
              </Button>
            </div>

            {/* Right Column - Medicines */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Medicines</Label>
              <div className="space-y-4 h-[350px] overflow-y-auto pr-2 medicine-list">
                {medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-start animate-fadeIn bg-orange-50/50 dark:bg-orange-900/5 p-4 rounded-xl"
                  >
                    <div className="col-span-6">
                      <Input
                        type="number"
                        placeholder="Medicine ID"
                        value={medicine.medicineId}
                        onChange={(e) =>
                          updateMedicine(index, "medicineId", e.target.value)
                        }
                        className="rounded-lg border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={medicine.quantity}
                        onChange={(e) =>
                          updateMedicine(index, "quantity", e.target.value)
                        }
                        className="rounded-lg border-orange-600/20 focus:border-orange-600/30 focus:ring-orange-600/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedicine(index)}
                        className="w-9 h-9 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20"
                        disabled={medicines.length === 1 || isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addMedicine}
                className="w-full py-5 rounded-xl border-2 border-dashed border-orange-600/20 transition-all duration-200 hover:border-orange-600/40 hover:bg-orange-50 dark:hover:bg-orange-600/10 disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .medicine-list::-webkit-scrollbar {
          width: 6px;
        }

        .medicine-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .medicine-list::-webkit-scrollbar-thumb {
          background-color: rgba(234, 88, 11, 0.2);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .medicine-list::-webkit-scrollbar-thumb:hover {
          background-color: rgba(234, 88, 11, 0.3);
        }
      `}</style>
    </div>
  );
};

export default PrescriptionForm;
