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
import { useState } from "react";
import Layout from "../Util/Layout";


function Register(){
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
  const [form, setForm] = useState({
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
    zipCode:0,
    telephone:0,
    childId:0,
    classId:0,
    entrance:dayjs("2024-05-09"),
    dob:dayjs("2024-05-09"),

  });
  const [formError] = useState({
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
    zipCode:0,
    telephone:0,
    childId:0,
    classId:0,
    entrance:dayjs("2024-05-09"),
    dob:dayjs("2024-05-09"),
  });

  const handleSubmit = ()=>{
    setError(null);
    setIsDisabled(false);
    setIsLoading(true);
  }

  const RegisterForm = ()=>{

   return (<Box component="form" onSubmit={handleSubmit} noValidate sx={{
           width:{xs:"100%",}}}>
            <Typography component="p" sx={{
              textAlign:"center",
              color:error ? "red" : "primary",
              }}>
                {error ? error :"Create New User"}
           </Typography>

           <Grid container width="sm" direction="column" spacing={4}>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="username"
                 label="username"
                 helperText={formError.username}
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
                 helperText={formError.email}
                 type="email"
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
                 helperText={formError.password}
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
                 helperText={formError.firstname}
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
                 helperText={formError.lastname}
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
                 helperText={formError.address}
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
                 helperText={formError.nationality}
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
                 helperText={formError.state}
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
                 helperText={formError.zipCode}
                 type="text"
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
                 helperText={formError.telephone}
                 type="text"
                 value={form.lastname}
                 onChange={(e) => setForm({ ...form,
                    telephone: e.target.value })}
                 name="telephone"
              />
            </Grid>
            
           <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
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
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                <InputLabel id="role-label">{form.gender || "role"}</InputLabel>
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
                <InputLabel id="class-label">{form.classId || "classId"}</InputLabel>
                <Select
                    fullWidth
                    margin="normal"
                    labelId="classId-label"
                    id="classId"
                    name="classId"
                    value={form.classId}
                    label="classId"
                    onChange={(e) => setForm({ ...form,
                      classId: e.target.value })}
                    >
                      <MenuItem value="1">Pri 3</MenuItem>
                      <MenuItem value="2">Pri 5</MenuItem>
                      <MenuItem value="3">Pri 4</MenuItem>
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
                      <MenuItem value="1">osaretin</MenuItem>
                      <MenuItem value="2">Grace</MenuItem>
                      <MenuItem value="4">John</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                 id="entrance"
                 label="entrance"
                 value={form.entrance}
                 onChange={(e) => setForm({ ...form,
                    entrance: e.target.value })}
                 name="entrance"
              />
              </LocalizationProvider>
              </FormControl>
            </Grid>
            
            <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                 id="dob"
                 label="dob"
                 value={form.dob}
                 onChange={(e) => setForm({ ...form,
                    dob: e.target.value })}
                 name="dob"
              />
              </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Login</Button>
            
              <div className="loaderContainer">
                     {isLoading && <CircularProgress />}
               </div>
            </Grid>
           </Grid>
           

   </Box>);
  }
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">New User</Typography>
        <RegisterForm />
      </Box>
    );
  }
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="New User">
        <PageContent/>

      </Layout>
    </div>
);

}


export default Register;