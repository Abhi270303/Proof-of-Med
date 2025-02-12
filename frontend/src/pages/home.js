import { useState } from "react";
import Navigation from "../components/navigation";
import { Grid } from "@mui/material";
import Spline from "@splinetool/react-spline";
import sample from "../public/txt/sample.txt";
import doc from "../public/Images/doc.jpg";
import patient from "../public/Images/patient.jpg";
import '../pages/home.css';
import { useNavigate } from "react-router";
import logo from "../public/Images/logo.png";
import groupBuild from "../public/Images/group-built.png";

function Home(){
    const [account,setAccount]=useState("");
    const [isConnected,setIsConnected]=useState(false);
    const [file, setFile] = useState();
    const navigate=useNavigate();
    const customStyles = {
      // Your custom styles here
      height: '600px',
      display: "flex",
      alignItems:"center",
      // position: "webkit-sticky",
      padding:0,
      position:"fixed",
      top:150,
      // Add other styles as needed
    };
    // const connectWallet=async(user)=>{      
    //   if (window.ethereum) {
    //       try{
    //    const accounts= await window.ethereum.request({ method: 'eth_requestAccounts' });
    //    console.log(accounts,"accounts")
    //    if(accounts.length>0){
    //    setAccount(accounts[0])
    //    localStorage.setItem("walletAddress",accounts[0]);
    //    localStorage.setItem("user",user);
    //    setIsConnected(true);
    //    if(user==="doctor"){
    //    navigate("./doctorForm")
    //    }
    //    else{
    //     navigate("./clientForm")
    //    }
    //    }
    //    else{
    //       setIsConnected(false);
    //    }
    //   }
    //   catch{
    //       console.log("user refused to connect")
    //   }
    //   }
    //   else{
    //       alert("Please install metamask");
    //       window.open('https://metamask.io/','_blank')
    //   }
    // }

    const handleFileChange = (e) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
  

    const handleUploadClick = () => {
        console.log(file)
    }
return(
    <div className="main-div">
   
    <Grid item xs={12} sx={{paddingLeft:"2px",paddingRight:"2px"}}>
        <div >
    <Navigation setAccount={(account)=>setAccount(account)} setIsConnected={(isConnected)=>{setIsConnected(isConnected)}} isConnected={isConnected}/>
    </div>
    </Grid>
    
    <div className="logo-header">
    ZK-Med
    <Spline scene="https://prod.spline.design/dAsHc-Kv7nRZOB1c/scene.splinecode" style={customStyles}/>
    </div>
    <Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>


<div style={{visibility:"hidden",height:"100px"}}>

</div>

</Grid>
    <Grid container item xs={12}>
        <Grid item xs={2} ></Grid>
        <Grid item xs={9} className="about-container">
        <div  className="about-us">
<h1>ABOUT ZK-Med</h1>
<p>Welcome to our state-of-the-art Web3 pharmaceutical platform, where your health and privacy are paramount. 
Our online pharmacy is dedicated to providing a secure and seamless experience for users seeking quality medications. 
Leveraging Web3 technology, we ensure the authenticity of prescribing doctors through robust verification processes, 
delivering accurate and reliable medical advice. Our platform prioritizes advanced privacy features, safeguarding customer 
details for a confidential and secure online pharmaceutical experience. 
Trust us for a reliable and private healthcare solution.</p>
</div>
</Grid>
<Grid item xs={1}></Grid>
    </Grid>
    <Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>


<div style={{visibility:"hidden",height:"100px"}}>

</div>

</Grid>
<Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"} >
{/* <div className="built-container"> */}
{/* <div className="content-login"> */}

<div className="inner-form">
  <div style={{position:"relative"}}>
<img width="450px" height="450px" src={groupBuild} alt="group-build" />

{/* </div> */}
</div>

{/* </div> */}
</div>
</Grid>
<Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>


<div style={{visibility:"hidden",height:"50px"}}>

</div>

</Grid>
   
    </div>
)
}
export default Home;