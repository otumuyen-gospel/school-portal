import LogoIcon from "@mui/icons-material/SchoolOutlined";
import MuiAlert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, } from "react-router-dom";
import bg from "../bg.jpg";

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
      setPasswordError("")
      setConfirmError("");
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
    axios.post("http://192.168.1.9:8000/auth/reset/password/",
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
    <Box style={{
                backgroundImage: `url(${bg})`, //image
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', // Adjust as needed: 'contain', 'auto'
                backgroundPosition: 'center', // Adjust as needed: 'top', 'bottom', 'left', 'right', 'percentage'
                width: '100%', // Set a width for the banner
                display: 'flex', // For content alignment within the banner
                alignItems: 'center', // For vertical alignment of content
                justifyContent: 'center',
        }}>
        <Box sx={{
                  backgroundColor:"rgba(0,0,200,0.7)",
                  width:"100%",
                  minHeight:"100vh",
                 }}>
    <Grid container spacing={1}>
      <Grid item size={{xs:12, sm:6}}>
        <Box
             sx={{
              textAlign:"center",
             }}
             >
            <Typography
            sx={{ color: "#FFF",
              fontWeight:"bolder", 
              fontSize:{xs:"20px", sm:"20px", md:"40px"}
            }}>
              De Modern Pace
            </Typography>
            <Typography
            style={{color:"#FFF", fontWeight:"bolder",
              fontSize:{xs:"15px", sm:"15px", md:"30px"},
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
            color: '#FFF', // Set icon color
          }}
          >
          <LogoIcon style={{height:"40px", width:"40%"}}></LogoIcon>  
        </Box>
         <Typography component="h1" variant="h5" color="#FFF">
            Change Password
          </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "#FFF",
          }}>
          {error ? error :"Change Password "}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            sx={{
              width:"60%",
              '& .MuiInputBase-root':{
                  height:"50px",
                  borderRadius:"10px",
                  backgroundColor:"#FFF",
              },
              '& .MuiOutlinedInput-input':{
                  height:"50px",
                  paddingTop:0,
                  paddingBottom:0,

              },
            }}
            margin="normal"
            required
            id="password"
            label="password"
            helperText={passwordError}
            slotProps={{
              formHelperText:{
                sx: {
                 color: '#CCC', // Change to your desired color
                },
              },
              
           }}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
            name="password"
            autoFocus
          /><br/>
          <TextField
             sx={{
              width:"60%",
              '& .MuiInputBase-root':{
                  height:"50px",
                  borderRadius:"10px",
                  backgroundColor:"#FFF"
              },
              '& .MuiOutlinedInput-input':{
                  height:"50px",
                  paddingTop:0,
                  paddingBottom:0,

              },
            }}
            margin="normal"
            required
            name="Confirm"
            label="Confirm"
            type="password"
            helperText={confirmError}
            slotProps={{
              formHelperText:{
                sx: {
                 color: '#CCC', // Change to your desired color
                },
              },
              
           }}
            id="Confirm"
            value={form.confirm}
            onChange={(e) => setForm({ ...form,
                confirm: e.target.value })}
          /><br/>
          <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2, width:"60%", height:"50px",
             borderRadius:"10px",}}>Change</Button>
          <div className="linkContainer" style={{color:"#CCC", '&:hover': {
          color: 'lightblue', // Color on hover
        },}}>
            <Link to="/" style={{color:"#CCC", '&:hover': {
          color: 'lightblue', // Color on hover
        },}}>Login Here</Link>
          </div>
         <div className="loaderContainer">
           {isLoading && <CircularProgress sx={{
              '& .MuiCircularProgress-circle': {
              stroke: '#FFF', 
             },
             '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
              stroke: '#FFF', 
             },
           }} />}
         </div>
        
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
    </Grid>
    </Grid>
    </Box>
    </Box>
  );


}

export default Password;