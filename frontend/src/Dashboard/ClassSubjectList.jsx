import QuizIcon from "@mui/icons-material/QuizOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function ClassSubjectList(){
  const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [classList,setClassList] = useState([]);
  const [subjectList,setSubjectList] = useState([]);

  const getClassCode = (subject)=>{
    const classes = classList.filter(classlist=>(classlist.id === subject.classId))[0];
    return classes ? classes.classCode : "None";
  }

  useEffect(()=>{
    //fetch all paginated subject data by recursively calling page by page
    const listSubjects = async(url)=>{
      try{
         setIsLoading(true);
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listSubjects(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setIsLoading(false);
         setMsg(`Oops! sorry can't load subject List`);
         throw error; //rethrow consequent error
     }
    }

    const auth = JSON.parse(localStorage.getItem("auth"));
    const url = "subjects/class-subject-list/"+auth['user'].classId+"/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
      setIsLoading(false);
     }).catch((error)=>{
      setIsLoading(false);
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
     })
  },[])
  

  useEffect(()=>{
    //fetch all paginated class data by recursively calling page by page
    const listClasses = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listClasses(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load class List`);
         throw error; //rethrow consequent error
     }
    }

    const url = "classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
     })
  },[])
  
  
  return (
      <div style={{backgroundColor:"#FDFDFB"}}>
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
              Subject Information</Typography>
        <Box component="form" sx={{backgroundColor:"#FFF", padding:"5px 10px"}}
                boxShadow={1}>
                <Paper elevation={0}>
                          <Scrollbars autoHide autoHideTimeout={1000}
                          style={{width:"100%", height:"350px"}}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>Id</TableCell>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>SubjectCode</TableCell>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>Subjectname</TableCell>
                                  <TableCell style={{color:"#333",fontSize:"13px"}}>ClassCode</TableCell>
                                 <TableCell style={{color:"#333", fontSize:"13px"}}>Quizzes</TableCell>
                                 
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                   subjectList.map(subjectlist=>(
                                    <TableRow key={subjectlist.id}>
                                       <TableCell style={{color:"#333",fontSize:"13px"}}>
                                       {
                                           subjectlist.id
                                        }
                                      </TableCell>
                                      <TableCell style={{color:"#333",fontSize:"13px"}}>
                                       {
                                           subjectlist.subjectCode
                                        }
                                      </TableCell>
                                      <TableCell style={{color:"#333",fontSize:"13px"}}>
                                        {subjectlist.subjectName}</TableCell>
                                       <TableCell style={{color:"#333",fontSize:"13px"}}>
                                        {getClassCode(subjectlist)}</TableCell>
                                     
                                      <TableCell>
                                         <Button style={{backgroundColor:"darkblue", 
                                                               border:"1px solid darkblue",
                                                                height:"30px", width:"15px"}}
                                                                 title="update"
                                         onClick={()=>{
                                            navigate('/user-quiz',{state:subjectlist});
                                            
                                          }}>
                                          <QuizIcon style={{color:"#FFF"}}></QuizIcon>
                                         </Button>
                                      </TableCell>
                                     
                                    </TableRow>
                                    
                                 ))
                                        
                              }
                            </TableBody>
                          </Table>
                          
                          </Scrollbars>
        
                          <div className="loaderContainer">
                                      {isLoading && <CircularProgress  sx={{
                                          '& .MuiCircularProgress-circle': {
                                           stroke: 'darkblue', 
                                          },
                                         '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
                                          stroke: 'darkblue', 
                                         },
                                      }}/>}
                                    </div>
                                    <div className="loaderContainer">
                                      <Typography color="error">{msg}</Typography>
                                    </div>
                    </Paper>
                </Box>
        </Box>
      </Layout>
     
        
    </div>
);
}

export default ClassSubjectList;