import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function UpdateUser(){
  const userId = useLocation().state;
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [telephone, setTelephone] = useState('');
  const [zip, setZip] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [msg, setMsg] = useState("");
  const [password, setPassword] = useState({
    password:'',
    new_password:'',
    confirm:'',
  })
  const hasUpload = useRef('');
  const [form, setForm] = useState({
         pics:"",
         username:"",
         firstname:"",
         lastname:"",
         email:"",
         gender:"",
         role:"",
         address:"",
         nationality:"",
         state:"",
         zipCode:"",
         telephone:"",
         childId:"",
         classId:"",
         entrance:dayjs(),
         dob:dayjs(),
  });

  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }

   useEffect(()=>{
    const profile = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          return response.data;
      }catch(error){
         setMsg(`Oops! sorry can't load data`);
     }
    }

    const url = "accounts/retrieve-user/"+
    userId+"/";
    profile(url).then(data=>{
       setForm({
         pics:data.pics,
         username:data.username,
         firstname:data.firstName,
         lastname:data.lastName,
         email:data.email,
         gender:data.gender,
         role:data.role,
         address:data.address,
         nationality:data.nationality,
         state:data.state,
         zipCode:data.zipCode,
         telephone:data.telephone,
         childId:data.childId,
         classId:data.classId,
         entrance:dayjs(data.entrance),
         dob:dayjs(data.dob),

     })
     }).catch((error)=>{
       setMsg(`Oops! sorry can't load data`);
     })
  },[userId])

  useEffect(()=>{
    //fetch all paginated class data by recursively calling page by page
    const listClasses = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listClasses(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load class List`);
         throw error; //rethrow consequent error
     }
    }

    const url = "classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
       handleOpenMsgBox();
     })
  },[])

  useEffect(()=>{
    //fetch all paginated students data by recursively calling page by page
    const listStudents = async(url,query)=>{
      try{
         const response = await axiosInstance.get(url,{params:query})
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listStudents(nextPage,query));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load Students List`);
         throw error; //rethrow consequent error
     }
    }

    const url = "accounts/users-list/";
    const query = {role:"student"};
    listStudents(url, query).then(allData=>{
      setStudentList(allData)
     }).catch((error)=>{
       setMsg(`Oops! sorry can't load Students List`);
       handleOpenMsgBox();
     })
  },[])
  
  const validateZipCode = (zipCode)=>{
    const zipCodeRegex = /^\d{6}$/;
    return zipCodeRegex.test(zipCode);
  }
  const validateEmail = (email)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  const validateTelephone = (telephone)=>{
    const telephoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/;
    return telephoneRegex.test(telephone);
  }

  
    const handlePasswordSubmit = (event)=>{
      event.preventDefault();
      if(event.target.checkValidity()){
          if(password.confirm !== password.new_password){
             setConfirmError("password confirm mismatch");
             setIsDisabled(false)  //re-enable button
            return;
          }
      }else{
          setMsg("Please ensure to enter all your data correctly");
          handleOpenMsgBox();
          return;
      }
  
       const data = {
        password:password.password,
        new_password:password.new_password,
      };
      setIsLoading(true);
      axiosInstance.put("auth/update-password/"+userId+"/",
            data).then((res) => {
              setIsLoading(false)
              setIsDisabled(false)  //re-enable button
              setMsg("password changed successfully ");
              handleOpenMsgBox();
      }).catch((err) => {
              setIsLoading(false)
              setIsDisabled(false)  //re-enable button
              if (err) {
                setMsg(JSON.stringify(err.response.data));
                   handleOpenMsgBox();
              }
      })
    }
  
   const handleSubmit = (event)=>{
      event.preventDefault();
      if(event.target.checkValidity()){
          setUsername("");
          setTelephone("");
          setZip("");
          setEmail("");
          if(!validateTelephone(form.telephone)){
            setTelephone("Telephone must be 11 digit");
            setIsDisabled(false)  //re-enable button
            return;
          }
          if((!validateZipCode(form.zipCode))){
            setZip("invalid ZipCode")
            setIsDisabled(false)  //re-enable button
            return;
          }
          if(form.username.length > 11){
            setUsername("Username must not exceed 11 digit");
            setIsDisabled(false)  //re-enable button
            return;
          }
          if(!validateEmail(form.email)){
            setEmail("Enter a valid email address");
            setIsDisabled(false)  //re-enable button
            return;
          }
          if(form.confirm !== form.password){
             setConfirmError("password confirm mismatch");
             setIsDisabled(false)  //re-enable button
            return;
          }
      }else{
          setMsg("Please ensure to enter all your data correctly");
          handleOpenMsgBox();
          return;
      }
      
      const data = new FormData();
      if(hasUpload.current){
        data.append('pics',hasUpload.current);
      }
      data.append('username',form.username);
      data.append('firstName',form.firstname);
      data.append('lastName',form.lastname);
      data.append('email',form.email);
      data.append('address',form.address);
      data.append('telephone',form.telephone);
      data.append('state',form.state);
      data.append('nationality',form.nationality);
      data.append('dob',dayjs(form.dob).format("YYYY-MM-DD"));
      data.append('entrance',dayjs(form.entrance).format("YYYY-MM-DD hh:mm:ss"));
      data.append('role',form.role);
      data.append('gender',form.gender);
      data.append('childId',form.childId);
      data.append('classId',form.classId);
      data.append('zipCode',form.zipCode);
      
      setIsProfileLoading(true);
      axiosInstance.patch("accounts/user-update/"+
userId+"/",
            data,{
            headers:{
              'Content-Type':'multipart/form-data',
            },
          }).then((res) => {
             const data = res.data;
              setForm({
               pics:data.pics,
               username:data.username,
               firstname:data.firstName,
               lastname:data.lastName,
               email:data.email,
               gender:data.gender,
               role:data.role,
               address:data.address,
               nationality:data.nationality,
               state:data.state,
               zipCode:data.zipCode,
               telephone:data.telephone,
               childId:data.childId,
               classId:data.classId,
               entrance:dayjs(data.entrance),
               dob:dayjs(data.dob),})

              setIsProfileLoading(false)
              setIsDisabled(false)  //re-enable button
              setMsg("User account updated successfully ");
              handleOpenMsgBox();
      }).catch((err) => {
              setIsProfileLoading(false)
              setIsDisabled(false)  //re-enable button
              if (err) {
                setMsg(JSON.stringify(err.response.data));
                   handleOpenMsgBox();
              }
      })
          
    }
    
    return (
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{backgroundColor:"#FFF", flexGrow:1}}>
        <Layout title="User Update">
          <Box 
         sx={{
            minHeight:"100vh",
            marginTop:"10px",
          }}
          >
          <Typography component="h1" variant="h6" sx={{color:"royalblue"}}>User Update</Typography>
         
            <Box sx={{
              backgroundColor:"#EFF",
              width:"100%",
              padding:"10px",
              marginBottom:"70px"
            }}>
              <Typography component="h1" variant="h6" 
              sx={{color:"royalblue", fontWeight:"bolder", textAlign:"center"}}>
                {form.firstname+" "+form.lastname}
                </Typography>
                     <Avatar
                     src={form.pics}
                     sx={{
                       position:"relative",
                       top:"50px",
                       width: 100, // Adjust size
                       height: 100,
                       backgroundColor:"#EFF",
                       border: '3px solid #FFF', // Add a gold border
                       boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
                       '&:hover': {
                          transform: 'scale(1.05)', // Add a hover effect
                          transition: 'transform 0.3s ease-in-out',
                       },
                     }} 
                     >
                       {!form.pics && <PersonIcon sx={{color:"royalblue"}}/> }
                     </Avatar>
                   </Box>
         
          <Box component="form" onSubmit={handleSubmit} sx={{
                 width:{xs:"100%",}}}>
             <Typography marginTop={5} style={{color:"royalblue"}}>
              Personal Information</Typography>
          <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
            marginTop={5} padding="10px 30px">
            <Grid container spacing={1}>
              <Grid item size={{xs:12, sm:6, md:6}}>
                <TextField
                fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
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
                 helperText={username}
                 type="text"
                 value={form.username}
                 onChange={(e) => setForm({ ...form,
                    username: e.target.value })}
                 name="username"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 required
                 id="email"
                 label="email"
                 type="email"
                 helperText={email}
                 value={form.email}
                 onChange={(e) => setForm({ ...form,
                    email: e.target.value })}
                 name="email"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 required
                 id="firstname"
                 label="firstname"
                 type="text"
                 value={form.firstname}
                 onChange={(e) => setForm({ ...form,
                    firstname: e.target.value })}
                 name="firstname"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 required
                 id="lastname"
                 label="lastname"
                 type="text"
                 value={form.lastname}
                 onChange={(e) => setForm({ ...form,
                    lastname: e.target.value })}
                 name="lastname"
                 
              />
              </Grid>
            </Grid>
          </Box>

          <Typography marginTop={5} style={{color:"royalblue"}}>
              Other Information</Typography>
           <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
            marginTop={5} padding="10px 30px">
            <Grid container spacing={1}>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl required fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                <InputLabel id="gender-label">{form.gender || "gender"}</InputLabel>
                <Select
                    margin="normal"
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={form.gender}
                    label="gender"
                    onChange={(e) => setForm({ ...form,
                      gender: e.target.value })}
                     
                    >
                      <MenuItem value="M">Male</MenuItem>
                      <MenuItem value="F">Female</MenuItem>
                      <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl required fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                 id="dob"
                 label="dob"
                 value={dayjs(form.dob)}
                 format="YYYY-MM-DD"
                 onChange={(e) =>setForm({ ...form, dob: e })}
                 name="dob"
                
              /></LocalizationProvider>
              </FormControl>
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 required
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="address"
                 label="address"
                 type="text"
                 value={form.address}
                 onChange={(e) => setForm({ ...form,
                    address: e.target.value })}
                 name="address"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 required
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="nationality"
                 label="nationality"
                 type="text"
                 value={form.nationality}
                 onChange={(e) => setForm({ ...form,
                    nationality: e.target.value })}
                 name="nationality"
                 
              />
            </Grid>

            <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 required
                 margin="normal"
                 id="state"
                 label="state"
                 type="text"
                 value={form.state}
                 onChange={(e) => setForm({ ...form,
                    state: e.target.value })}
                 name="state"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 required
                 margin="normal"
                 id="zipCode"
                 label="zipCode"
                 type="text"
                 helperText={zip}
                 value={form.zipCode}
                 onChange={(e) => setForm({ ...form,
                    zipCode: e.target.value })}
                 name="zipCode"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 required
                 margin="normal"
                 id="telephone"
                 label="telephone"
                 type="text"
                 value={form.telephone}
                 helperText={telephone}
                 onChange={(e) => setForm({ ...form,
                    telephone: e.target.value })}
                 name="telephone"
                 
              />
            </Grid>
            <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="pics"
                 label="Your Photo"
                 type="file"
                  onChange={(e) =>{ 
                    if(e.target.files.length){
                         hasUpload.current = e.target.files[0];
                    }else{
                       hasUpload.current = "";
                    }
                          
                  }}
                  name="pics"
                 
              />
            </Grid>
            </Grid>
            </Box>

            <Typography marginTop={5} style={{color:"royalblue"}}>
              Restricted Information</Typography>
             <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
            marginTop={5} padding="10px 30px">
            <Grid container spacing={1}>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl
              required 
              fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                <InputLabel id="role-label">{form.role || "role"}</InputLabel>
                <Select
                    margin="normal"
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={form.role}
                    label="role"
                    onChange={(e) => setForm({ ...form,
                      role: e.target.value })}
                     
                    >
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
             <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl
               fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                <InputLabel id="class-label">{form.classId || "class"}</InputLabel>
                <Select
                    margin="normal"
                    labelId="class-label"
                    id="classId"
                    name="classId"
                    value={form.classId}
                    label="class"
                    onChange={(e) => setForm({ ...form,
                      classId: e.target.value })}
                    >
                      <MenuItem value="">None</MenuItem>
                      {
                        classList.map(classlist=>(
                          <MenuItem key={classlist.id}
                          value={classlist.id}>{classlist.classCode}</MenuItem>
                        ))
                        
                      }
                </Select>
              </FormControl>
             </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl
               fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                <InputLabel id="child-label">{form.childId || "child"}</InputLabel>
                <Select
                    margin="normal"
                    labelId="child-label"
                    id="childId"
                    name="childId"
                    value={form.childId}
                    label="child"
                    onChange={(e) => setForm({ ...form,
                      childId: e.target.value })}
                     
                     
                    >
                      <MenuItem value="">None</MenuItem>
                      {
                        studentList.map(student=>(
                          <MenuItem key={student.pk}
                          value={student.pk}>{student.firstName+" "+student.lastName}</MenuItem>
                        ))
                        
                      }
                </Select>
              </FormControl>
              </Grid>
               <Grid item size={{xs:12, sm:6, md:6}}>
              <FormControl 
               required 
               fullWidth
                 sx={{
                   margin:"16px 0px 0px 0px",
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                 id="entrance"
                 label="entrance"
                 value={dayjs(form.entrance)}
                 format="YYYY-MM-DD hh:mm:ss"
                 onChange={(e) => setForm({ ...form,
                    entrance: e })}
                 name="entrance"
                 
              /></LocalizationProvider>
              </FormControl>
              </Grid>
              </Grid>
              </Box>

              <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 2, mb: 2, height:"50px", width:"150px",
              borderRadius:"10px" }}>Update</Button></div>
            
              <div className="loaderContainer" marginBottom={10}>
                     {isProfileLoading && <CircularProgress />}
               </div>
            </Box>
        

            <Box component="form" onSubmit={handlePasswordSubmit} sx={{
               width:{xs:"100%",marginTop:"40px"}}}>
            <Typography sx={{color:"royalblue"}} component="h1" variant="h6">
              Change Password</Typography>
            <Typography marginTop={5} style={{color:"royalblue"}}>
             Security Information</Typography>
            <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
            marginTop={5} padding="10px 30px">
            <Grid container spacing={1}>
             <Grid item size={{xs:12, sm:6, md:6}}>
               <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="old_password"
                 label="old_password"
                 type="password"
                 value={password.password}
                 onChange={(e) => setPassword({ ...password,
                    password: e.target.value })}
                 name="old_password"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="new_password"
                 label="new_password"
                 type="password"
                 value={password.new_password}
                 onChange={(e) => setPassword({ ...password,
                    new_password: e.target.value })}
                 name="new_password"
                 
              />
              </Grid>
              <Grid item size={{xs:12, sm:6, md:6}}>
              <TextField
                 fullWidth
                 sx={{
                    '& .MuiInputBase-root':{
                    height:"50px",
                    borderRadius:"10px",
                  },
                    '& .MuiOutlinedInput-input':{
                    height:"50px",
                    paddingTop:0,
                    paddingBottom:0,
                  },
                  }}
                 margin="normal"
                 id="confirm_password"
                 label="confirm_password"
                 helperText={confirmError}
                 type="password"
                 value={password.confirm}
                 onChange={(e) => setPassword({ ...password,
                    confirm: e.target.value })}
                 name="confirm_password"
                 
              />
              </Grid>
              </Grid>
              </Box>

              <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{mt: 2, mb: 2, height:"50px", width:"150px",
              borderRadius:"10px" }}>Change</Button></div>

              <div className="loaderContainer" marginBottom={10}>
                     {isLoading && <CircularProgress />}
               </div>
            
           </Box>
      </Box>
          <MessageDialogForm open={openMsgBox} 
          onClose={handleCloseMsgBox} 
          formContent={<Typography>{msg}</Typography>}
          title="Message Dialog"
          />
        </Layout>
      </div>
      </LocalizationProvider>
  );
  
  }


export default UpdateUser;