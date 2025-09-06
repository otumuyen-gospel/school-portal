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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function UpdateUser(){
  const user = useLocation().state;
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
  const [form, setForm] = useState({
    username:user?.username,
    firstname:user?.firstName,
    lastname:user?.lastName,
    password:user?.password,
    email:user?.email,
    gender:user?.gender,
    role:user?.role,
    address:user?.address,
    nationality:user?.nationality,
    state:user?.state,
    zipCode:user?.zipCode,
    telephone:user?.telephone,
    childId:user?.childId,
    classId:user?.classId,
    entrance:dayjs(user?.entrance),
    dob:dayjs(user?.dob),

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

    const url = "http://localhost:8000/classes/class-list/";
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

    const url = "http://localhost:8000/accounts/users-list/";
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
    
    const data = {
      username:form.username,
      password:form.password,
      firstName:form.firstname,
      lastName:form.lastname,
      email:form.email,
      address:form.address,
      telephone:form.telephone,
      state:form.state,
      nationality:form.nationality,
      dob:dayjs(form.dob).format("YYYY-MM-DD"),
      entrance:dayjs(form.entrance).format("YYYY-MM-DD hh:mm:ss"),
      role:form.role,
      gender:form.gender,
      childId:form.childId,
      classId:form.classId,
      zipCode:form.zipCode

    };
    
    setIsLoading(true);
    axiosInstance.put("http://localhost:8000/accounts/user-update/"+user?.pk+"/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("User account updated successfully ");
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
  
  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Update User">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Update User</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>
            <Typography component="p" sx={{
              textAlign:"center",
              color:"primary",
              }}>
                Update User
           </Typography>

           <Grid container width="sm" direction="column" spacing={4}>
            <Grid>
              <TextField
                 fullWidth
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
            <Grid>
              <TextField
                 fullWidth
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
           <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="password"
                 label="password"
                 type="password"
                 value={form.password}
                 onChange={(e) => setForm({ ...form,
                    password: e.target.value })}
                 name="password"
                 
              />
            </Grid>

            <Grid>
              <TextField
                 fullWidth
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
            
            <Grid>
              <TextField
                 fullWidth
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

            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="address"
                 label="address"
                 type="text"
                 value={form.address}
                 onChange={(e) => setForm({ ...form,
                    address: e.target.value })}
                 name="address"
                 
              />
            </Grid>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="nationality"
                 label="nationality"
                 type="text"
                 value={form.nationality}
                 onChange={(e) => setForm({ ...form,
                    nationality: e.target.value })}
                 name="nationality"
                 
              />
            </Grid>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="state"
                 label="state"
                 type="text"
                 value={form.state}
                 onChange={(e) => setForm({ ...form,
                    state: e.target.value })}
                 name="state"
                 
              />
            </Grid>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
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
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
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
            
           <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                <InputLabel id="gender-label">{form.gender || "gender"}</InputLabel>
                <Select
                    fullWidth
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
            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                <InputLabel id="role-label">{form.role || "role"}</InputLabel>
                <Select
                    fullWidth
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

            <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                <InputLabel id="class-label">{form.classId || "class"}</InputLabel>
                <Select
                    fullWidth
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

            <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                <InputLabel id="child-label">{form.childId || "child"}</InputLabel>
                <Select
                    fullWidth
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

            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
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
            
            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
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

            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Update Account</Button>
            
              <div className="loaderContainer">
                     {isLoading && <CircularProgress />}
               </div>
            </Grid>
           </Grid>
           

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