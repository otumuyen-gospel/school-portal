import LogoIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
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
        if (err) {
          setError(JSON.stringify(err.response.data['detail']));
        }
      })
  }

  return(
    <Grid container spacing={4}>
      <Grid item size={{xs:12, sm:6}}>
        <div className="holder">
          <div className="overlay">
            <Typography component="h3" variant="h3" 
            style={{color:"white", fontWeight:"bolder"}}>
              De Modern Pace
            </Typography>
            <Typography component="h4" variant="h4" 
            style={{color:"white", fontWeight:"bolder"}}>
              School Portal
            </Typography>
          </div>
        </div>
      </Grid>
      <Grid item size={{xs:12, sm:6}}>
        <Box style={{textAlign:"center", marginTop:"50px"}}>
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
            Login
          </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "primary",
          }}>
          {error ? error :"Login here to access the school portal "}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            sx={{
              width:"60%",
              '& .MuiInputBase-root':{
                  height:"50px",
              },
              '& .MuiOutlinedInput-input':{
                  height:"50px",
                  paddingTop:0,
                  paddingBottom:0,

              },
            }}
            margin="normal"
            required
            id="username"
            label="username"
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form,
                username: e.target.value })}
            name="username"
            autoFocus
          /><br/>
          <TextField
             sx={{
              width:"60%",
              '& .MuiInputBase-root':{
                  height:"50px",
              },
              '& .MuiOutlinedInput-input':{
                  height:"50px",
                  paddingTop:0,
                  paddingBottom:0,

              },
            }}
            margin="normal"
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
          /><br/>
          <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            sx={{ mt: 3, mb: 2, width:"60%",}}>Login</Button>
          <div className="linkContainer">
            <Link to="/request">Forgot Password?</Link>
          </div>
         <div className="loaderContainer">
           {isLoading && <CircularProgress />}
         </div>
        
        </Box>
      </Box>
    </Grid>
    </Grid>
    
  );

}

export default Login;