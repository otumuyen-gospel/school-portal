import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function UserAttendance(){
  const[authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const[authUserChild, setAuthUserChild] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [msg, setMsg] = useState("");
  const userId = authUser['user'].role === 'student' ? authUser['user'].pk : 
  authUser['user'].childId;
  const [url,setUrl] = useState("attendance/user-attendance/"
         +userId+"/");
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);

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
  
    const getClassCode = (attendance)=>{
      const c = classList.filter(classes=>(classes.id === attendance.classId))[0];
      return c ? c.classCode : "None";
    }

  useEffect(()=>{
    const childInfo = async(url)=>{
      try{
         const response = await axiosInstance.get(url);
          const data = response.data;
            if(data){
             setAuthUserChild(data);
          }
      }catch(error){
         setMsg(`Oops! sorry can't load user details`);
     }
    }

    if(userId){
         const url = "accounts/retrieve-user/"+userId+"/";
         childInfo(url);
    }
    
  },[userId])


  useEffect(()=>{
      const attendance = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.results;
           setNextPage(response.data.next);
           setPrevPage(response.data.previous);
           if(data){
           setAttendanceList(data);
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(`Oops! sorry can't load user attendance List`);
          }
      }

      attendance(url, query);
  },[url, query, authUser])
  
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
         Attendance Information</Typography>
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
          <IconButton onClick={()=>{
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
                <TableCell style={{color:"darkblue"}}>Remark</TableCell>
                <TableCell style={{color:"darkblue"}}>Date</TableCell>
                <TableCell style={{color:"darkblue"}}>Class</TableCell>
                <TableCell style={{color:"darkblue"}}>Username</TableCell>
                <TableCell style={{color:"darkblue"}}>Status</TableCell>
                 
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  attendanceList.map(attendance=>(
                    <TableRow key={attendance.id}>
                      <TableCell style={{color:"darkblue"}}>{attendance.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"darkblue", 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {attendance.remark}
                        </span>
                      </TableCell>
                      <TableCell >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <span style={{color:"darkblue"}}>
                          {dayjs(attendance.date).format("YYYY-MM-DD HH:mm.ss")}
                        </span>
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {
                           getClassCode(attendance)
                        }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>{
                        authUserChild.firstName + " "+  authUserChild.lastName
                       }
                      </TableCell>
                      <TableCell>
                        <Checkbox disabled checked={attendance.attendance}/>
                      </TableCell>
                      
                    </TableRow>
                    
                 ))
                        
              }
            </TableBody>
          </Table>
          <div className="loaderContainer">
            {isLoading && <CircularProgress x={{
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
    </div>
);
}


export default UserAttendance;