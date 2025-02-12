import { Grid } from "@mui/material";
import "../pages/doctorForm.css";
import crossArrows from "../public/Images/Crossarrows.png";
import { useEffect, useState } from "react";
import { poseidon4, poseidon10 } from "poseidon-lite";
import addMore from "../public/Images/AddMore.png";
import { getProof } from "../utils/sindri";

function DoctorForm() {
  const ethers = require("ethers");
  const [inputFields, setInputFields] = useState([]);
  const [inputs, setInputs] = useState([
    {
      type: "text",
      id: 1,
      value: "",
    },
  ]);
  const [medicine, setMedicine] = useState([]);
  const [quant, setQuant] = useState([]);
  const [clientAddress, setClientAddress] = useState();
  const [frequency, setFrequncy] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState();
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    let acc = localStorage.getItem("walletAddress");
    setAccount(acc);
  }, []);
  const getSignatureInfo = async (message, signature) => {
    // Compute the message's digest
    const messageDigest = ethers.utils.hashMessage(message);
    const messageDigestBytes = ethers.utils.arrayify(messageDigest);

    // Recover the public key
    const publicKey = ethers.utils.recoverPublicKey(messageDigest, signature);

    // Remove the '0x04' prefix from the uncompressed public key
    const publicKeyNoPrefix = publicKey.slice(4);

    // Extract X and Y coordinates (each coordinate is 64 characters long in hex)
    const publicKeyX = publicKeyNoPrefix.substring(0, 64);
    const publicKeyXBytes = ethers.utils.arrayify("0x" + publicKeyX);
    const publicKeyY = publicKeyNoPrefix.substring(64);
    const publicKeyYBytes = ethers.utils.arrayify("0x" + publicKeyY);

    // Split the signature into r, s, and v components
    const r = signature.slice(0, 66); // First 32 bytes
    const s = "0x" + signature.slice(66, 130); // Next 32 bytes

    // Convert r and s to byte arrays
    const rBytes = ethers.utils.arrayify(r);
    const sBytes = ethers.utils.arrayify(s);

    // Concatenate r and s to get a 64-byte array
    const signatureBytes = new Uint8Array([...rBytes, ...sBytes]);

    return {
      messageDigestBytes,
      publicKeyXBytes,
      publicKeyYBytes,
      signatureBytes,
    };
  };
  const formatBlockchainInfo = (clientAdd, docAdd, medicine, freq) => {
    // Convert hexadecimal values to integers for better readability (if needed)
    // Create the formatted string
    let formattedString = `Client Address: ${clientAdd}\nDoctor Address: ${docAdd}\nMedicine and Quantity: ${medicine}\nfrequency: ${freq}`;

    return formattedString;
  };

  const padMedicines = (med) => {
    // Create a new array with 10 elements
    const padded = [...med];
    // Fill remaining elements with 0
    while (padded.length < 10) {
      padded.push(0);
    }
    // If more than 10 elements, take only first 10
    return padded.slice(0, 10);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(medicine, quant);
    let med = [];
    for (let i = 0; i < medicine.length; i++) {
      for (let j = 0; j < quant.length; j++) {
        if (medicine[i].id === quant[j].id) {
          med.push(medicine[i].value);
          med.push(quant[j].value);
          console.log(med, "med");
        }
      }
    }
    console.log(clientAddress, frequency, med, "total");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    if (!signer) {
      console.error("Signer is not set");
      return;
    }

    try {
      const signatureValue = await signer.signMessage(
        formatBlockchainInfo(clientAddress, account, med, frequency)
      );
      setSignature(signatureValue);
      console.log("Signature:", signatureValue);
      const signatureResult = await getSignatureInfo(
        formatBlockchainInfo(clientAddress, account, med, frequency),
        signatureValue
      );
      console.log(signatureResult);
      const hash = poseidon4([
        account,
        clientAddress,
        Number(frequency > 0 ? 0 : 1),
        Number(frequency),
      ]);
      console.log(hash, "hash");
      const medicines = padMedicines(med);
      const result = poseidon10(medicines);
      console.log(result, "poseidon10");
      const proofResult = await getProof(
        clientAddress,
        account,
        med,
        frequency > 0 ? 0 : 1,
        frequency,
        result,
        hash,
        signatureResult["messageDigestBytes"],
        signatureResult["publicKeyXBytes"],
        signatureResult["publicKeyYBytes"],
        signatureResult["signatureBytes"]
      );
      const jsondata = {
        doc_address: account,
        client_address: clientAddress,
        use_once: frequency > 0 ? 0 : 1,
        freq: frequency,
        medicines: med,
        proof: proofResult,
      };
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(jsondata)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";

      link.click();
    } catch {
      console.log("Error");
    }
  };

  const addInputField = (event) => {
    event.preventDefault();
    setInputs((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
    setCounter((prev) => prev + 1);
  };
  const handleChange = (value, ind, evnt) => {
    console.log(evnt.target.value, ind);
    // const { name, value } = evnt.target;
    // const list = [...inputFields];
    // list[index][name] = value;
    // setInputFields(list);
    if (value === "clientAddress") {
      setClientAddress(evnt.target.value);
    } else if (value === "medicineId") {
      console.log(medicine?.length, "length");
      let medc = [];
      medc.push(...medicine);
      console.log(medc, "bef");
      medc = medc.filter(function (obj) {
        return obj.id !== ind;
      });
      medc.push({ id: ind, value: evnt.target.value });

      console.log(medc, "after filter medc");
      setMedicine(medc);
    } else if (value === "quantity") {
      let quants = [];
      quants.push(...quant);
      console.log(quants, "bef");
      quants = quants.filter(function (obj) {
        return obj.id !== ind;
      });
      quants.push({ id: ind, value: evnt.target.value });

      console.log(quants, "after filter quants");
      setQuant(quants);
    } else if (value === "frequency") {
      setFrequncy(evnt.target.value);
    }
  };
  return (
    <div className="doctor-main">
      <Grid
        container
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Grid
          item
          xs={12}
          justifyContent={"center"}
          alignContent={12}
          alignItems={12}
        >
          <div className="main-container">
            <div className="login-header">
              <div
                style={{
                  width: "inherit",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <h1> LOGIN AS DOCTOR</h1>
              </div>
            </div>
            <div className="content">
              <form className="form-doc">
                <div className="form-innercontent">
                  <label>Client Address</label>
                  <input
                    type="text"
                    className="single"
                    onChange={(evnt) => handleChange("clientAddress", 0, evnt)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {inputs.map((data, index) => {
                    const { medicineId, quantity } = data;
                    return (
                      <div style={{ display: "flex" }}>
                        <div className="form-innercontent">
                          <label>Medicine ID</label>
                          <input
                            type="text"
                            className="multiple"
                            onChange={(evnt) =>
                              handleChange("medicineId", index, evnt)
                            }
                          />
                        </div>
                        <div className="form-innercontent">
                          <label>Quantity</label>
                          <input
                            type="text"
                            className="multiple"
                            onChange={(evnt) =>
                              handleChange("quantity", index, evnt)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="btn-add"
                    onClick={addInputField}
                  >
                    <img
                      width="40px"
                      height="40px"
                      src={addMore}
                      alt="addMore"
                    />
                    Add More
                  </button>
                </div>

                <div className="form-innercontent">
                  <label>Frequency</label>
                  <input
                    type="text"
                    className="single"
                    onChange={(evnt) => handleChange("frequency", 0, evnt)}
                  />
                </div>

                <div className="btn-sign" onClick={handleSubmit}>
                  <img
                    width="20px"
                    height="20px"
                    src={crossArrows}
                    alt="crossarrows"
                  />
                  <button className="btn">Get Proof</button>
                </div>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
export default DoctorForm;
