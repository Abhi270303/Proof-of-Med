import { useEffect, useState } from "react";
import '../components/navigation.css';
import { Grid } from "@mui/material";
import dropdownArrow from "../public/Images/dropdown_arrow.jpg";
import { useNavigate } from "react-router-dom";

function Navigation({setAccount,setIsConnected,isConnected}) {
   const [isDropdown,setisDropdown]= useState(false);
   const navigate=useNavigate();
const connectWallet=async(user)=>{    
  setisDropdown(false);
  console.log(user);
    if (window.ethereum) {
        try{
     const accounts= await window.ethereum.request({ method: 'eth_requestAccounts' });
     console.log(accounts,"accounts")
     if(accounts.length>0){
     setAccount(accounts[0])
     localStorage.setItem("walletAddress",accounts[0]);
     localStorage.setItem("user",user);
     setIsConnected(true);
     if(user==="doctor"){
      navigate("/doctorForm")
         }
         else{
          navigate("/clientUpload")
         }
     
     }
     else{
        setIsConnected(false);
        console.log("no eth")
     }
    }
    catch{
        console.log("user refused to connect")
    }
     //If yes
     //setIsConnected(true);
     //setIsNickName(false)
     //else
   
     //send another api with nickname and wallet address
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    else{
        alert("Please install metamask");
        window.open('https://metamask.io/','_blank')
    }
  }

  const myFunction=()=>{
    setisDropdown((prev)=>!prev)
  }
  useEffect(()=>{
    if(window.ethereum){
     window.ethereum.on('accountsChanged', (accounts) => {
     if(accounts?.length===0){
     localStorage.clear();
     setIsConnected(false);
     }
   });
    }
   },[])
   useEffect(()=>{
    if(localStorage.getItem("walletAddress")!==null && localStorage.getItem("walletAddress")!=='' && localStorage.getItem("walletAddress")!==undefined){
      setIsConnected(true)
    }
       else{
        setIsConnected(false)
       }
    },[])
   
  return (
    <div className="nav-main">
     
      <Grid container justifyContent={"right"}  sx={{height:"80px"}}>
    
    {/* {!isConnected?
  <a className="button-connect" style={{"&:hover": { color: 'white'}}} onClick={()=>connectWallet('doctor')}>LOGIN AS DOCTOR</a>
  : <><Grid item xs={2} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
   <FontAwesomeIcon icon={faHome} />
  </Grid>
  </>} */}
  
  

    {!isConnected? 
  // <a className="button-connect" style={{"&:hover": { color: 'white'},}} onClick={()=>connectWallet('client')}>LOGIN AS CLIENT</a>
  // : <><Grid item xs={2} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
  // <img width="55px" height="55px" src={user} alt="user" style={{opacity:"1"}} />
  // </Grid>
  // </>
  <div className="dropdown" style={{height:"100px",marginRight:"60px",marginTop:"10px"}}>
    <div className="dropbtn" onClick={myFunction}>
      <img width="20px" height="20px" src={dropdownArrow} alt="dropdownArrow"/>
  <button className="btn-login">LOGIN</button>
  </div>
{isDropdown?
 
        <div className="list-main" >
              <div className='list-item' onClick={() => connectWallet("doctor")}>
                 Doctor
              </div>
              <div className='list-item' onClick={() => connectWallet("client")}>
                  Client
              </div>
        </div>:""}
   
  
</div>:""
}
  
  </Grid>
 
  </div>
  )
}
export default Navigation;
