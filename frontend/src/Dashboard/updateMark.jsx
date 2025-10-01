
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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function UpdateMark(){
  const mark = useLocation().state;
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [form, setForm] = useState({
    examScore:mark?.examScore,
    test_score1:mark?.test_score1,
    test_score2:mark.test_score2,
    test_score3:mark?.test_score3,
    homework_score1:mark?.homework_score1,
    homework_score2:mark?.homework_score2,
    homework_score3:mark?.homework_score3,
    userId:mark?.userId,
    subjectId:mark?.subjectId,
    classId:mark?.classId
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
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
         handleOpenMsgBox();
      })
    }
   
  },[authUser])

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

   if(authUser){
       const url = "http://localhost:8000/accounts/class-users/"+
       authUser['user'].classId+"/";
       const query = {role:"student"}
       listStudents(url,query).then(allData=>{
         setStudentList(allData)
      }).catch((error)=>{
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load students List`);
         handleOpenMsgBox();
      })
    }
  },[authUser])




 const handleSubmit = (event)=>{
    event.preventDefault();
    if(event.target.checkValidity()){
        if(isNaN(form.examScore)){
          setMsg("examScore is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.test_score1)){
          setMsg("test_score1 is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.test_score2)){
          setMsg("test_score2 is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.test_score3)){
          setMsg("test_score3 is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.homework_score1)){
          setMsg("homework_score1 is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.homework_score2)){
          setMsg("homework_score2 is not a number");
          handleOpenMsgBox();
          return;
        }
        if(isNaN(form.homework_score3)){
          setMsg("homework_score3 is not a number");
          handleOpenMsgBox();
          return;
        }
        
        
    }

    setIsLoading(true);
    axiosInstance.put("http://localhost:8000/marks/update-mark/"+mark?.id+"/",
          form).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("student grade updated successfully");
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
      <Layout title="Update Grade">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Update Grade</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>


            <Typography marginTop={5} style={{color:"royalblue"}}>
                Exam and Test Scores </Typography>
            <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
                        marginTop={5} padding="10px 30px">
                 <Grid container spacing={1}>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="examScore"
                          label="examScore"
                          type="text"
                          value={form.examScore}
                          onChange={(e) => setForm({ ...form,
                             examScore: e.target.value })}
                          name="examScore"
                                     
                          />
                  </Grid>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="test_score1"
                          label="test_score1"
                          type="text"
                          value={form.test_score1}
                          onChange={(e) => setForm({ ...form,
                             test_score1: e.target.value })}
                          name="test_score1"
                                     
                          />
                  </Grid>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="test_score2"
                          label="test_score2"
                          type="text"
                          value={form.test_score2}
                          onChange={(e) => setForm({ ...form,
                             test_score2: e.target.value })}
                          name="test_score2"
                                     
                          />
                  </Grid>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="test_score3"
                          label="test_score3"
                          type="text"
                          value={form.test_score3}
                          onChange={(e) => setForm({ ...form,
                             test_score3: e.target.value })}
                          name="test_score3"
                                     
                          />
                  </Grid>
                 </Grid>
            </Box>

            <Typography marginTop={5} style={{color:"royalblue"}}>
                Assignment Scores</Typography>
            <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
                        marginTop={5} padding="10px 30px">
                 <Grid container spacing={1}>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="homework_score1"
                          label="homework_score1"
                          type="text"
                          value={form.homework_score1}
                          onChange={(e) => setForm({ ...form,
                             homework_score1: e.target.value })}
                          name="homework_score1"
                                     
                          />
                  </Grid>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="homework_score2"
                          label="homework_score2"
                          type="text"
                          value={form.homework_score2}
                          onChange={(e) => setForm({ ...form,
                             homework_score2: e.target.value })}
                          name="homework_score2"
                                     
                          />
                  </Grid>
                  <Grid item size={{xs:12, sm:6, md:6}}>
                    <TextField
                      fullWidth
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
                          margin="normal"
                          required
                          id="homework_score3"
                          label="homework_score3"
                          type="text"
                          value={form.homework_score3}
                          onChange={(e) => setForm({ ...form,
                             homework_score3: e.target.value })}
                          name="homework_score3"
                                     
                          />
                  </Grid>
                 </Grid>
            </Box>

            <Typography marginTop={5} style={{color:"royalblue"}}>
                Subject / Student</Typography>
            <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
                        marginTop={5} padding="10px 30px">
                 <Grid container spacing={1} textAlign="center">
                  <Grid item size={{xs:12, sm:12, md:12}}>
                    <FormControl  sx={{
                            width:"60%",
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
                  <Grid item size={{xs:12, sm:12, md:12}}>
                    <FormControl  sx={{
                            width:"60%",
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
                      <InputLabel id="child-label">{form.userId || "child"}</InputLabel>
                      <Select
                      fullWidth
                      margin="normal"
                      labelId="child-label"
                      id="childId"
                       name="childId"
                       value={form.userId}
                       label="child"
                        onChange={(e) => setForm({ ...form,
                         userId: e.target.value })}
                     
                     
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
                 </Grid>
            </Box>

             <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 2, mb: 2, height:"50px", width:"150px",
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
    
);

}


export default UpdateMark;