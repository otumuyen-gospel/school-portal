import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Or any other suitable icon
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { styled } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";


function CreateHomework(){
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
  const hasUpload = useRef("");
  const [selectedFile, setSelectedFile] = useState("");
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
     if(hasUpload.current){
      data.append('link',hasUpload.current);
    }
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
                     New Homework</Typography>
                   <Box component="form" onSubmit={handleSubmit} sx={{
                          backgroundColor:"#FFF", boxShadow:0, border:"0.5px solid #EEE", padding:"5px 10px"}}>
                  <Grid container spacing={2} textAlign="center">
                  <Grid item size={{xs:12,}}>
                     <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                        Homework Data</Typography>
                  </Grid>
                   <Grid item size={{xs:12,}}>
                      <TextField
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
                  
                   <Grid item size={{xs:12,}}>
                      <FormControl 
                      required  
                      fullWidth
                      sx={{
                            margin:"16px 0px",
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
                   <Grid item size={{xs:12,}}>
                      <Box style={{textAlign:"center"}}>
                                      <Button
                                         fullWidth
                                         component="label" 
                                         role={undefined}
                                         variant="contained"
                                         tabIndex={-1}
                                         startIcon={<CloudUploadIcon />}
                                         style={{backgroundColor:"#FFF", color:"darkblue"}}
                                       >
                                        Select New File
                                       <VisuallyHiddenInput type="file" onChange={(e) =>{ 
                                          if(e.target.files.length){
                                               hasUpload.current = e.target.files[0];
                                               setSelectedFile(e.target.files[0].name);
                                          }else{
                                             hasUpload.current = "";
                                          }
                                                
                                        }} />
                                      </Button>
                                      <br/>
                                      <Typography style={{color:"#666"}}>
                                        You have selected this File:{selectedFile}
                                      </Typography>
                                      </Box>
                   </Grid>
                </Grid>
              <div style={{textAlign:"center"}}>
                         <Button
                         fullWidth
                         type="submit"
                         variant="contained"
                         disabled={isDisabled}
                         sx={{ mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue" }}>
                          Upload</Button></div>
                       
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


export default CreateHomework;