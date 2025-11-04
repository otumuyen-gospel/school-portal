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
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
  const [detailsMsg, setDetailsMsg] = useState("");
  const [form, setForm] = useState({
    title:schedule?.title,
    startDateTime:dayjs(schedule?.startDateTime),
    endDateTime:dayjs(schedule?.endDateTime),

  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };
    const convertForDatabase = ()=>{
      return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    }
    useEffect(() => {
        if (schedule?.detail) {
          const contentState = convertFromRaw(JSON.parse(schedule?.detail));
          setEditorState(EditorState.createWithContent(contentState));
        }
      }, [schedule?.detail]);

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
    

    const dbData  = convertForDatabase();
    if(!dbData){
      setDetailsMsg("please kindly enter the details");
      return;
    }else{
      setDetailsMsg("");
    }

    const data = {
       detail:dbData,
       title:form.title,
       userId:schedule?.userId,
       classId:schedule?.classId,
       startDateTime:dayjs(form.startDateTime).format("YYYY-MM-DD hh:mm:ss"),
       endDateTime:dayjs(form.endDateTime).format("YYYY-MM-DD hh:mm:ss"),
    };

    setIsLoading(true);
    axiosInstance.put("schedule/update-schedule/"+schedule?.id+"/",
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
                    Update Schedule</Typography>
                   <Box component="form" onSubmit={handleSubmit} sx={{
                          backgroundColor:"#FFF", boxShadow:0, border:"0.5px solid #EEE", padding:"5px 10px"}}>

                <Grid container spacing={2}>
                  <Grid item size={{sx:12,}}>
                    <Typography marginTop={5} style={{color:"darkblue"}}>
                      Title And Date</Typography>
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
                   <Grid item size={{xs:12}}>
                     <Typography marginTop={5} style={{color:"darkblue"}}>
                       Schedule Detail</Typography>
                   </Grid>
                   <Grid item size={{xs:12,}}>
                      <span>{detailsMsg}</span>
                    <Editor
                     minHeight="150px"
                     editorState={editorState}
                     onEditorStateChange={onEditorStateChange}
                    />
                   </Grid>
                </Grid>

             <div style={{textAlign:"center"}}>
                         <Button
                         fullWidth
                         type="submit"
                         variant="contained"
                         disabled={isDisabled}
                         sx={{ mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue" }}>
                          Update Schedule</Button></div>
                       
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


export default UpdateSchedule;