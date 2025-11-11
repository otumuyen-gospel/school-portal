import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function Register(){
  const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [telephone, setTelephone] = useState('');
  const [zip, setZip] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState("");
   const [selectedFile, setSelectedFile] = useState("");
  const [form, setForm] = useState({
    pics:"",
    username:"",
    firstname:"",
    lastname:"",
    password:"",
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
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
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
    }else{
        setMsg("Please ensure to enter all your data correctly");
        handleOpenMsgBox();
        return;
    }
    
    const data = new FormData();
      data.append('pics',form.pics);
      data.append('username',form.username);
      data.append('password',form.password);
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

    setIsLoading(true);
    axiosInstance.post("auth/register/",
          data,{
            headers:{
              'Content-Type':'multipart/form-data',
            },
          }).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("new user account created successfully");
            handleOpenMsgBox();
    }).catch((err) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            if (err.response) {

              setMsg(JSON.stringify(err.response.data));
                 handleOpenMsgBox();
            }else{
               setMsg(JSON.stringify(err.message));
                 handleOpenMsgBox();
            }
    })
        
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
               <div style={{backgroundColor:"#F9F9F5"}}>
                 <Layout title="De Modern Pace">
                   <Box 
                  sx={{
                     minHeight:"97vh",
                     paddingBottom:"3vh",
                     paddingTop:"10px",
                   }}
                   >
                   <Typography component="h1" variant="h6" 
                   style={{marginBottom:"10px", fontWeight:"normal",
                   color:"darkblue", fontSize:"14px"}}>
                     New User</Typography>
                   <Box component="form" onSubmit={handleSubmit} sx={{
                          backgroundColor:"#FFF", boxShadow:0, border:"0.5px solid #EEE", padding:"5px 10px"}}>
                   <Grid container spacing={2}>
                     <Grid item size={{xs:12,}}>
                     <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                         Personal Information</Typography>
                     </Grid>
                       
                    <Grid item size={{xs:12,}}>
                           <TextField
                           fullWidth
                            sx={{
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
                            helperText={username}
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form,
                               username: e.target.value })}
                            name="username"
                            
                         />
                         </Grid>
                         <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
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
                         <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
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
                            id="firstname"
                            label="firstname"
                            type="text"
                            value={form.firstname}
                            onChange={(e) => setForm({ ...form,
                               firstname: e.target.value })}
                            name="firstname"
                            
                         />
                         </Grid>
                         <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
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
                            id="lastname"
                            label="lastname"
                            type="text"
                            value={form.lastname}
                            onChange={(e) => setForm({ ...form,
                               lastname: e.target.value })}
                            name="lastname"
                            
                         />
                         </Grid>
                     
                     <Grid item size={{xs:12,}}>
                     <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                         Other Information</Typography>
                      </Grid>
                         <Grid item size={{xs:12,}}>
                         <FormControl required fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                         <Grid item size={{xs:12,}}>
                         <FormControl required fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                         <Grid item size={{xs:12,}}>
                         <TextField
                            required
                            fullWidth
                            sx={{
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
                            id="address"
                            label="address"
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form,
                               address: e.target.value })}
                            name="address"
                            
                         />
                         </Grid>
                         <Grid item size={{xs:12,}}>
                         <TextField
                            required
                            fullWidth
                            sx={{
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
                            id="nationality"
                            label="nationality"
                            type="text"
                            value={form.nationality}
                            onChange={(e) => setForm({ ...form,
                               nationality: e.target.value })}
                            name="nationality"
                            
                         />
                       </Grid>
           
                       <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                         <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                         <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                       <Grid item size={{xs:12,}}>
                         <Box style={{textAlign:"center"}}>
                           <Button
                              component="label" 
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                               sx={{ mt: 2, mb: 2, height:"50px", 
                                backgroundColor:"darkblue" }}
                            >
                             Select Profile Pics
                            <VisuallyHiddenInput type="file" onChange={(e) =>{ 
                               if(e.target.files.length){
                                    setForm({ ...form, pics: e.target.files[0] });
                                    setSelectedFile(e.target.files[0].name);
                               }
                                     
                             }} />
                           </Button>
                           <br/>
                           <Typography style={{color:"#666"}}>
                             You have selected this File:{selectedFile}
                           </Typography>
                           </Box>
                       </Grid>
                       <Grid item size={{xs:12,}}>
                       <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                         Restricted Information</Typography>
                        </Grid>
                        <Grid item size={{xs:12,}}>
                         <TextField
                            fullWidth
                            sx={{
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
                         <FormControl
                         required fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                        <Grid item size={{xs:12,}}>
                         <FormControl
                          fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                         <Grid item size={{xs:12,}}>
                         <FormControl
                          fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
                          <Grid item size={{xs:12,}}>
                         <FormControl 
                          required 
                          fullWidth
                            sx={{
                              margin:"16px 0px 0px 0px",
                               '& .MuiInputBase-root':{
                               height:"50px",
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
           
                         <div style={{textAlign:"center"}}>
                         <Button
                         fullWidth
                         type="submit"
                         variant="contained"
                         disabled={isDisabled}
                         sx={{ mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue" }}>
                          Register New User</Button></div>
                       
                         <div className="loaderContainer" marginBottom={10}>
                                {isLoading && <CircularProgress sx={{
                           '& .MuiCircularProgress-circle': {
                            stroke: 'darkblue', 
                           },
                          '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
                           stroke: 'darkblue', 
                          },
                       }}/>}
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


export default Register;