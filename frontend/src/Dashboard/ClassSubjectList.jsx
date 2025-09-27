import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
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
function ClassSubjectList(){
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
    const url = "http://localhost:8000/subjects/class-subject-list/"+auth['user'].classId+"/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
      setIsLoading(false);
     }).catch((error)=>{
      setIsLoading(false);
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
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

    const url = "http://localhost:8000/classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
     })
  },[])
  
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="My Subjects">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">My Subjects</Typography>
         <Scrollbars autoHide autoHideTimeout={1000}
                          style={{width:"100%", height:"200px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Subject Code</TableCell>
              <TableCell>Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            subjectList.map(subjectlist=>(
              <TableRow key={subjectlist.id}>
              <TableCell>{subjectlist.id}</TableCell>
              <TableCell>{subjectlist.subjectName}</TableCell>
              <TableCell>{subjectlist.subjectCode}</TableCell>
              <TableCell>{getClassCode(subjectlist)}</TableCell>
              </TableRow>
              
            ))      
           }
           </TableBody>
        </Table>
         </Scrollbars>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
        
        </Box>
      </Layout>

        
    </div>
);
}

export default ClassSubjectList;