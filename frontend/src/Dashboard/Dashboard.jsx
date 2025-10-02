import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import ParentIcon from "@mui/icons-material/Man2Outlined";
import StudentIcon from "@mui/icons-material/PeopleOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineRounded";
import TeacherIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";

function Dashboard(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [studentCount, setStudentCount] = useState("");
   const [parentCount, setParentCount] = useState("");
   const [teacherCount, setTeacherCount] = useState("");
   const [adminCount, setAdminCount] = useState("");
   const [msg, setMsg] = useState('');
   const [isLoading, setIsLoading] = useState(false);
  //const [classList,setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [classStudentList, setClassStudentList] = useState([]);
  const [year] = useState(new Date().getFullYear());
  const [hasClassMate, setHasClassMate] = useState(false);

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
        if(authUser['user'].role === "student"){
          setHasClassMate(true); //is a student
         const url = "http://localhost:8000/accounts/class-users/"+
         authUser['user'].classId+"/";
         const query = {role:"student"}
         listStudents(url,query).then(allData=>{
           setClassStudentList(allData)
        }).catch((error)=>{
           setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load students List`);
        })
      }else {
        setHasClassMate(false); // is either an admin, teacher or parent
      }
      }
    },[authUser])


   /* fetch student count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
         
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setStudentCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");

          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"student"};
      users(url, query);
  },[])

  /* fetch teacher count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setTeacherCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"teacher"};
      users(url, query);
  },[])


  /* fetch admin count*/
   useEffect(()=>{
     setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setAdminCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"admin"};
      users(url, query);
  },[])

  /* fetch parent count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setParentCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"parent"};
      users(url, query);
  },[])
  

   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint)=>{
        try{
           const response = await axiosInstance.get(endpoint)
           const data = response.data;
           if(data){
            setStudentList(data);  
           }
           setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");

          }
      }
      const url = "http://localhost:8000/accounts/user-analytics/";
      users(url);
  },[])


  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Dashboard">
        <Box 
       sx={{
          minHeight:"97vh",
          marginTop:"10px",
          paddingBottom:"3vh",
        }}
        >
        <Typography component="h1" variant="h6" style={{marginBottom:"10px"}}>Dashboard</Typography>
        <Grid container spacing={4}>
          <Grid item size={{xs:6, sm:3}}>
            <Box style={{backgroundColor:"#FFF", borderRadius:"10px"}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{color:"royalblue", fontWeight:"bolder",
                     fontSize:"20px"}}>
                      {studentCount}
                    </Typography>
                     <Typography style={{fontWeight:"normal", color:"#999",
                     fontSize:"12px"}}>
                      Students
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <StudentIcon  style={{color:"#999", fontSize:"45px"}}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:6, sm:3}}>
            <Box style={{backgroundColor:"#FFF", borderRadius:"10px"}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{color:"royalblue", fontWeight:"bolder",
                     fontSize:"20px"}}>
                      {parentCount}
                    </Typography>
                     <Typography style={{fontWeight:"normal", color:"#999",
                     fontSize:"12px"}}>
                      Parents
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <ParentIcon  style={{color:"purple", fontSize:"45px"}}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:6, sm:3}}>
            <Box style={{backgroundColor:"#FFF", borderRadius:"10px"}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{color:"royalblue", fontWeight:"bolder",
                     fontSize:"20px"}}>
                      {teacherCount}
                    </Typography>
                     <Typography style={{fontWeight:"normal", color:"#999",
                     fontSize:"12px"}}>
                      Teachers
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <TeacherIcon  style={{color:"orange", fontSize:"45px"}}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:6, sm:3}}>
            <Box style={{backgroundColor:"#FFF", borderRadius:"10px"}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{color:"royalblue", fontWeight:"bolder",
                     fontSize:"20px"}}>
                      {adminCount}
                    </Typography>
                     <Typography style={{fontWeight:"normal", color:"#999",
                     fontSize:"12px"}}>
                      Administrators
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <AdminIcon  style={{color:"royalblue", fontSize:"45px"}}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12, sm:9}}>
             <Box style={{backgroundColor:"#FFF", 
             borderRadius:"10px", padding:"20px"}} 
            boxShadow={1}>
                <BarChart 
                 series={studentList}
                 xAxis={[
                  {data:[(year), (year - 1), (year - 2), (year - 3)]}
                 ]}
                 yAxis={[{width:50}]}
                />
                <Typography style={{textAlign:"center", color:"#999"}}>
                  Distribution of students in various Classes
                  </Typography>
               </Box>
          </Grid>

          <Grid item size={{xs:12, sm:3}}>
             <Box style={{backgroundColor:"#FFF", 
             borderRadius:"10px", padding:"20px"}} 
            boxShadow={1}>
                <Typography style={{textAlign:"center",
                  fontWeight:"bold", fontSize:"14px", 
                  color:"royalblue", marginBottom:"10px"}}>
                    CLASS MATES
                  </Typography>
                  <Scrollbars autoHide autoHideTimeout={1000}
                  style={{width:"100%", height:"200px"}}>
                  <List>
                    {
                    hasClassMate ? classStudentList.map(student=>(
                        <Paper elevation={1} style={{marginBottom:"15px"}}>
                         <ListItem key={student.pk}>
                          <ListItemIcon>
                            <PersonIcon  style={{
                              backgroundColor:"royalblue", 
                              color:"#FFF", borderRadius:"100px"}}/>
                          </ListItemIcon>
                          <ListItemText>
                            <Typography style={{fontWeight:"bold",
                              fontSize:"12px", color:"darkblue"
                            }}>
                              {student.lastName}
                              </Typography>
                              <Typography style={{fontWeight:"bold",
                                fontSize:"10px", color:"skyblue"
                              }}>
                                {student.firstName}
                              </Typography>
                          </ListItemText>
                         </ListItem>
                         </Paper>
                        ))
                        : <ListItem>
                          <ListItemText style={{color:"#999", 
                            textAlign:"center", marginTop:"70px"}}>
                            No Data
                          </ListItemText>
                        </ListItem>
                         
                    }
                  </List>
                  </Scrollbars>
               </Box>
          </Grid>
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

export default Dashboard;