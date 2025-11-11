import ExcelIcon from "@mui/icons-material/ImportExportOutlined";
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
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
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
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
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
              Statement Of Results </Typography>
            <Box component="form" sx={{backgroundColor:"#FFF", boxShadow:0, 
              border:"0.5px solid #EEE", padding:"5px 10px"}}>
            <div style={{marginBottom:"20px",float:"right",
               marginTop:"20px", marginRight:"auto"}}>
              <Button style={{backgroundColor:"#FFF",border:"1px solid #CCC",
                height:"37px", marginRight:"8px"
               }}
               title="Export To Excel"
               disabled={disabled}
                onClick={Download}
               >
                <ExcelIcon style={{color:"darkblue", width:"30px", height:"30px"}} />
               </Button>
              <input type="text" required placeholder="Search" 
              style={{padding:"10px",border:"1px solid #CCC",
                outline:"none", color:"#999", backgroundColor:"#FFF"
              }} value={params}
                   onChange={(e) =>setParams(e.target.value)}
                   name="params" id="params"/>
              
              <IconButton onClick={initializeQuery}>
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
                 <TableCell style={{color:"darkblue"}}>Test1</TableCell>
                 <TableCell style={{color:"darkblue"}}>Test2</TableCell>
                 <TableCell style={{color:"darkblue"}}>Test3</TableCell>
                 <TableCell style={{color:"darkblue"}}>Work1</TableCell>
                 <TableCell style={{color:"darkblue"}}>Work2</TableCell>
                 <TableCell style={{color:"darkblue"}}>Work3</TableCell>
                 <TableCell style={{color:"darkblue"}}>Exam</TableCell>
                 <TableCell style={{color:"darkblue"}}>Total</TableCell>
                 <TableCell style={{color:"darkblue"}}>Grade</TableCell>
                 <TableCell style={{color:"darkblue"}}>Subject</TableCell>
                 <TableCell style={{color:"darkblue"}}>Class</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  markList.map(mark=>(
                    <TableRow key={mark.id}>
                      <TableCell style={{color:"darkblue"}}>{mark.id}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.test_score1}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.test_score2}</TableCell>
                      <TableCell v>{mark.test_score3}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.homework_score1}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.homework_score2}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.homework_score3}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{mark.examScore}</TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {
                          (parseInt(mark.test_score1) + 
                          parseInt(mark.test_score2) + 
                          parseInt(mark.test_score3) + 
                          parseInt(mark.examScore))
                        }
                      
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                       {
                        getGrade((parseInt(mark.test_score1) + 
                          parseInt(mark.test_score2) + 
                          parseInt(mark.test_score3) + 
                          parseInt(mark.examScore)))
                       }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                       {
                           getSubjectCode(mark)
                        }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
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


         <MessageDialogForm open={openMsgBox} 
                onClose={handleCloseMsgBox} 
                formContent={<Typography>{msg}</Typography>}
                title="Message Dialog"
                />

    </div>
);
}


export default UserMarks;