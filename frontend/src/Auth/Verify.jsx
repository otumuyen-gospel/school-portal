import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
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
    axios.post("http://192.168.1.11:8000/auth/reset/verify/",
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
    <div style={{backgroundColor:"#FDFDFB", minHeight:"100vh", overflow:"hidden"}}>
      <Typography style={{color:"darkblue", textAlign:"center",fontWeight:"bolder",
        marginTop:isMobile ? "40px" : "auto",
      }}>
        De Modern Pace School</Typography>
       <form onSubmit={handleSubmit}>
      <Box style={{backgroundColor:"#FFF", margin:isMobile ? "25px 3%" : "18px 30%",
       width:isMobile ? "90%" :"30%",padding: isMobile ? "20px 2%" : "15px 5%",
      }} 
      boxShadow={1}
      >
      <Grid container spacing={1}>
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
            <TextField
            required
            fullWidth
            sx={{
              mt: 2, mb: 2,
             '& .MuiInputBase-root':{
              height:"50px",
              },
             '& .MuiOutlinedInput-input':{
              height:"50px",
              paddingTop:0,
              paddingBottom:0,
              },
            }}
            id="otp"
            label="otp"
            type="otp"
            helperText={otpsError}
            value={otps}
            onChange={(e) => setOtps(e.target.value)}
            name="otp"
            autoFocus/>
          </Grid>
          <Grid item size={{xs:12,}}>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue"}}>
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
      </Box>
      </form>
    </div>
  );

}

export default Verify;