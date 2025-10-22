import TrashIcon from "@mui/icons-material/DeleteOutline";
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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function QuizList(){
   const [isLoading, setIsLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("quizzes/quiz-list/");
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

    const url = "subjects/subject-list/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
     })
  },[])

  const getSubjectCode = (mark)=>{
    const subjects = subjectList.filter(subjectlist=>(subjectlist.id === mark.subjectId))[0];
    return subjects ? subjects.subjectCode : "None";
  }
 
  useEffect(()=>{
     //fetch all paginated students scores by recursively calling page by page
      const users = async(endpoint, queries)=>{
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
           setMsg(`Oops! sorry can't load users List`);
          }
      }
      users(url, query);
  },[url, query])
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="All Quizzes">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">All Quizzes</Typography>
        <Container sx={{textAlign:"right", marginRight:"-25px"}} >
          <TextField
               minWidth="200px"
               margin="normal"
               required
               id="params"
               label="params"
               type="text"
               value={params}
               onChange={(e) =>setParams(e.target.value)}
               name="params"/>
               <Button 
               sx={{backgroundColor:"royalblue",
                color:"#FFFFFF",
                border:"1px",
                borderRadius:"0px",
                marginTop:"16px",
                '& .hover':{backgroundColor:"dodgerblue"},
                minHeight:"56px"}}
                onClick={()=>{
                   setQuery({...query,search:params});
                }}
               >
                <SearchIcon></SearchIcon>
               </Button>
        </Container>
        <Paper>
           <Scrollbars autoHide autoHideTimeout={1000}
                            style={{width:"100%", height:"200px"}}>
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell>Id</TableCell>
                 <TableCell>Question</TableCell>
                 <TableCell>Option1</TableCell>
                 <TableCell>Option2</TableCell>
                 <TableCell>Option3</TableCell>
                 <TableCell>answer</TableCell>
                 <TableCell>Start Date</TableCell>
                 <TableCell>End Date</TableCell>
                 <TableCell>Subject</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  quizList.map(quiz=>(
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.id}</TableCell>
                      <TableCell>
                        <div dangerouslySetInnerHTML
                               ={{__html:convertToHtml(quiz.question).substring(0,50)
                               }}/> ...
                      </TableCell>
                      <TableCell>{quiz.option1}</TableCell>
                      <TableCell>{quiz.option2}</TableCell>
                      <TableCell>{quiz.option3}</TableCell>
                      <TableCell>{quiz.answer}</TableCell>
                      <TableCell>{quiz.startDate}</TableCell>
                      <TableCell>{quiz.endDate}</TableCell>
                      
                      <TableCell>
                       {
                           getSubjectCode(quiz)
                        }
                      </TableCell>
                      <TableCell>
                        {
                           getClassCode(quiz)
                        }
                      </TableCell>
                      <TableCell>
                         <IconButton title="delete"
                         onClick={()=>{
                            setCurrQuiz(quiz);
                            handleOpenDeleteDialog();
                          }}>
                          <TrashIcon></TrashIcon>
                         </IconButton>
                      </TableCell>
                    </TableRow>
                    
                 ))
                        
              }
            </TableBody>
          </Table>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
           </Scrollbars>
        </Paper>
        <Container sx={{textAlign:"right", marginTop:"40px", 
          marginRight:"-21px",marginBottom:"40px"}}>
          <Button
          sx={{backgroundColor:"royalblue", color:"#FFF", marginRight:"8px"}}
           onClick={()=>{
             if(prevPage){
               setUrl(prevPage);
             }
          }}>
            Prev
          </Button>
          <Button 
            sx={{backgroundColor:"royalblue", color:"#FFF"}}
          onClick={()=>{
            if(nextPage){
               setUrl(nextPage);
             }
          }}>
            Next
          </Button>
        </Container>
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


export default QuizList;