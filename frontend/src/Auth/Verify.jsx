import LogoIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Verify(){
  const navigate = useNavigate();
  const location = useLocation()
  const receivedData = location.state;
  const [otps, setOtps] = useState("");
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
    <Box style={{backgroundColor:"#FFF"}}>
    <Grid container spacing={1}>
      <Grid item size={{xs:12, sm:6}}>
        <Box sx={{
            backgroundColor: {xs:"darkblue", sm:"#FCFCFF", md:"#FCFCFF"},
            minHeight:{xs:"auto", sm:"auto", md:"50vh"},
            paddingTop:{xs:"15px", sm:"15px", md:"25vh"},
            paddingBottom:{xs:"15px", sm:"15px", md:"25vh"},
            textAlign: "center",
          }}>
            <Typography
            sx={{ color: {xs:"#CCC", sm:"darkblue", md:"darkblue"},
              fontWeight:"bolder", 
              fontSize:{xs:"20px", sm:"20px", md:"40px"}
            }}>
              De Modern Pace
            </Typography>
            <Typography
            style={{color:"royalblue", fontWeight:"bolder",
              fontSize:{xs:"15px", sm:"15px", md:"30px"},
            }}>
              Welcome To De Modern Pace 
            </Typography>
            <Typography 
            style={{color:"#999", fontWeight:"bolder",
              fontSize:{xs:"13px", sm:"13px", md:"20px"},
            }}>
              School Portal
            </Typography>
        </Box>
      </Grid>
      <Grid item size={{xs:12, sm:6}}>
        <Box style={{textAlign:"center", marginTop:"50px", marginBottom:"50px"}}>
         <Box
          sx={{
            marginBottom: '4px', // Add some padding around the icon
            textAlign:"center",
            color: 'royalblue', // Set icon color
          }}
          >
          <LogoIcon style={{height:"40px", width:"40%"}}></LogoIcon>  
        </Box>
         <Typography component="h1" variant="h5">
            OTP Email Verification
          </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Verify the OTP sent to your email"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            sx={{
              width:"60%",
              '& .MuiInputBase-root':{
                  height:"50px",
                  borderRadius:"10px",
              },
              '& .MuiOutlinedInput-input':{
                  height:"50px",
                  paddingTop:0,
                  paddingBottom:0,

              },
            }}
            margin="normal"
            required
            fullWidth
            id="otp"
            label="otp"
            type="text"
            maxlength="6"
            minlength="6"
            helperText={otpsError}
            value={otps}
            onChange={(e) => setOtps(e.target.value)}
            name="otp"
            autoComplete="otp"
            autoFocus
          /><br/>
          
          <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2, width:"60%", height:"50px",
             borderRadius:"10px",}}>Verify</Button>
          <div className="linkContainer">
            <Link to="/">Login instead?</Link>
          </div>
         <div className="loaderContainer">
           {isLoading && <CircularProgress />}
         </div>
        
        </Box>
      </Box>
    </Grid>
    </Grid>
    </Box>
  );

}

export default Verify;