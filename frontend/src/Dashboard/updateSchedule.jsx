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
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function UpdateSchedule(){
  const schedule = useLocation().state;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    detail:schedule?.detail,
    title:schedule?.title,
    startDateTime:dayjs(schedule?.startDateTime),
    endDateTime:dayjs(schedule?.endDateTime),

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
       userId:schedule?.userId,
       classId:schedule?.classId,
       startDateTime:dayjs(form.startDateTime).format("YYYY-MM-DD hh:mm:ss"),
       endDateTime:dayjs(form.endDateTime).format("YYYY-MM-DD hh:mm:ss"),
    };

    setIsLoading(true);
    axiosInstance.put("http://localhost:8000/schedule/update-schedule/"+schedule?.id+"/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("schedule updated successfully");
            handleOpenMsgBox();
    }).catch((err) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            if (err) {
              setMsg(JSON.stringify(err.response.data.detail));
                 handleOpenMsgBox();
            }
    })
        
  }
  
  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Update Schedule">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Update Schedule</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>
             <Typography marginTop={5} style={{color:"royalblue"}}>
              Title And Date</Typography>
             <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
                        marginTop={5} padding="10px 30px">

                <Grid container spacing={1}>
                   <Grid item size={{xs:12, sm:6, md:6}}>
                      <TextField
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
                </Grid>
              </Box>
              
              <Typography marginTop={5} style={{color:"royalblue"}}>
              Schedule Detail</Typography>
             <Box marginBottom={5} marginTop={5}>
                <Grid container>
                   <Grid item size={{xs:12, sm:12, md:12}}>
                      <TextField
                        boxShadow={1}
                        sx={{
                           '& .MuiInputBase-root':{
                            borderBottomLeftRadius:"10px",
                            borderBottomRightRadius:"10px",
                            borderTop:"5px solid royalblue"
                         },
                         '& .MuiOutlinedInput-input':{
                         paddingTop:0,
                         paddingBottom:0,
                         },
                        }}
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
                </Grid>
              </Box>

              <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{mt: 2, mb: 2, height:"50px", width:"150px",
              borderRadius:"10px" }}>Update</Button></div>

              <div className="loaderContainer" marginBottom={20}>
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


export default UpdateSchedule;