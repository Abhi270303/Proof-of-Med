import { Grid } from "@mui/material";
import "../pages/doctorForm.css";
import upload from "../public/Images/upload-icon-.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import abi from "../abi/abi.json";

function ClientUpload() {
  const ethers = require("ethers");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setError(""); // Clear any previous errors
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile);
      console.log("File type:", selectedFile.type);

      // Check if file is JSON either by type or extension
      const isJsonFile =
        selectedFile.type === "application/json" ||
        selectedFile.name.toLowerCase().endsWith(".json");

      if (!isJsonFile) {
        setError("Please upload a JSON file");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          console.log("File content:", event.target.result);
          // Validate JSON format
          const jsonContent = JSON.parse(event.target.result);
          console.log("Parsed JSON:", jsonContent);

          uploadFile(jsonContent);

          // Validate required structure
          if (!jsonContent.medicines) {
            setError("JSON file must contain a 'medicines' property");
            return;
          }

          setFile({
            content: jsonContent,
            name: selectedFile.name,
          });
          console.log("File state set successfully");
        } catch (err) {
          setError("Invalid JSON format. Please check your file.");
          console.error("JSON parse error:", err);
        }
      };

      reader.onerror = function () {
        setError("Error reading file");
        console.error("FileReader error:", reader.error);
      };

      reader.readAsText(selectedFile);
    }
  };

  const uploadFile = async (jsonContent) => {
    try {
      console.log("Starting upload process");

      if (
        !jsonContent ||
        !jsonContent.medicines ||
        !Array.isArray(jsonContent.medicines)
      ) {
        setError("Invalid medicines data format");
        return;
      }

      console.log("Requesting ethereum accounts...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);

      console.log("Setting up Web3Provider...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(await signer.getAddress());
      // Get the connected network
      const network = await provider.getNetwork();
      console.log("Connected to network:", network);

      console.log("Creating contract instance...");
      const contract = new ethers.Contract(
        "0x2B6002EbDfa9c1DD4c8B1bAE809cE4eC90246A3C",
        abi,
        signer
      );

      const medicineIds = jsonContent.medicines.map((med) => {
        if (typeof med === "object") {
          return med.id || med.medicineId || 0;
        }
        return Number(med);
      });

      console.log("Formatted medicine IDs:", medicineIds);

      if (medicineIds.some((id) => isNaN(id))) {
        setError("Invalid medicine ID format");
        return;
      }

      // Try to estimate gas first to check if the call will fail
      try {
        const gasEstimate = await contract.estimateGas.getPrice(medicineIds);
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        throw new Error(
          `Transaction would fail: ${gasError.reason || gasError.message}`
        );
      }

      console.log("Calling getPrice with formatted medicines:", medicineIds);
      let price = await contract.getPrice(medicineIds);
      console.log("Received price:", price.toString());

      navigate("/clientForm", { state: { file: jsonContent, price: price } });
    } catch (err) {
      const errorMessage = err.message || "Unknown error occurred";
      console.error("Upload error details:", err);

      // More detailed error handling
      if (err.code === "CALL_EXCEPTION") {
        const details = [];
        if (err.data) details.push(`Data: ${err.data}`);
        if (err.reason) details.push(`Reason: ${err.reason}`);
        if (err.errorArgs)
          details.push(`Error args: ${JSON.stringify(err.errorArgs)}`);
        if (err.errorName) details.push(`Error name: ${err.errorName}`);
        if (err.errorSignature)
          details.push(`Error signature: ${err.errorSignature}`);

        setError(
          `Contract call failed: ${
            details.join(", ") || "No additional error details"
          }`
        );
      } else {
        setError("Error uploading file: " + errorMessage);
      }
    }
  };

  return (
    <div className="doctor-main">
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <div className="main-container">
            <div className="login-header">
              <div
                style={{
                  width: "inherit",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <h1>UPLOAD PROOF</h1>
              </div>
            </div>

            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justifyContent="center"
            >
              <div className="content-login">
                <div className="inner-form">
                  <div className="file-upload-wrap">
                    <input
                      className="file-upload-input"
                      type="file"
                      onChange={handleFileChange}
                      accept=".json,application/json"
                    />
                    <div className="drag-text">
                      <h2>Drag and drop a JSON file</h2>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="error-message"
                      style={{
                        color: "red",
                        marginTop: "10px",
                        padding: "10px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {file && (
                    <>
                      <div className="file-upload-content">
                        <span
                          style={{
                            color: "whitesmoke",
                            fontSize: "18px",
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {file.name}
                        </span>
                      </div>

                      <div className="btn-container">
                        <img
                          width="45px"
                          height="45px"
                          src={upload}
                          alt="upload"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                className="btn-upload"
                onClick={uploadFile}
                style={{ marginTop: "20px" }}
              >
                Upload
              </button>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ClientUpload;
