import { Grid } from "@mui/material";
import "../pages/doctorForm.css";
import upload from "../public/Images/upload-icon-.png";
import DropDown from "../public/Images/download.png";
import { useState } from "react";
import sample from "../public/txt/sample.txt";
import { useNavigate } from 'react-router';
import back from "../public/Images/back.png";

function DoctorDownload(){     
    const navigate=useNavigate()
    const handleUploadChange=()=>{
     navigate("/doctorForm");
    }
    return(
        <>
         <Grid container justifyContent={"left"} >
            <div className="nav-client" onClick={handleUploadChange}>
            <img width="50px" height="50px" src={back} alt="back"/>
            {/* <span onClick={handleUploadChange}>Client Form</span> */}
            </div>
          </Grid>
     
        <div className="doctor-main">
        <Grid container justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
            
    <Grid item xs={12} justifyContent={"center"} alignContent={12} alignItems={12}>
        <div className="main-container">
    <div className="login-header">
        <div style={{width:"inherit",display:"flex",justifyContent:"flex-start"}}>
       <h1> DOWNLOAD FILE</h1>
       </div>
       </div>
      
   <Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>

<div className="content-login">

<div className="inner-form" >
{/* <input className="custom-file-input" type="file" onChange={handleFileChange} /> */}
<div class="image-upload-wrap">
  
    <div className="drag-file">
        <div className="btn-pay">
    <a href={sample}   download="samplDownload"
        target="_blank"
        rel="noreferrer" className="drag-download"><img width="40px" height="30px" src={DropDown} alt="dropdown"/>Downlaod File</a>
        </div>
    </div>
  </div>
 
</div>

</div>
</Grid>
    </div>
    </Grid>
        </Grid>
        </div>
        </>
        )
}
export default DoctorDownload;