import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";


function CreateSchedule(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    detail:"",
    title:"",
    startDateTime:dayjs(),
    endDateTime:dayjs(),

  });
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }
  
 const handleSubmit = (event)=>{
    event.preventDefault();
    if(!event.target.checkValidity()){
       setMsg("Please ensure to enter all your data correctly");
        handleOpenMsgBox();
        return;
    }
    
    const data = {
       detail:form.detail,
       title:form.title,
       userId:authUser['user'].pk,
       classId:authUser['user'].classId,
       startDateTime:dayjs(form.startDateTime).format("YYYY-MM-DD hh:mm:ss"),
       endDateTime:dayjs(form.endDateTime).format("YYYY-MM-DD hh:mm:ss"),
    };

    setIsLoading(true);
    axiosInstance.post("http://localhost:8000/schedule/create-schedule/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("schedule created successfully");
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
      <Layout title="New Schedule">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">New User</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>
            <Typography component="p" sx={{
              textAlign:"center",
              color:"primary",
              }}>
                Create New Schedule
           </Typography>

           <Grid container width="sm" direction="column" spacing={4}>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="title"
                 label="title"
                 type="text"
                 value={form.title}
                 onChange={(e) => setForm({ ...form,
                    title: e.target.value })}
                 name="title"
                 
              />
            </Grid>
            <Grid>
              <TextField
                 fullWidth
                 multiline
                 rows={7}
                 margin="normal"
                 required
                 id="detail"
                 label="detail"
                 type="detail"
                 value={form.detail}
                 onChange={(e) => setForm({ ...form,
                    detail: e.target.value })}
                 name="detail"
                 
              />
            </Grid>

            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                 id="startDate"
                 label="Start Date"
                 value={dayjs(form.startDateTime)}
                 format="YYYY-MM-DD hh:mm:ss"
                 onChange={(e) => setForm({ ...form,
                    startDateTime: e })}
                 name="startDate"
                 
              /></LocalizationProvider>
              </FormControl>
            </Grid>
            
            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                 id="endDate"
                 label="End Date"
                 value={dayjs(form.endDateTime)}
                 format="YYYY-MM-DD hh:mm:ss"
                 onChange={(e) => setForm({ ...form,
                    endDateTime: e })}
                 name="endDate"
                 
              /></LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Create Schedule</Button>
            
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


export default CreateSchedule;