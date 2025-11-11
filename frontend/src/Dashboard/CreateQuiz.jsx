import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { EditorState, convertToRaw } from 'draft-js';
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";


function CreateQuiz(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [detailsMsg, setDetailsMsg] = useState("");
  const [form, setForm] = useState({
    option1:"",
    option2:"",
    option3:"",
    answer:"",
    subjectId:"",
    classId:"",
    endDate:dayjs(),
    startDate:dayjs(),
    setAsQuiz:false,
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };
    const convertForDatabase = ()=>{
      return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    }
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }
  
  useEffect(()=>{
    //fetch all paginated subject data by recursively calling page by page
    const listSubjects = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listSubjects(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load subject List`);
         throw error; //rethrow consequent error
     }
    }
    
    if(authUser){
       const url = "subjects/class-subject-list/"+
       authUser['user'].classId+"/";
       listSubjects(url).then(allData=>{
         setSubjectList(allData)
      }).catch((error)=>{
         setMsg(`Oops! sorry can't load subject List`);
         handleOpenMsgBox();
      })
    }
   
  },[authUser])

 const handleSubmit = (event)=>{
    event.preventDefault();
    event.target.checkValidity();
    const dbData  = convertForDatabase();
    if(!dbData){
      setDetailsMsg("please kindly enter the Question");
      return;
    }else{
      setDetailsMsg("");
    }
    setIsLoading(true);
    const data ={
    question:dbData,
    option1:form.option1,
    option2:form.option2,
    option3:form.option3,
    answer:form.answer,
    subjectId:form.subjectId,
    classId:authUser ? authUser['user'].classId :"",
    endDate:dayjs(form.endDate).format("YYYY-MM-DD"),
    startDate:dayjs(form.startDate).format("YYYY-MM-DD"),
    setAsQuiz:form.setAsQuiz,};
    axiosInstance.post("quizzes/create-quiz/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("quiz created successfully");
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
                     Add Quiz</Typography>
                   <Box component="form" onSubmit={handleSubmit} sx={{
                          backgroundColor:"#FFF", boxShadow:0, border:"0.5px solid #EEE", padding:"5px 10px"}}>
                  <Grid container spacing={2} textAlign="center">
                  <Grid item size={{xs:12,}}>
                     <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                        Quiz Details</Typography>
                  </Grid>
                   <Grid item size={{xs:12,}}>
                       <span>{detailsMsg ? detailsMsg : "Quiz Question"}</span>
                        <Editor
                          minHeight="150px"
                          editorState={editorState}
                          onEditorStateChange={onEditorStateChange}
                        />
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
                        id="option1"
                        label="option1"
                        type="text"
                        value={form.option1}
                        onChange={(e) => setForm({ ...form,
                              option1: e.target.value })}
                        name="option1"
                 
                      />
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
                        id="option2"
                        label="option2"
                        type="text"
                        value={form.option2}
                        onChange={(e) => setForm({ ...form,
                              option2: e.target.value })}
                        name="option2"
                 
                      />
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
                        id="option3"
                        label="option3"
                        type="text"
                        value={form.option3}
                        onChange={(e) => setForm({ ...form,
                              option3: e.target.value })}
                        name="option3"
                 
                      />
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
                        id="answer"
                        label="answer"
                        type="text"
                        value={form.answer}
                        onChange={(e) => setForm({ ...form,
                              answer: e.target.value })}
                        name="answer"
                 
                      />
                   </Grid>
                   <Grid item size={{xs:12,}}>
                      <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
              Other details</Typography>
                   </Grid>
                   <Grid item size={{xs:12,}}>
                      <Checkbox
                        sx={{
                           display:"inline",
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
                        id="setAsQuiz"
                        label="setAsQuiz"
                        checked={form.setAsQuiz}
                        onChange={(e) =>{setForm({ ...form,
                           setAsQuiz: e.target.checked })}}
                       name="setAsQuiz"
                 
                     />
                     <Typography style={{display:"inline"}}>
                        Set and Activate Quiz to Run Immediately after creation
                     </Typography>
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
                      <DatePicker
                       id="startDate"
                       label="startDate"
                       value={dayjs(form.startDate)}
                       format="YYYY-MM-DD"
                       onChange={(e) =>setForm({ ...form, startDate: e })}
                       name="startDate"
                 
                       /></LocalizationProvider>
                     </FormControl>
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
                      <DatePicker
                       id="endDate"
                       label="endDate"
                       value={dayjs(form.endDate)}
                       format="YYYY-MM-DD"
                       onChange={(e) =>setForm({ ...form, endDate: e })}
                       name="endDate"
                 
                       /></LocalizationProvider>
                     </FormControl>
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
                       <InputLabel id="subject-label">{form.subjectId || "subject"}</InputLabel>
                       <Select
                        fullWidth
                        margin="normal"
                        labelId="subject-label"
                        id="subjectId"
                        name="subjectId"
                        value={form.subjectId}
                        label="Subject"
                        onChange={(e) => setForm({ ...form,
                           subjectId: e.target.value })}
                        >
                        <MenuItem value="">None</MenuItem>
                          {
                            subjectList.map(list=>(
                              <MenuItem key={list.id}
                               value={list.id}>{list.subjectCode}</MenuItem>
                            ))
                        
                          }
                        </Select>
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
    
);

}


export default CreateQuiz;