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


function CreateHomework(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    link:'',
    title:"",
    submission:dayjs(),
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
    
    const data = new FormData();
    data.append('link',form.link);
    data.append('title',form.title);
    data.append('userId',authUser['user'].pk);
    data.append('classId',authUser['user'].classId);
    data.append('submission',dayjs(form.submission).format("YYYY-MM-DD hh:mm:ss"));
    

    setIsLoading(true);
    axiosInstance.post("homework/create-homework/",
          data,{
            headers:{
              'Content-Type':'multipart/form-data',
            },
          }).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("homework upload successfully");
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
      <Layout title="New Work">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">New Work</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>

            <Typography marginTop={5} style={{color:"royalblue"}}>
              New Homework</Typography>
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
                      id="link"
                      type="file"
                      onChange={(e) => setForm({ ...form,
                           link: e.target.files[0] })}
                      name="link"
                 
                      />
                   </Grid>
                   <Grid item size={{xs:12, sm:6, md:6}}>
                      <FormControl 
                      required  
                      fullWidth
                      sx={{
                            margin:"16px 0px",
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
                      id="submission"
                      label="submission"
                      value={dayjs(form.submission)}
                      format="YYYY-MM-DD hh:mm:ss"
                      onChange={(e) => setForm({ ...form,
                          submission: e })}
                      name="submission"
                 
                       /></LocalizationProvider>
                     </FormControl>
                   </Grid>
                    <Grid item size={{xs:12, sm:6, md:6}}>
                        <Typography style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>Your selected file : {form.link.name}</Typography>
                    </Grid>
                </Grid>
              </Box>
              
              <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{mt: 2, mb: 2,  width:"150px",
              borderRadius:"10px" }}>Upload</Button></div>

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


export default CreateHomework;