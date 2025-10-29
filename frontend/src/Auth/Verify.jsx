import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Verify(){
  const navigate = useNavigate();
  const location = useLocation()
  const receivedData = location.state;
  const [otps, setOtps] = useState("");
  const isMobile = useMediaQuery('(max-width:700px)');
  const [error, setError] = useState(null);
  const [otpsError, setOtpsError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

   const otpCodeRegex = (otpCode)=>{
    const otpCodeRegex = /^\d{6}$/;
    return otpCodeRegex.test(otpCode);
  }
  const handleSubmit=(event)=>{
    setIsDisabled(true)  //disable button
    event.preventDefault();
    if(event.target.checkValidity()){
      if(!otpCodeRegex(otps)){
          setOtpsError("Please enter the OTP sent to your email");
          setIsDisabled(false) //re-enable button
          return;
      }
    }
    
    const data =  {email:receivedData.userEmail, otp:otps};
    setIsLoading(true);
    axios.post("http://192.168.1.9:8000/auth/reset/verify/",
     data).then((res) => {
        setIsLoading(false)
        navigate("/password/", {state:{ userEmail:data.email, }});
        setIsDisabled(false) //re-enable button
      }).catch((err) => {
        setIsLoading(false)
        setIsDisabled(false) //re-enable button
        if (err.message) {
          setError("Ensure to enter the correct OTP for proper verification");
        }
      })
  }

  return(

    <div style={{backgroundColor:"#F9F9F5", minHeight:"100vh", overflow:"hidden"}}>
      <Typography style={{color:"darkblue", textAlign:"center",fontWeight:"bolder",
        marginTop:isMobile ? "40px" : "auto",
      }}>
        De Modern Pace School</Typography>
      <form onSubmit={handleSubmit} style={{backgroundColor:"#FFF", margin:isMobile ? "25px 3%" : "18px 30%",
       width:isMobile ? "90%" :"30%",padding: isMobile ? "20px 2%" : "15px 5%"
      }}>
      <Grid container spacing={2}>
         <Grid item size={{xs:12,}} textAlign="center">
          <StudentIcon style={{color:"darkblue",
            width:"40px", height:"40px"}}/>
          <Typography color="darkblue"> OTP Verification</Typography>
          <Typography component="p" sx={{
                  textAlign:"center",
                  marginTop:1,
                  color:error ? "red" : "#AAA",
             }}>
              {error ? error :"Verify the OTP sent to your email"}
            </Typography>
         </Grid>
          <Grid item size={{xs:12,}}>
            <span>OTP</span>
            <input
            required
            id="otp"
            label="otp"
            className="form-fields"
            type="otp"
            value={otps}
            onChange={(e) => setOtps(e.target.value)}
            name="otp"
            autoFocus/>
            <span style={{color:"red", fontSize:"10px"}}>{otpsError}</span>
          </Grid>
          <Grid item size={{xs:12,}}>
            <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2, ml:0, height:"45px",width:"100%",
            backgroundColor:"darkblue", border:"2px solid darkblue"}}>
              Verify</Button>
          </Grid>
          <Grid item size={{xs:12,}}>
            <div className="linkContainer">
               <Link to="/">Login Instead?</Link>
            </div>
            <div className="loaderContainer">
              {isLoading && <CircularProgress sx={{
                '& .MuiCircularProgress-circle': {
                 stroke: 'darkblue', 
                },
               '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
                stroke: 'darkblue', 
               },
            }}/>}
         </div>
          </Grid>
      </Grid>
      </form>
    </div>
  );

}

export default Verify;