import LogoIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Request(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const validateEmail = (email)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const handleSubmit=(event)=>{
    setEmail("");
    setIsDisabled(true)  //disable button
    event.preventDefault();
    if(event.target.checkValidity()){
      if(!validateEmail(email)){
          setEmailError("Please enter your correct email");
           setIsDisabled(false)  //re-enable button
           return;
      }
     
    }
    setIsLoading(true);
    axios.post("http://localhost:8000/auth/reset/request/",
      {email}).then((res) => {
        setIsLoading(false)
        navigate("/verify/", {state:{ userEmail:email, }});
        setIsDisabled(false)  //re-enable button
      }).catch((err) => {
        setIsLoading(false)
         setIsDisabled(false)  //re-enable button
        if (err.message) {
          setError("Unable to verify this email");
        }
      })
  }

  return(
    <div className="holder">
      <div className="overlay">
    <Grid container direction="column">
      <Grid item xs={6}>
        <Container component="main" maxWidth="xs" sx={{
          marginTop:{xs:"60px"},

          }}>
        <Box
        sx={{
          px: 4,
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor:"#FFFFFF",
          minWidth:{sm:"38%",md:"48%"},
         }}
         >
         <Box
          sx={{
            padding: '8px', // Add some padding around the icon
            display: 'inline-flex', // Ensures the box wraps tightly around the icon
            alignItems: 'center',
            justifyContent: 'center',
            color: 'royalblue', // Set icon color
          }}
          >
          <LogoIcon></LogoIcon>  
          </Box>
         
         <Typography component="h1" variant="h5">
          Email Verification
         </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Enter Your email address"}
         </Typography>
         <Box component="form" onSubmit={handleSubmit} sx={{
          width:{xs:"100%"},
          }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            helperText={emailError}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            autoComplete="email"
            autoFocus
           />
           <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 4, mb: 2 }}>Submit</Button>

            <div className="linkContainer">
              <Link to="/">Login instead?</Link>
            </div>
            <div className="loaderContainer">
              {isLoading && <CircularProgress />}
            </div>
           
            </Box>
          </Box>
      
        </Container>
      </Grid>
    </Grid>
    </div>
    </div>
  );

}

export default Request;