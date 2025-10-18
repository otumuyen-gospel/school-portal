import QuizIcon from "@mui/icons-material/QuizOutlined";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
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

    const url = "classes/class-list/";
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
        <Typography component="h1" variant="h6" marginBottom={5}>
          My Subjects</Typography>
        <Grid container spacing={4} marginBottom={5}>
          {
            subjectList.map(subjectlist=>(
              <Grid item size={{xs:12, sm:12}} key={subjectlist.id}>
                <Box boxShadow={1}>
                  <Box padding="15px 5px">
                  <Grid container spacing={4}>
                    <Grid item size={{xs:6,}}>
                      <Typography color="royalblue" fontWeight="bolder"  
                         textAlign="left" fontSize={15}>
                         {subjectlist.subjectCode}
                      </Typography>
                       <Typography color="royalblue" fontWeight="bolder"  
                          fontSize={12} textAlign="left">
                         {subjectlist.subjectName}
                      </Typography>
                    </Grid>
                    <Grid item size={{xs:6,}}>
                      <Box textAlign="right">
                      <IconButton title="Take the Quiz" 
                         onClick={()=>{
                             navigate('/user-quiz',{state:subjectlist});
                          }}>
                          <QuizIcon sx={{color:"#888", 
                            width:"16px", height:"16px"}}/>
                         </IconButton>
                          
                         </Box>
                    </Grid>
                  </Grid>
                  </Box>
                  <Box padding="10px 5px" backgroundColor="#FCFCF9" >
                    <Typography color="#333">{getClassCode(subjectlist)}</Typography>
                  </Box>
                </Box>
                
              </Grid> 
            ))      
           }
        </Grid>
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