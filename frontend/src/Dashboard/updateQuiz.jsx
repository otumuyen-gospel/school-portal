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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function UpdateQuiz(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [subjectList, setSubjectList] = useState([]);
   const quiz = useLocation().state;
  const [form, setForm] = useState({
    question:quiz?.question,
    option1:quiz?.option1,
    option2:quiz?.option2,
    option3:quiz?.option3,
    answer:quiz?.answer,
    subjectId:quiz?.subjectId,
    classId:quiz?.classId,
    endDate:dayjs(quiz?.endDate),
    startDate:dayjs(quiz?.startDate),
    setAsQuiz:quiz?.setAsQuiz,
  });
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
       const url = "http://localhost:8000/subjects/class-subject-list/"+
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
    setIsLoading(true);
    const data ={
    question:form.question,
    option1:form.option1,
    option2:form.option2,
    option3:form.option3,
    answer:form.answer,
    subjectId:form.subjectId,
    classId:authUser ? authUser['user'].classId :"",
    endDate:dayjs(form.endDate).format("YYYY-MM-DD"),
    startDate:dayjs(form.startDate).format("YYYY-MM-DD"),
    setAsQuiz:form.setAsQuiz,};
    axiosInstance.put("http://localhost:8000/quizzes/update-quiz/"+quiz?.id+"/",
          data).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("quiz updated successfully");
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
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Update Quiz">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Update Quiz</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>

            <Typography marginTop={5} style={{color:"royalblue"}}>
              Quiz details</Typography>
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
                        id="question"
                        label="question"
                        type="text"
                        value={form.question}
                        onChange={(e) => setForm({ ...form,
                              question: e.target.value })}
                        name="question"
                 
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
                        id="option1"
                        label="option1"
                        type="text"
                        value={form.option1}
                        onChange={(e) => setForm({ ...form,
                              option1: e.target.value })}
                        name="option1"
                 
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
                        id="option2"
                        label="option2"
                        type="text"
                        value={form.option2}
                        onChange={(e) => setForm({ ...form,
                              option2: e.target.value })}
                        name="option2"
                 
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
                        id="option3"
                        label="option3"
                        type="text"
                        value={form.option3}
                        onChange={(e) => setForm({ ...form,
                              option3: e.target.value })}
                        name="option3"
                 
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
                        id="answer"
                        label="answer"
                        type="text"
                        value={form.answer}
                        onChange={(e) => setForm({ ...form,
                              answer: e.target.value })}
                        name="answer"
                 
                      />
                   </Grid>
                </Grid>
              </Box>


              <Typography marginTop={5} style={{color:"royalblue"}}>
              Other details</Typography>
             <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
                        marginTop={5} padding="10px 30px">

                <Grid container spacing={1}>
                   <Grid item size={{xs:12, sm:6, md:6}}>
                      <Checkbox
                        sx={{
                           display:"inline",
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
                        id="setAsQuiz"
                        label="setAsQuiz"
                        checked={form.setAsQuiz}
                        onChange={(e) =>{setForm({ ...form,
                           setAsQuiz: e.target.checked })}}
                       name="setAsQuiz"
                 
                     />
                     <Typography style={{display:"inline"}}>
                        Set and Activate Quiz to Run Immediately after creation.
                        Remember to reset start and end date.
                     </Typography>
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
              </Box>
              
              <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{mt: 2, mb: 2, height:"50px", width:"150px",
              borderRadius:"10px" }}>Update</Button></div>

              <div className="loaderContainer" marginBottom={10}>
                     {isLoading && <CircularProgress />}
               </div>
          </Box>
      </Box>






            {/*}
            <Typography component="p" sx={{
              textAlign:"center",
              color:"primary",
              }}>
                Update Quiz
           </Typography>

           <Grid container width="sm" direction="column" spacing={4}>
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="question"
                 label="question"
                 type="text"
                 value={form.question}
                 onChange={(e) => setForm({ ...form,
                    question: e.target.value })}
                 name="question"
                 
              />
            </Grid>
            <Grid>
              <TextField
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

            <Grid>
              <TextField
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

            <Grid>
              <TextField
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


            <Grid>
              <TextField
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

            <Grid>
               <Checkbox
                 style={{display:"inline"}}
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
                Set and Activate Quiz to Run Immediately after creation. 
                Remember to reset start and end date.
                </Typography>
            </Grid>

            <Grid>
              <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
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

            <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
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

             <Grid>
              <FormControl required sx={{margin:"16px 0px 0px 0px", minWidth: "100%"}}>
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

            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Update Quiz</Button>
            
              <div className="loaderContainer">
                     {isLoading && <CircularProgress />}
               </div>
            </Grid>
           </Grid>
           
           

        </Box>

      </Box>
      {*/}


        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{msg}</Typography>}
        title="Message Dialog"
        />
      </Layout>
    </div>
    
);

}


export default UpdateQuiz;