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
import bg from "../bg.jpg";


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
    axios.post("http://192.168.1.9:8000/auth/login/",
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
            Login
          </Typography>
         <Typography component="p" sx={{
          textAlign:"center",
          marginTop:1,
          color:error ? "red" : "#FFF",
          }}>
          {error ? error :"Login here "}
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
            sx={{ mt: 3, mb: 2, width:"60%", height:"50px",
             borderRadius:"10px",}}>Login</Button>
          <div className="linkContainer">
            <Link to="/request" style={{color:"#CCC", '&:hover': {
          color: 'lightblue', // Color on hover
        },}}>
            Forgot Password?</Link>
          </div>
         <div className="loaderContainer">
           {isLoading && <CircularProgress sx={{
              '& .MuiCircularProgress-circle': {
              stroke: '#FFF', 
             },
             '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
              stroke: '#FFF', 
             },
        }}/>}
         </div>
        
        </Box>
      </Box>
    </Grid>
    </Grid>
     </Box>
    </Box>
  );

}

export default Login;