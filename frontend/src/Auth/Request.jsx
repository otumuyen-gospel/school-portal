import EmailIcon from "@mui/icons-material/Email";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSubmit=(event)=>{
    setIsDisabled(true)  //disable button
    event.preventDefault();
    if(!event.target.checkValidity()){
      setEmailError("Please enter your correct email");
      setIsDisabled(false)  //re-enable button
      return;
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
          setError("Ensure to enter your correct email address for proper verification");
        }
      })
  }

  return(
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 1,
          px: 4,
          py: 4,
          marginTop: 6,
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
          Email Verification
        </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Enter Your email address for verification of your account"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            sx={{ mt: 3, mb: 2 }}>Submit</Button>

           <Grid container direction="row">
              <Grid item>
                 <Paper><Link to="/">Login instead?</Link></Paper>
              </Grid>
              <Grid item>
                 <Paper>{isLoading && <CircularProgress />}</Paper>
              </Grid>
            </Grid>
        </Box>
      </Box>
      
    </Container>
    
  );

}

export default Login;