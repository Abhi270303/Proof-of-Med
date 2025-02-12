import { Grid } from "@mui/material";
import "../pages/doctorForm.css";
import cart from "../public/Images/cart-icon.png";
import { useNavigate } from "react-router";
import back from "../public/Images/back.png";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import abi from "../abi/abi.json";
import { poseidon4, poseidon10 } from "poseidon-lite";
import MuiAlert from "@mui/material/Alert";
import { padHash } from "../utils/sindri";

function ClientForm() {
  const ethers = require("ethers");
  const navigate = useNavigate();
  const location = useLocation();
  const [clientAddress, setClietnAddress] = useState();
  const [open, setIsOpen] = useState(false);
  const [price, setPrice] = useState();
  console.log(location.state, "file");
  const vertical = "top";
  const horizontal = "right";
  //setPrice(ethers.utils.formatEther(location.state.price))
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleUploadChange = () => {
    navigate("/clientUpload");
  };

  const handleClientForm = async (event) => {
    try {
      event.preventDefault();
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x1A44477AF531Ab811cd82772477f40750e763ff9",
        abi,
        signer
      );

      // Format doc_address
      const doc_add = ethers.utils.hexlify(
        ethers.utils.zeroPad(location.state.file.doc_address, 32)
      );

      // Handle medicines array hashing
      const paddedMedicines = [...location.state.file.medicines];
      while (paddedMedicines.length < 10) {
        paddedMedicines.push(0);
      }
      const medicines10 = paddedMedicines.slice(0, 10);
      const med_hash = poseidon10(medicines10).toString(16);

      // Convert values to numbers before hashing
      const detailInputs = [
        Number(location.state.file.doc_address) || 0,
        Number(location.state.file.client_address) || 0,
        location.state.file.use_once ? 1 : 0,
        Number(location.state.file.freq) || 0,
      ];

      const detail_hash = poseidon4(detailInputs).toString(16);

      console.log("Medicines array:", medicines10);
      console.log("Medicine hash:", med_hash);
      console.log("Detail hash:", detail_hash);

      let tx = await contract.buyMedicine(
        "0x" + location.state.file.proof,
        [doc_add, padHash(med_hash), padHash(detail_hash)],
        clientAddress,
        location.state.file.medicines,
        {
          value: ethers.utils.parseEther(
            Number(location?.state?.price?._hex).toString()
          ),
        }
      );

      console.log("Transaction:", tx);
      if (tx) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error in handleClientForm:", error);
      // Add user-friendly error handling here
    }
  };

  const handleInput = (event, type) => {
    if (type === "clientAddress") {
      setClietnAddress(event.target.value);
    } else {
      setPrice(event.target.value);
    }
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      <Grid container justifyContent={"left"}>
        <div className="nav-client" onClick={handleUploadChange}>
          <img width="50px" height="50px" src={back} alt="back" />
          {/* <button className="btn-nextpage" onClick={handleUploadChange}><img></img> </button> */}
        </div>
      </Grid>
      <div className="client-main">
        {/* <Grid container justifyContent={"center"} alignContent={"center"} alignItems={"center"}> */}

        <Grid
          item
          xs={12}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
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
                <h1> LOGIN AS CLIENT</h1>
              </div>
            </div>
            <div className="content">
              <form className="form-doc">
                <div className="form-innercontent">
                  <label>Address</label>
                  <input
                    type="text"
                    className="single"
                    onChange={(e) => handleInput(e, "clientAddress")}
                  />
                </div>
                <div className="form-innercontent">
                  <label>Total Price</label>
                  <input
                    type="text"
                    className="single"
                    onChange={(e) => handleInput(e, "price")}
                    value={Number(location?.state?.price?._hex)}
                  />
                </div>
                <div className="form-innercontent">
                  <label style={{ visibility: "hidden" }}>Client Address</label>
                  <div className="btn-pay">
                    <img width="30px" height="30px" src={cart} alt="cart" />
                    <button
                      className="btn"
                      style={{ cursor: "pointer" }}
                      onClick={handleClientForm}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={3000}
          severity="success"
          onClose={handleClose}
          ContentProps={{
            sx: {
              background: "whitesmoke",
            },
          }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{
              width: "100%",
              borderRadius: "6px",
              fontSize: "12px",
              background: "whitesmoke",
              color: "black",
            }}
          >
            Medicine ordered successfully
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
export default ClientForm;
