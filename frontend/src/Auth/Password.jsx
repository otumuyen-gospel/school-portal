import StudentIcon from "@mui/icons-material/SchoolOutlined";
import MuiAlert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const isMobile = useMediaQuery('(max-width:700px)');

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
          <Typography color="darkblue">Request New Password</Typography>
          <Typography component="p" sx={{
                  textAlign:"center",
                  marginTop:1,
                  color:error ? "red" : "#AAA",
             }}>
              {error ? error :"Change Password"}
            </Typography>
         </Grid>
          <Grid item size={{xs:12,}}>
            <span>New Password</span>
            <input
            required
            id="password"
            label="password"
            className="form-fields"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
            name="password"
            autoFocus/>
            <span style={{color:"red", fontSize:"10px"}}>{passwordError}</span>
          </Grid>
          <Grid item size={{xs:12,}}>
            <span>Confirm Password</span>
            <input 
            required
            id="confirm"
            className="form-fields"
            label="confirm"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form,
                confirm: e.target.value })}
            name="confirm"
            />
            <span style={{color:"red", fontSize:"10px"}}>{confirmError}</span>
          </Grid>
          <Grid item size={{xs:12,}}>
            <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2, ml:0, height:"45px",width:"100%",
            backgroundColor:"darkblue", border:"2px solid darkblue"}}>
              Change</Button>
          </Grid>
          <Grid item size={{xs:12,}}>
            <div className="linkContainer">
               <Link to="/">Login Here</Link>
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
      </form>
    </div>

  );


}

export default Password;