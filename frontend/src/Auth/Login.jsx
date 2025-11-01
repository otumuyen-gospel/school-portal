
import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Login(){
  const navigate = useNavigate();
  const [form, setForm] = useState({username:"",password:""});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const isMobile = useMediaQuery('(max-width:700px)');

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
    <div style={{backgroundColor:"#F9F9F5", minHeight:"100vh", overflow:"hidden"}}>
      <Typography style={{color:"darkblue", textAlign:"center",fontWeight:"bolder",
        marginTop:isMobile ? "40px" : "auto",
      }}>
        De Modern Pace School</Typography>
      <form onSubmit={handleSubmit} style={{backgroundColor:"#FFF", margin:isMobile ? "25px 3%" : "18px 30%",
       width:isMobile ? "90%" :"30%",padding: isMobile ? "20px 2%" : "15px 5%",
        border:"0.5px solid #EEE",
      }}>
      <Grid container spacing={1}>
         <Grid item size={{xs:12,}} textAlign="center">
          <StudentIcon style={{color:"darkblue",
            width:"40px", height:"40px"}}/>
          <Typography color="darkblue">Login</Typography>
          <Typography component="p" sx={{
                  textAlign:"center",
                  marginTop:1,
                  color:error ? "red" : "#AAA",
             }}>
              {error ? error :"Login here"}
            </Typography>
         </Grid>
          <Grid item size={{xs:12,}}>
            <TextField
            required
            fullWidth
            sx={{
                mt: 2, mb: 2,
                '& .MuiInputBase-root':{
                height:"50px",
              },
              '& .MuiOutlinedInput-input':{
                height:"50px",
                paddingTop:0,
                paddingBottom:0,
              },
            }}
            id="username"
            label="username"
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form,
                username: e.target.value })}
            name="username"
            autoFocus/>
          </Grid>
          <Grid item size={{xs:12,}}>
            <TextField
            required
            fullWidth
            sx={{
                mt: 2, mb: 2,
                '& .MuiInputBase-root':{
                height:"50px",
              },
              '& .MuiOutlinedInput-input':{
                height:"50px",
                paddingTop:0,
                paddingBottom:0,
              },
            }}
            id="password"
            label="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form,
                password: e.target.value })}
            name="password"
            />
          </Grid>
          <Grid item size={{xs:12,}}>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isDisabled}
            sx={{mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue"}}>
              Login</Button>
          </Grid>
          <Grid item size={{xs:12,}}>
            <div className="linkContainer">
               <Link to="/request">Forgot Password?</Link>
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
          </Grid>
      </Grid>
      </form>
    </div>
    
  );

}

export default Login;