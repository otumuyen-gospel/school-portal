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
import { useEffect, useState } from "react";
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
  const [url,setUrl] = useState("http://localhost:8000/attendance/attendance-list/");
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
    const endpoint = "http://localhost:8000/attendance/update-attendance/"+
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
          setDialogMsg(JSON.stringify(error.response.data));
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
    const endpoint = "http://localhost:8000/attendance/delete-attendance/"+currAttendance.id+"/"; 
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
          setDialogMsg(JSON.stringify(error.response.data));
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
     
     const url = "http://localhost:8000/accounts/users-list/";
         listUsers(url).then(allData=>{
             setUserList(allData)
         }).catch((error)=>{
            setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load users List`);
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

    const url = "http://localhost:8000/classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
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
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Attendance">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Attendance</Typography>
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
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell>Id</TableCell>
                 <TableCell>Remark</TableCell>
                 <TableCell>Date</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Username</TableCell>
                 <TableCell>Status</TableCell>
                 <TableCell>Update</TableCell>
                 <TableCell>Delete</TableCell>
                 
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
                      <TableCell>{getUsername(attendance)}</TableCell>
                      <TableCell>
                        <Checkbox disabled checked={attendance.attendance}/>
                      </TableCell>
                      <TableCell>
                        <IconButton title="update"
                         onClick={()=>{
                             setCurrAttendance(attendance);
                             handleOpenUpdateDialog();
                          }}>
                        <PromoteIcon></PromoteIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                         <IconButton title="update"
                         onClick={()=>{
                             setCurrAttendance(attendance);
                             handleOpenDeleteDialog();
                          }}>
                        <TrashIcon></TrashIcon>
                        </IconButton>
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

        <ConfirmDialogForm open={openUpdateDialog} 
        onClose={handleCloseUpdateDialog} 
        onSubmit={()=>update()}
        formContent={
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
              <TextField
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