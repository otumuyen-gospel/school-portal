import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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
function UserAttendance(){
  const[authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const[authUserChild, setAuthUserChild] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [msg, setMsg] = useState("");
  const userId = authUser['user'].role === 'student' ? authUser['user'].pk : 
  authUser['user'].childId;
  const [url,setUrl] = useState("http://localhost:8000/attendance/user-attendance/"
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
         const url = "http://localhost:8000/classes/class-list/";
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
         const url = "http://localhost:8000/accounts/retrieve-user/"+userId+"/";
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
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="My Attendance">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">My Attendance</Typography>
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
                 <TableCell>Id</TableCell>
                 <TableCell>Remark</TableCell>
                 <TableCell>Date</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Username</TableCell>
                 <TableCell>Status</TableCell>
                 
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  attendanceList.map(attendance=>(
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {attendance.remark}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span>
                          {attendance.date}
                        </span>
                      </TableCell>
                      <TableCell>
                        {
                           getClassCode(attendance)
                        }
                      </TableCell>
                      <TableCell>{
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
    </div>
);
}


export default UserAttendance;