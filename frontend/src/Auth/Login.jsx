import LockIcon from "@mui/icons-material/Lock";
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

function Login(){
  const navigate = useNavigate();
  const [form, setForm] = useState({username:"",password:""});
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSubmit=(event)=>{
    setIsDisabled(true)  //disable button
    event.preventDefault();
    const data = {
      username:form.username,
      password:form.password,
    };
    if(!event.target.checkValidity()){
      if(data.username.trim() === ""){
         setNameError("Please enter your username");
      }
      if(data.password.trim() === ""){
        setPasswordError("Please enter your password")
      }
      setIsDisabled(false)  //re-enable button
      return;
    }
    setIsLoading(true);
    axios.post("http://localhost:8000/auth/login/",
      data).then((res) => {
        // Registering the account and tokens in the store
        localStorage.setItem("auth", JSON.stringify({
          access: res.data.access,
          refresh: res.data.refresh,
          user: res.data.user,
        }));
        setIsLoading(false)
        navigate("/dashboard/");
        setIsDisabled(false)  //re-enable button
      }).catch((err) => {
        setIsLoading(false)
        setIsDisabled(false)  //re-enable button
        if (err.message) {
          setError(`Oops! sorry can't log you in.
            Ensure your credentials are correct and
            that you have an active connection`);
        }
      })
  }

  return(
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          px: 4,
          py: 4,
          marginTop: 1,
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
          <LockIcon></LockIcon>  
        </Box>
         
         <Typography component="h1" variant="h5">
          Login
        </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Welcome to the school portal log in your credentials to access your portal"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            helperText={nameError}
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form,
                username: e.target.value })}
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            helperText={passwordError}
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2 }}>Login</Button>
            
            <Grid container direction="row">
              <Grid item>
                 <Link to="/request/">Forgot Password?</Link>
              </Grid>
              <Grid  item>
                 {isLoading && <CircularProgress />}
              </Grid>
            </Grid>
          
         
        </Box>
      </Box>
      
    </Container>
    
  );

}

export default Login;