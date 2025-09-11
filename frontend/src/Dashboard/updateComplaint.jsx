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

function UpdateComplaint(){
  const complaint = useLocation().state;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    complaint:complaint?.complaint,
    title:complaint?.title,
    date:dayjs(complaint?.date),
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
       complaint:form.complaint,
       title:form.title,
       userId:complaint?.userId,
       classId:complaint?.classId,
       date:dayjs(form.date).format("YYYY-MM-DD hh:mm:ss"),
    };

    setIsLoading(true);
    axiosInstance.patch("http://localhost:8000/complaints/update-complaint/"+complaint?.id+"/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("complaint updated successfully");
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
      <Layout title="Update Complaint">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Update Complaint</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>
            <Typography component="p" sx={{
              textAlign:"center",
              color:"primary",
              }}>
                Update Complaint
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
                 id="complaint"
                 label="complaint"
                 type="complaint"
                 value={form.complaint}
                 onChange={(e) => setForm({ ...form,
                    complaint: e.target.value })}
                 name="complaint"
                 
              />
            </Grid>

            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                 id="Date"
                 label="Date"
                 value={dayjs(form.date)}
                 format="YYYY-MM-DD hh:mm:ss"
                 onChange={(e) => setForm({ ...form,
                    date: e })}
                 name="Date"
                 
              /></LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Update Complaint</Button>
            
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


export default UpdateComplaint;