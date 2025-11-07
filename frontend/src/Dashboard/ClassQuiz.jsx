import TrashIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/MarkChatReadOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function ClassQuiz(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [isLoading, setIsLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("quizzes/class-quiz/"+
     authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [subjectList,setSubjectList] = useState([]);
  const [currQuiz, setCurrQuiz] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);

  const convertToHtml = (content)=>{
      const unsafeHtml = draftToHtml(JSON.parse(content));
      return DOMPurify.sanitize(unsafeHtml);
    }

  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }
  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  

  const removeQuizFromList = (theQuiz, data)=>{
   const remainingQuiz = data.filter(quiz => quiz.id !== theQuiz.id);
    return remainingQuiz;
  }
  
  const deletes= async ()=>{
    const endpoint = "quizzes/delete-quiz/"+currQuiz.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this quiz were deleted successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          //remove the currently deleted quix from the list
          const remainingQuizzes = removeQuizFromList(currQuiz, quizList);
          setQuizList(remainingQuizzes);
      }catch(error){
          setIsLoading(false);
          setDialogMsg(JSON.stringify(error.response.data));
          handleOpenMsgBox();
    }
      
   }

  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }
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
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
     })
  },[])

  const getClassCode = (mark)=>{
    const classes = classList.filter(classlist=>(classlist.id === mark.classId))[0];
    return classes ? classes.classCode : "None";
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
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
     })
    }
   
  },[authUser])

  const getSubjectCode = (mark)=>{
    const subjects = subjectList.filter(subjectlist=>(subjectlist.id === mark.subjectId))[0];
    return subjects ? subjects.subjectCode : "None";
  }
 
  useEffect(()=>{
     //fetch all paginated students scores by recursively calling page by page
      const quizzes = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.results;
           setNextPage(response.data.next);
           setPrevPage(response.data.previous);
           if(data){
            setQuizList(data);  
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(JSON.stringify(error)+`Oops! sorry can't load quiz List`);
          }
      }
      quizzes(url, query);
  },[url, query])
  
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
              Class Quizzes</Typography>
            <Box component="form" sx={{backgroundColor:"#FFF", boxShadow:0, 
              border:"0.5px solid #EEE", padding:"5px 10px"}}>
            <div style={{marginBottom:"20px",float:"right",
               marginTop:"20px", marginRight:"auto"}}>
              <input type="text" required placeholder="Search" 
              style={{padding:"10px",border:"1px solid #CCC",
                outline:"none", color:"#999", backgroundColor:"#FFF"
              }} value={params}
                   onChange={(e) =>setParams(e.target.value)}
                   name="params" id="params"/>
              
              <IconButton  onClick={()=>{
                   setQuery({...query,search:params});
                }}>
                  <SearchIcon style={{color:"#666", width:"30px", height:"30px"}}/>
              </IconButton>
        </div>
        <Paper elevation={0}>
          <Scrollbars autoHide autoHideTimeout={1000}
          style={{width:"100%", height:"200px"}}>
          <Table style={{border:"1px solid #DDD"}}>
            <TableHead>
              <TableRow>
                 <TableCell style={{color:"darkblue"}}>Id</TableCell>
                 <TableCell style={{color:"darkblue"}}>Question</TableCell>
                 <TableCell style={{color:"darkblue"}}>Option1</TableCell>
                 <TableCell style={{color:"darkblue"}}>Option2</TableCell>
                 <TableCell style={{color:"darkblue"}}>Option3</TableCell>
                 <TableCell style={{color:"darkblue"}}>answer</TableCell>
                 <TableCell style={{color:"darkblue"}}>Start Date</TableCell>
                 <TableCell style={{color:"darkblue"}}>End Date</TableCell>
                 <TableCell style={{color:"darkblue"}}>Subject</TableCell>
                 <TableCell style={{color:"darkblue"}}>Class</TableCell>
                 <TableCell style={{color:"darkblue"}}>Reset Quiz</TableCell>
                 <TableCell style={{color:"darkblue"}}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  quizList.map(quiz=>(
                    <TableRow key={quiz.id}>
                      <TableCell style={{color:"darkblue"}}>{quiz.id}</TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        <div style={{color:"darkblue"}} dangerouslySetInnerHTML
                               ={{__html:convertToHtml(quiz.question).substring(0,50)
                               }}/> ...</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.option1}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.option2}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.option3}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.answer}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.startDate}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{quiz.endDate}</TableCell>
                      
                      <TableCell style={{color:"darkblue"}}>
                       {
                           getSubjectCode(quiz)
                        }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {
                           getClassCode(quiz)
                        }
                      </TableCell>
                      <TableCell >
                        <Button style={{backgroundColor:"darkblue", 
                                                height:"30px", width:"15px"}}
                                                 title="reset quiz"
                         onClick={()=>{
                            setCurrQuiz(quiz);
                            navigate('/update-quiz',{state:quiz});
                            
                          }}>
                          <UpdateIcon style={{color:"#FFF"}}></UpdateIcon>
                         </Button>
                      </TableCell>
                      <TableCell>
                         <Button style={{backgroundColor:"darkblue", 
                                                height:"30px", width:"15px"}}
                                                 title="delete"
                         onClick={()=>{
                            setCurrQuiz(quiz);
                            handleOpenDeleteDialog();
                          }}>
                          <TrashIcon style={{color:"#FFF"}}></TrashIcon>
                         </Button>
                      </TableCell>
                    </TableRow>
                    
                 ))
                        
              }
            </TableBody>
          </Table>
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
                     </Scrollbars>
                  </Paper>
                  <Container sx={{textAlign:"right", marginTop:"20px",
                    marginBottom:"20px", marginRight:"-21px"}}>
                    <Button
                    sx={{backgroundColor:"#FFF", color:"darkblue",fontSize:"12px",
                      border:"1px solid darkblue", marginRight:"8px", height:"30px", width:"15px"}}
                     onClick={()=>{
                       if(prevPage){
                         setUrl(prevPage);
                       }
                    }}>
                      Prev
                    </Button>
                    <Button 
                      sx={{backgroundColor:"#FFF", color:"darkblue",fontSize:"12px",
                      border:"1px solid darkblue", height:"30px", width:"15px"}}
                    onClick={()=>{
                      if(nextPage){
                         setUrl(nextPage);
                       }
                    }}>
                      Next
                    </Button>
                  </Container>
                  </Box>
                  </Box>
                </Layout>

        {/*Dialog window */}
        <ConfirmDialogForm open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
        onSubmit={()=>deletes()}
        formContent={<Typography>This action will delete this Quiz</Typography>}
        title="Confirm Dialog"
        />

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{dialogMsg}</Typography>}
        title="Message Dialog"
        />
    </div>
);
}


export default ClassQuiz;