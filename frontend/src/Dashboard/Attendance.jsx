import TrashIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import PromoteIcon from "@mui/icons-material/UpgradeOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function Attendance(){
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("attendance/attendance-list/");
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [userList,setUserList] = useState([]);
  const [currAttendance, setCurrAttendance] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);

  const handleCloseUpdateDialog = ()=>{
    setOpenUpdateDialog(false);
  }
  const handleOpenUpdateDialog = ()=>{
    setOpenUpdateDialog(true);
  }
  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }

  const update = async ()=>{
    const endpoint = "attendance/update-attendance/"+
    currAttendance.id+"/"; 
    setIsLoading(true);
      try{
        const userData = {
          classId:currAttendance.classId,
          userId:currAttendance.userId,
          remark:currAttendance.remark,
          attendance:currAttendance.attendance
        };
          const response = await axiosInstance.put(endpoint, userData );
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user attendance was updated successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          updateAttendanceFromList();
      }catch(error){
          setIsLoading(false);
          if(error.response){
             setDialogMsg(JSON.stringify(error.response.data));
           }else{
            setDialogMsg(error.message)
           }
          handleOpenMsgBox();
    }
      
   }

  const updateAttendanceFromList = () => {
    setAttendanceList(prevAttendance =>
      prevAttendance.map(attendance =>
        attendance.id === currAttendance.id ? { ...attendance, remark: currAttendance.remark } : attendance
      )
    );
  };

  const removeAttendanceFromList = (theAttendance, data)=>{
   const remainingAttendance = data.filter(attendance => attendance.id !== theAttendance.id);
    return remainingAttendance;
  }
   
  const deletes = async ()=>{
    const endpoint = "attendance/delete-attendance/"+currAttendance.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(JSON.stringify(data));
          }else{
            setDialogMsg("this data was deleted successfully");
          }
          
           handleOpenMsgBox();
          setIsLoading(false);
          setAttendanceList(removeAttendanceFromList(currAttendance,attendanceList));

      }catch(error){
          setIsLoading(false);
           if(error.response){
             setDialogMsg(JSON.stringify(error.response.data));
           }else{
            setDialogMsg(error.message)
           }
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
    //fetch all paginated class users data by recursively calling page by page
    const listUsers = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listUsers(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load users List`);
         throw error; //rethrow consequent error
     }
    }
     
     const url = "accounts/users-list/";
         listUsers(url).then(allData=>{
             setUserList(allData)
         }).catch((error)=>{
            if(error.response){
             setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load user List`);
           }else{
             setMsg(error.message)
           }
         })
    
  },[])

  const getUsername = (attendance)=>{
    const user = userList.filter(userlist=>(userlist.pk === attendance.userId))[0];
    return user ? (user.firstName+" "+user.lastName) : "None";
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
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
      }else{
        setMsg(error.message)
      }
     })
  },[])

  const getClassCode = (attendance)=>{
    const classes = classList.filter(classlist=>(classlist.id === attendance.classId))[0];
    return classes ? classes.classCode : "None";
  }

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
           setMsg(`Oops! sorry can't load class attendance List`);
          }
      }

      attendance(url, query);
  },[url, query])
  
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
          Attendance</Typography>
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
                 <TableCell style={{color:"darkblue"}}>Update</TableCell>
                 <TableCell style={{color:"darkblue"}}>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  attendanceList.map(attendance=>(
                    <TableRow key={attendance.id}>
                      <TableCell style={{color:"darkblue"}}>{attendance.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word", color:"darkblue",
                          }}>
                          {attendance.remark}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{color:"darkblue"}}>
                           <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                           <span style={{color:"darkblue"}}>
                                                           {dayjs(attendance.date).format("YYYY-MM-DD HH:mm.ss")}
                                                         </span>
                                                     </LocalizationProvider>
                        </span>
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {
                           getClassCode(attendance)
                        }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>{getUsername(attendance)}</TableCell>
                      <TableCell>
                        <Checkbox disabled checked={attendance.attendance}/>
                      </TableCell>
                      <TableCell>
                        <Button style={{backgroundColor:"darkblue", 
                        height:"30px", width:"15px"}} title="update"
                         onClick={()=>{
                             setCurrAttendance(attendance);
                             handleOpenUpdateDialog();
                          }}>
                        <PromoteIcon style={{color:"#FFF"}}></PromoteIcon>
                        </Button>
                      </TableCell>
                      <TableCell>
                         <Button title="delete" style={{backgroundColor:"darkblue",
                          height:"30px", width:"15px"
                         }}
                         onClick={()=>{
                             setCurrAttendance(attendance);
                             handleOpenDeleteDialog();
                          }}>
                        <TrashIcon style={{color:"#FFF",}}/>
                        </Button>
                      </TableCell>
                      
                    </TableRow>
                    
                 ))
                        
              }
            </TableBody>
          </Table>
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

        <ConfirmDialogForm open={openUpdateDialog} 
        onClose={handleCloseUpdateDialog} 
        onSubmit={()=>update()}
        formContent={
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
              <TextField
                   sx={{
                             '& .MuiInputBase-root':{
                              height:"50px",
                          },
                           '& .MuiOutlinedInput-input':{
                              height:"50px",
                              paddingTop:0,
                              paddingBottom:0,
                          },
                          }}
                  fullWidth
                  margin="normal"
                  labelId="remark"
                  id="remark"
                  name="remark"
                  value={currAttendance.remark}
                  onChange={(e) => setCurrAttendance({...currAttendance,
                   remark:e.target.value})}/>
          </FormControl>
        }
        title="Enter Remark"
        />


        <ConfirmDialogForm open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
        onSubmit={()=>deletes()}
        formContent={
          <Typography>Are you sure to delete this information</Typography>
        }
        title="DialogBox"
        />

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{dialogMsg}</Typography>}
        title="Message Dialog"
        />
    </div>
);
}


export default Attendance;