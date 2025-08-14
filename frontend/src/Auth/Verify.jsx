import EmailIcon from "@mui/icons-material/Email";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login(){
  const navigate = useNavigate();
  const location = useLocation()
  const receivedData = location.state;
  const [otps, setOtps] = useState("");
  const [error, setError] = useState(null);
  const [otpsError, setOtpsError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSubmit=(event)=>{
    setIsDisabled(true)  //disable button
    event.preventDefault();
    if(!event.target.checkValidity()){
      setOtpsError("Please enter the OTP sent to your email");
      setIsDisabled(false) //re-enable button
      return;
    }else{
       if(otps.length !== 6){
        setOtpsError("Please enter the OTP sent to your email");
        setIsDisabled(false) //re-enable button
        return;
      }
    }
    
    const data =  {email:receivedData.userEmail, otp:otps};
    setIsLoading(true);
    axios.post("http://localhost:8000/auth/reset/verify/",
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          px: 4,
          py: 4,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor:"#FFFFFF",
        }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.main', // Example background color from theme palette
            borderRadius: '50%', // Makes it circular
            padding: '8px', // Add some padding around the icon
            display: 'inline-flex', // Ensures the box wraps tightly around the icon
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white', // Set icon color
      }}
        >
          <EmailIcon></EmailIcon>  
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2 }}>Verify</Button>

           <Link to="/">Login instead?</Link>
          {isLoading && <CircularProgress />}
        </Box>
      </Box>
      
    </Container>
    
  );

}

export default Login;