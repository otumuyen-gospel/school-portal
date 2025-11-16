import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import ParentIcon from "@mui/icons-material/Man2Outlined";
import AttendanceIcon from "@mui/icons-material/PagesOutlined";
import StudentIcon from "@mui/icons-material/PeopleOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineRounded";
import TeacherIcon from "@mui/icons-material/SchoolOutlined";
import SubjectIcon from "@mui/icons-material/SubjectOutlined";
import Avatar from "@mui/material/Avatar";
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
   const [studentCount, setStudentCount] = useState(0);
   const [parentCount, setParentCount] = useState(0);
   const [teacherCount, setTeacherCount] = useState(0);
   const [adminCount, setAdminCount] = useState(0);
   const [classCount, setClassCount] = useState(0);
   const [subjectCount, setSubjectCount] = useState(0);
   const [attendanceCount, setAttendanceCount] = useState(0);
   const [msg, setMsg] = useState('');
   const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [classStudentList, setClassStudentList] = useState([]);
  const [year] = useState(new Date().getFullYear());
  const [hasClassMate, setHasClassMate] = useState(false);

  const removeUserFromList = (theUser, data)=>{
   const remainingUsers = data.filter(user => user.pk !== theUser.pk);
    return remainingUsers;
  }
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
         const url = "accounts/class-users/"+
         authUser['user'].classId+"/";
         const query = {role:"student"}
         listStudents(url,query).then(allData=>{
           const currUser = JSON.parse(localStorage.getItem("auth"))['user'];
           const remainingUsers = removeUserFromList(currUser, allData);
           setClassStudentList(remainingUsers)
        }).catch((error)=>{
          setMsg("Oops! sorry can't load students List");
        })
      }else {
        setHasClassMate(false); // is either an admin, teacher or parent
      }
      }
    },[authUser])


     /* fetch subject count*/
   useEffect(()=>{
       setIsLoading(true);
      const subject = async(endpoint)=>{
        try{
         
           const response = await axiosInstance.get(endpoint)
           const data = response.data.count;
           if(data){
            setSubjectCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");

          }
      }
      const url = "subjects/subject-list/";
      subject(url);
  },[])

     /* fetch class count*/
   useEffect(()=>{
       setIsLoading(true);
      const classes = async(endpoint)=>{
        try{
         
           const response = await axiosInstance.get(endpoint)
           const data = response.data.count;
           if(data){
            setClassCount(data);  
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");

          }
      }
      const url = "classes/class-list/";
      classes(url);
  },[])

   /* fetch today's attendance count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
         
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setAttendanceCount(data);  
           }else{
            setAttendanceCount(0)
           }
            setIsLoading(false)
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
            setAttendanceCount(0)
          }
      }
      const now = new Date();

      // Get individual components
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Month is 0-indexed
      const day = now.getDate();
      const date = year+"-"+(month < 10 ? ("0"+month) :month)+
      "-"+(day < 10 ? ("0"+day) :day);
      const url = "attendance/attendance-list/";
      const query = {search:date};
      users(url, query);
  },[])

  const formatAttendanceCount = (attendance, student)=>{
    if(attendance > 0){
      return attendance + " / " + student;
    }
    return;
  }


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
      const url = "accounts/users-list/";
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
      const url = "accounts/users-list/";
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
      const url = "accounts/users-list/";
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
      const url = "accounts/users-list/";
      const query = {role:"parent"};
      users(url, query);
  },[])
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint)=>{
        try{
           const response = await axiosInstance.get(endpoint);
           const data = response.data;
            setIsLoading(false)
           if(data){
           //remove duplication in the data array
           const uniqueArray = data.filter((obj, index, self) =>
               index === self.findIndex((o) => o.label === obj.label)
           );
           setStudentList(uniqueArray);
          }
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "accounts/user-analytics/";
      users(url);
      
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
          Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Students
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {studentCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <StudentIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF",height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Parents
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {parentCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <ParentIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Teachers
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {teacherCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <TeacherIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Administrators
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {adminCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <AdminIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Total Users
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {(studentCount + parentCount + adminCount + teacherCount)}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <CircleIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Classes
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {classCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <ClassIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Subjects
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {subjectCount}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <SubjectIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12,sm:6, md:3}}>
            <Box style={{backgroundColor:"#FFF", height:"60px", padding:"15px 10px",}} 
            boxShadow={1}>
                <ListItem>
                  <ListItemText>
                    <Typography style={{fontWeight:"normal", color:"#666",
                     fontSize:"13px"}}>
                      Today's Attendance
                    </Typography>
                    <Typography style={{color:"darkblue", fontWeight:"bolder",
                     fontSize:"12px"}}>
                      {formatAttendanceCount(attendanceCount, studentCount)}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <AttendanceIcon  style={{color:"darkblue", fontSize:"20px", position:"absolute",
                      right:"0", top:"0"
                    }}/>
                  </ListItemIcon>
                </ListItem>
            </Box>
          </Grid>

          <Grid item size={{xs:12, md:9}}>
             <Box style={{backgroundColor:"#FFF", height:"270px",
              padding:"15px 10px",}} 
            boxShadow={1}>
              <Scrollbars autoHide autoHideTimeout={1000}
                  style={{width:"100%", height:"250px"}}>
                <BarChart 
                 series={studentList}
                 xAxis={[
                  {data:[(year), (year - 1), (year - 2), (year - 3)],scaleType: 'band'}
                 ]}
                 yAxis={[{width:50}]}
                />
                </Scrollbars>
                <Typography style={{textAlign:"center", color:"#333",
                  fontSize:"14px",
                }}>
                  Distribution of students in various Classes
                  </Typography>
               </Box>
          </Grid>

          <Grid item size={{xs:12, md:3}}>
             <Box style={{backgroundColor:"#FFF", padding:"15px 10px",}} 
            boxShadow={1}>
                <Typography style={{textAlign:"center",fontSize:"13px", 
                  color:"#333", marginBottom:"10px"}}>
                    CLASS MATES
                  </Typography>
                  <Scrollbars autoHide autoHideTimeout={1000}
                  style={{width:"100%", height:"240px"}}>
                  <List>
                    {
                    hasClassMate ? classStudentList.map(student=>(
                        <Paper elevation={1} style={{marginBottom:"15px", width:"100%",
                        }}>
                         <ListItem key={student.pk}>
                          <ListItemIcon>
                            <Avatar
                              src={student.pics}
                              sx={{
                                width:40,
                                height:40,
                              }}
                              >
                                {
                                  !student.pics && <PersonIcon  style={{
                                        backgroundColor:"darkblue", 
                                        color:"#FFF", borderRadius:"100px"}}/>
                                }
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText>
                            <Typography style={{
                              fontSize:"13px", color:"#333", wordWrap:"break-word",
                            }}>
                              {student.lastName}
                              </Typography>
                              <Typography style={{fontSize:"11px", color:"#666",
                              wordWrap:"break-word",
                              }}>
                                {student.firstName}
                              </Typography>
                          </ListItemText>
                         </ListItem>
                         </Paper>
                        ))
                        : <ListItem>
                          <ListItemText style={{color:"#666", fontSize:"12",
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
            {isLoading && <CircularProgress sx={{
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
        
        </Box>
      </Layout>


    </div>
);
}

export default Dashboard;