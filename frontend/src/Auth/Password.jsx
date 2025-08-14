import LockIcon from "@mui/icons-material/Lock";
import MuiAlert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, } from "react-router-dom";

function Password(){
  const location = useLocation()
    const receivedData = location.state;
  const [form, setForm] = useState({password:"",confirm:""});
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null)
  const [confirmError, setConfirmError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [open, setOpen] = useState(false); // State to control Snackbar visibility
  const [popMsg, setPopMsg] = useState("")

   const handleClick = () => {
    setOpen(true); // Open the Snackbar
  };

  const handleClose = (event, reason) => {
    // Prevent closing on 'clickaway' to allow user interaction with the Snackbar content
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false); // Close the Snackbar
  };

  const handleSubmit=(event)=>{
    setIsDisabled(true)  //disable button
    event.preventDefault();
    const data = {
      email:receivedData.userEmail,
      new_password:form.password,
    };
    if(!event.target.checkValidity()){
      if(form.password.trim() === ""){
         setPasswordError("Please enter the new password");
      }
      if(form.confirm.trim() === ""){
        setConfirmError("Please confirm new password")
      }
      setIsDisabled(false)  //re-enable button
      return;
    }else{
      if(form.confirm.trim() !== form.password.trim()){
        setConfirmError("Please confirm new password");
         setIsDisabled(false)  //re-enable button
        return;
      }
    }
    setIsLoading(true);
    axios.post("http://localhost:8000/auth/reset/password/",
      data).then((res) => {
        setIsLoading(false)
        setPopMsg(res.data.message + ". you can login now");
        handleClick();
        setIsDisabled(false)  //re-enable button
      }).catch((err) => {
        setIsLoading(false)
        setIsDisabled(false)  //re-enable button
        if (err.message) {
          setError(`Oops! sorry can't change password`);
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
          Change Password
        </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Enter your new password and confirm it"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="password"
            helperText={passwordError}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
            name="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm"
            label="confirm"
            type="password"
            id="confirm"
            helperText={confirmError}
            value={form.confirm}
            onChange={(e) => setForm({ ...form,
                confirm: e.target.value })}
            autoComplete="confirm"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2 }}>Change Password</Button>
            
            <Grid container direction="row">
              <Grid item>
                 <Link to="/">Login</Link>
              </Grid>
              <Grid  item>
                 {isLoading && <CircularProgress />}
              </Grid>
            </Grid>
          
         
        </Box>
      </Box>
      

       <Snackbar
        open={open}
        autoHideDuration={6000} // Automatically close after 6 seconds
        onClose={handleClose}
        message={popMsg}
        // Optional: Customize position
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
        {/* Optional: Use MuiAlert for styled alerts within the Snackbar */}
        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {popMsg}
        </MuiAlert>
      </Snackbar>


    </Container>
    
  );

}

export default Password;