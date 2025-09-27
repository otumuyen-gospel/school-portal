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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ClassMarks(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [isLoading, setIsLoading] = useState(false);
  const [markList, setMarkList] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/marks/class-marks/"+
    authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [subjectList,setSubjectList] = useState([]);
  const [studentList,setStudentList] = useState([]);
  const [currMark, setCurrMark] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);

  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }
  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  

  const removeMarkFromList = (theMark, data)=>{
   const remainingMark = data.filter(mark => mark.id !== theMark.id);
    return remainingMark;
  }
  
  const deletes= async ()=>{
    const endpoint = "http://localhost:8000/marks/delete-mark/"+currMark.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user scores were deleted successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          //remove the currently deleted scores from the list
          const remainingMarks = removeMarkFromList(currMark, markList);
          setMarkList(remainingMarks);
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

    const url = "http://localhost:8000/classes/class-list/";
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
    //fetch all paginated class data by recursively calling page by page
    const listStudents = async(url, queries)=>{
      try{
         const response = await axiosInstance.get(url, queries)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listStudents(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load student List`);
         throw error; //rethrow consequent error
     }
    }
    
    if(authUser){
       const url = "http://localhost:8000/accounts/class-users/"+
       authUser['user'].classId+"/";
       const queries = {role:"student"};
       listStudents(url, queries).then(allData=>{
      setStudentList(allData)
       }).catch((error)=>{
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load students List`);
       })
    }
   
  },[authUser])

  const getStudentName = (mark)=>{
    const user = studentList.filter(user=>(user.pk === mark.userId))[0];
    return user ? (user.firstName+" "+user.lastName): "None";
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
     })
    }
   
  },[authUser])

  const getSubjectCode = (mark)=>{
    const subjects = subjectList.filter(subjectlist=>(subjectlist.id === mark.subjectId))[0];
    return subjects ? subjects.subjectCode : "None";
  }

 const getGrade = (grade)=>{
  if(grade > 69){
    return 'A';
  }else if(grade > 59){
    return 'B';
  }else if(grade >49){
    return 'C';
  }else if(grade >39){
    return 'D';
  }else if(grade >30){
    return 'E';
  }else{
    return 'F';
  }
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
            //remove the currently logged in user from the list
            const auth = JSON.parse(localStorage.getItem("auth"));
            const remainingMark = removeMarkFromList(auth['user'], data);
            setMarkList(remainingMark);  
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
      <Layout title="Class Mark Sheet">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Class Mark Sheet</Typography>
        <Container sx={{textAlign:"right"}} >
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
                 <TableCell>Name</TableCell>
                 <TableCell>Id</TableCell>
                 <TableCell>Test 1</TableCell>
                 <TableCell>Test 2</TableCell>
                 <TableCell>Test 3</TableCell>
                 <TableCell>Work 1</TableCell>
                 <TableCell>Work 2</TableCell>
                 <TableCell>Work 3</TableCell>
                 <TableCell>Exam</TableCell>
                 <TableCell>Total</TableCell>
                 <TableCell>Grade</TableCell>
                 <TableCell>Subject</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Update</TableCell>
                 <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  markList.map(mark=>(
                    <TableRow key={mark.id}>
                      <TableCell>
                       {
                           getStudentName(mark)
                        }
                      </TableCell>
                      <TableCell>{mark.id}</TableCell>
                      <TableCell>{mark.test_score1}</TableCell>
                      <TableCell>{mark.test_score2}</TableCell>
                      <TableCell>{mark.test_score3}</TableCell>
                      <TableCell>{mark.homework_score1}</TableCell>
                      <TableCell>{mark.homework_score2}</TableCell>
                      <TableCell>{mark.homework_score3}</TableCell>
                      <TableCell>{mark.examScore}</TableCell>
                      <TableCell>
                        {
                          (parseInt(mark.test_score1) + 
                          parseInt(mark.test_score2) + 
                          parseInt(mark.test_score3) + 
                          parseInt(mark.examScore))
                        }
                      
                      </TableCell>
                      <TableCell>
                       {
                        getGrade((parseInt(mark.test_score1) + 
                          parseInt(mark.test_score2) + 
                          parseInt(mark.test_score3) + 
                          parseInt(mark.examScore)))
                       }
                      </TableCell>
                      <TableCell>
                       {
                           getSubjectCode(mark)
                        }
                      </TableCell>
                      <TableCell>
                        {
                           getClassCode(mark)
                        }
                      </TableCell>
                      <TableCell>
                         <IconButton title="update"
                         onClick={()=>{
                            setCurrMark(mark);
                            navigate('/mark-update',{state:mark});
                            
                          }}>
                          <UpdateIcon></UpdateIcon>
                         </IconButton>
                      </TableCell>
                      <TableCell>
                         <IconButton title="delete"
                         onClick={()=>{
                            setCurrMark(mark);
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
        <Container sx={{textAlign:"right", margin:"40px auto"}}>
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
        formContent={<Typography>This action will delete this score record</Typography>}
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


export default ClassMarks;