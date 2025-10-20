import ExcelIcon from "@mui/icons-material/ImportExportOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
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
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function UserMarks(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [isLoading, setIsLoading] = useState(false);
  const [markList, setMarkList] = useState([]);
  const [msg, setMsg] = useState("");
  const userId =  authUser['user'].role === 'student' ? authUser['user'].pk :
  authUser['user'].childId // student or parent
  const [url,setUrl] = useState("marks/user-marks/"+
   userId+"/"
  );
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [subjectList,setSubjectList] = useState([]);
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [disabled, setDisabled] = useState(false)
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }


  const removeMarkFromList = (theMark, data)=>{
   const remainingMark = data.filter(mark => mark.id !== theMark.id);
    return remainingMark;
  }
  
  useEffect(()=>{
    //fetch all paginated subject data by recursively calling page by page
    const listClass = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listClass(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load class List`);
         throw error; //rethrow consequent error
     }
    }
    
    if(authUser){
       const url = "classes/class-list/";
    listClass(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
     })
    }
   
  },[authUser])

  const getClassCode = (mark)=>{
    const c = classList.filter(classes=>(classes.id === mark.classId))[0];
    return c ? c.classCode : "None";
  }
  const getClassId = (code)=>{
     const c = classList.filter(classes=>(classes.classCode === code))[0];
    return c ? c.id : "";
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
       const url = "subjects/subject-list/";
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

  const getSubjectId = (code)=>{
     const subjects = subjectList.filter(subjectlist=>(subjectlist.subjectCode
       === code))[0];
    return subjects ? subjects.id : "";
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

  const initializeQuery = ()=>{
    const classId = getClassId(params)
    const subjectId = getSubjectId(params)
    if(classId){
      setQuery({...query,search:classId})
    }else if(subjectId){
      setQuery({...query,search:subjectId}) 
    }else{
      setQuery({...query, search:params})
    }
  }


  const Download = async()=>{
        setIsLoading(true);
        setDisabled(true);
  
        axiosInstance.get("marks/export-marks/", {
          responseType: 'blob' // Important for file downloads
        })
        .then(response => {
           const url = window.URL.createObjectURL(new Blob([response.data]));
           const link = document.createElement('a');
           link.href = url;
           link.setAttribute('download', 'my_results.xlsx');
           document.body.appendChild(link);
           link.click();
           window.URL.revokeObjectURL(url); // Clean up the temporary URL
           link.remove(); // Remove the temporary anchor element
           setMsg("SucessFully Exported Data");
           handleOpenMsgBox()
           setIsLoading(false);
           setDisabled(false);
        })
        .catch(error => {
           setIsLoading(false);
           setDisabled(false);
           setMsg("Unable To Export User Data");
           handleOpenMsgBox()
        });
  
      }
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="My Grades">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">My Grades</Typography>
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
                onClick={initializeQuery}
               >
                <SearchIcon></SearchIcon>
               </Button>

               <Button 
               title="Export To Excel"
               disabled={disabled}
               variant="contained"
               sx={{backgroundColor:"#FFF",
                color:"royalblue",
                border:"1px",
                borderRadius:"0px",
                marginTop:"16px",
                marginLeft:"10px",
                '& .hover':{backgroundColor:"#FFF", color:"dodgerblue"},
                minHeight:"54px"}}
                onClick={Download}
               >
                <ExcelIcon />
               </Button>
        </Container>
        <Paper>
           <Scrollbars autoHide autoHideTimeout={1000}
                            style={{width:"100%", height:"200px"}}>
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell>Id</TableCell>
                 <TableCell>Test1</TableCell>
                 <TableCell>Test2</TableCell>
                 <TableCell>Test3</TableCell>
                 <TableCell>Work1</TableCell>
                 <TableCell>Work2</TableCell>
                 <TableCell>Work3</TableCell>
                 <TableCell>Exam</TableCell>
                 <TableCell>Total</TableCell>
                 <TableCell>Grade</TableCell>
                 <TableCell>Subject</TableCell>
                 <TableCell>Class</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  markList.map(mark=>(
                    <TableRow key={mark.id}>
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


         <MessageDialogForm open={openMsgBox} 
                onClose={handleCloseMsgBox} 
                formContent={<Typography>{msg}</Typography>}
                title="Message Dialog"
                />
      </Layout>

    </div>
);
}


export default UserMarks;