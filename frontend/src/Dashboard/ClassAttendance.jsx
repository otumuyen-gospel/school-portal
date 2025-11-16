import TrashIcon from "@mui/icons-material/DeleteOutline";
import ExcelIcon from "@mui/icons-material/ImportExportOutlined";
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
function ClassAttendance(){
  const[authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("attendance/class-attendance/"
         +authUser['user'].classId+"/");
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [userList,setUserList] = useState([]);
  const [currAttendance, setCurrAttendance] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [disabled, setDisabled] = useState(false)

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
            setDialogMsg(JSON.stringify(error.message));
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
            setDialogMsg(JSON.stringify(error.message));
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
     
     if(authUser){
         const url = "accounts/class-users/"+
         authUser['user'].classId+"/";
         listUsers(url).then(allData=>{
             setUserList(allData)
         }).catch((error)=>{
          if(error.response){
            setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't class users List`);
          }else{
            setMsg(JSON.stringify(error.message));
          }
         })
     }
    
  },[authUser])

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
        setMsg(JSON.stringify(error.message));
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
  },[url, query, authUser])


  const Download = async()=>{
          setIsLoading(true);
          setDisabled(true);
    
          axiosInstance.get("attendance/export-attendance/", {
            responseType: 'blob' // Important for file downloads
          })
          .then(response => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'class_attendance.xlsx');
             document.body.appendChild(link);
             link.click();
             window.URL.revokeObjectURL(url); // Clean up the temporary URL
             link.remove(); // Remove the temporary anchor element
             setDialogMsg("SucessFully Exported Data");
             handleOpenMsgBox()
             setIsLoading(false);
             setDisabled(false);
          })
          .catch(error => {
             setIsLoading(false);
             setDisabled(false);
             setDialogMsg("Unable To Export User Data");
             handleOpenMsgBox()
          });
    
        }
  
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
         Class Attendance</Typography>
        <Box component="form" sx={{backgroundColor:"#FFF", padding:"5px 10px"}}
        boxShadow={1}>
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
          <IconButton onClick={()=>{
                   setQuery({...query,search:params});
                }}>
              <SearchIcon style={{color:"#666", width:"30px", height:"30px"}}/>
          </IconButton>
        </div>
        <Paper elevation={0}>
          <Scrollbars autoHide autoHideTimeout={1000}
          style={{width:"100%", height:"200px"}}>
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Id</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Remark</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Date</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Class</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Username</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Status</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Update</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  attendanceList.map(attendance=>(
                    <TableRow key={attendance.id}>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{attendance.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"#333",
                          fontSize:"13px",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {attendance.remark}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{color:"#333", fontSize:"13px"}}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <span style={{color:"#333", fontSize:"13px"}}>
                                {dayjs(attendance.date).format("YYYY-MM-DD HH:mm.ss")}
                              </span>
                          </LocalizationProvider>
                        </span>
                      </TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>
                        {
                           getClassCode(attendance)
                        }
                      </TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{getUsername(attendance)}</TableCell>
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
                         <Button style={{backgroundColor:"darkblue", 
                        height:"30px", width:"15px"}} title="update"
                         onClick={()=>{
                             setCurrAttendance(attendance);
                             handleOpenDeleteDialog();
                          }}>
                        <TrashIcon style={{color:"#FFF"}}></TrashIcon>
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


export default ClassAttendance;