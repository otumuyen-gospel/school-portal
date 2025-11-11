import SearchIcon from "@mui/icons-material/SearchOutlined";
import PromoteIcon from "@mui/icons-material/UpgradeOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
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
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ClassUsers(){
  const [authUser] = useState(JSON.parse(localStorage.getItem("auth")));
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("accounts/class-users/"
    +authUser['user'].classId+"/");
  const [query,setQuery] =useState({
    search:'', role:'student',
  });
  const [classList,setClassList] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [remark,setRemark] = useState("");
  const [markedAttendance, setMarkedAttendance] = useState([]);
  

  const handleClosePromoteDialog = ()=>{
    setOpenPromoteDialog(false);
  }
  const handleOpenPromoteDialog = ()=>{
    setOpenPromoteDialog(true);
  }
  const handleCloseAttendanceDialog = ()=>{
    setOpenAttendanceDialog(false);
  }
  const handleOpenAttendanceDialog = (e, attendance)=>{
    if(e.target.checked){ //checked
       setOpenAttendanceDialog(true);
    }else{ //unchecked
      //delete instances of current attendance from backend and frontend
      deletes(attendance);
      
    }
  }

  const removeAttendanceFromList = (theAttendance, data)=>{
     const remainingAttendance = data.filter(attendance => attendance.id !== theAttendance.id);
      return remainingAttendance;
    }
     
    const deletes = async (marked)=>{
      const endpoint = "attendance/delete-attendance/"+
      marked.id+"/"; 
      setIsLoading(true);
        try{
            const response = await axiosInstance.delete(endpoint);
            const data = response.data.results;
            if(data){
              setDialogMsg(JSON.stringify(data));
            }else{
              setDialogMsg("attendance was unmarked");
            }
            
             handleOpenMsgBox();
            setIsLoading(false);
            setMarkedAttendance(removeAttendanceFromList(marked,markedAttendance));
  
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

  const attendance = async ()=>{
    const endpoint = "attendance/create-attendance/"; 
    setIsLoading(true);
      try{
        const userData = {
          classId:currUser.classId,
          userId:currUser.pk,
          remark:remark,
          attendance:true
        };
          const response = await axiosInstance.post(endpoint, userData );
          const data = response.data;
          if(data){
            markedAttendance.push(data)
          }
          setIsLoading(false);
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

  const updateUserFromList = () => {
    setUserList(prevUsers =>
      prevUsers.map(user =>
        user.pk === currUser.pk ? { ...user, classId: currUser.classId } : user
      )
    );
  };

  const removeUserFromList = (theUser, data)=>{
   const remainingUsers = data.filter(user => user.pk !== theUser.pk);
    return remainingUsers;
  }
   
  const promotes = async (pk)=>{
    const endpoint = "accounts/user-promotion/"+pk+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.patch(endpoint, {classId:currUser.classId});
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user was promoted successfully");
          }
          setIsLoading(false);
          if(pk === currUser.pk){ //if not student be silent
             handleOpenMsgBox();
             updateUserFromList();
          }
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

    const updateParent = async()=>{
      try{
        const q = {role:'parent', childId:currUser.pk}
         const response = await axiosInstance.get(url,{params:q});
          const data = response.data;
            if(data){
             promotes(data.results[0].pk);
          }
      }catch(error){
         setMsg(`Oops! sorry can't load user details`);
     }
    }
  

  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
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

  const getClassCode = (user)=>{
    const classes = classList.filter(classlist=>(classlist.id === user.classId))[0];
    return classes ? classes.classCode : "None";
  }

  const getMarkedAttendance = (user)=>{
    const marked = markedAttendance.filter(att=>(att.userId === user.pk))[0];
    return <Checkbox
              checked={marked ? marked.attendance: false}
              onChange={(e)=>{
              setCurrUser(user);
              handleOpenAttendanceDialog(e, marked);
    }}/>;
  }
  useEffect(()=>{
     //fetch all paginated students data by recursively calling page by page
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
            const remainingUsers = removeUserFromList(auth['user'], data);
            setUserList(remainingUsers);  
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(`Oops! sorry can't load users List`);
          }
      }
      users(url, query);
  },[url, query])

  const today = ()=>{
    const originalDate = new Date(); // Get the current date and time

    // Example using YYYY-MM-DD format
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = originalDate.getDate().toString().padStart(2, '0');

    const customFormattedDate = `${year}-${month}-${day}`;
    return customFormattedDate; // Example output: "2025-09-10"
  }

  useEffect(()=>{
    //fetch all paginated class attendance for today by recursively calling page by page
    const listAttendance = async(url, queries)=>{
      try{
         const response = await axiosInstance.get(url,{params:queries})
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listAttendance(nextPage, queries));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load class Attendance`);
         throw error; //rethrow consequent error
     }
    }

    if(authUser){
      const classId = authUser['user'].classId;
      const url = "attendance/class-attendance/"+classId+"/";
      const queries = {search:today()};
      listAttendance(url, queries).then(allData=>{
         setMarkedAttendance(allData)
      }).catch((error)=>{
         setMsg(` Oops! sorry can't load class data`);
      })
    }
    
  },[authUser])

  
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
              Students' Lists</Typography>
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
                 <TableCell style={{color:"darkblue"}}>Username</TableCell>
                 <TableCell style={{color:"darkblue"}}>FirstName</TableCell>
                 <TableCell style={{color:"darkblue"}}>LastName</TableCell>
                 <TableCell style={{color:"darkblue"}}>Class</TableCell>
                 <TableCell style={{color:"darkblue"}}>Role</TableCell>
                 <TableCell style={{color:"darkblue"}}>Promote</TableCell>
                 <TableCell style={{color:"darkblue"}}>Attendance</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  userList.map(user=>(
                    <TableRow key={user.pk}>
                      <TableCell style={{color:"darkblue"}}>{user.pk}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{user.username}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"darkblue",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.firstName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"darkblue",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.lastName}
                        </span>
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {
                           getClassCode(user)
                        }
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>{user.role}</TableCell>
                      <TableCell>
                        <Button style={{backgroundColor:"darkblue", 
                                                height:"30px", width:"15px"}}
                                                 title="promote"
                         onClick={()=>{
                             setCurrUser(user);
                             handleOpenPromoteDialog();
                          }}>
                        <PromoteIcon style={{color:"#FFF"}}></PromoteIcon>
                        </Button>
                      </TableCell>
                      <TableCell style={{color:"darkblue"}}>
                        {getMarkedAttendance(user)}
                      </TableCell>
                      
                    </TableRow>
                    
                 ))
                        
              }
            </TableBody>
          </Table>
          <div className="loaderContainer">
            {isLoading && <CircularProgress   sx={{
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

        <ConfirmDialogForm open={openPromoteDialog} 
        onClose={handleClosePromoteDialog} 
        onSubmit={()=>{
          promotes(currUser.pk); //promote student
          updateParent(currUser.pk); //promote student's parent as well
        }}
        formContent={
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
              <InputLabel id="class-label"/>
              <Select
                  sx={{ height:"50px",}}
                  fullWidth
                  margin="normal"
                  labelId="class-label"
                  id="classId"
                  name="classId"
                  value={currUser.classId}
                  onChange={(e) => setCurrUser({...currUser, classId:e.target.value})} >
                  {
                    classList.map(classlist=>(
                      <MenuItem key={classlist.id}
                         value={classlist.id}>{classlist.classCode}</MenuItem>
                    ))
                        
                  }
              </Select>
          </FormControl>
        }
        title="Select class from the dropdown list"
        />

        <ConfirmDialogForm open={openAttendanceDialog} 
        onClose={handleCloseAttendanceDialog} 
        onSubmit={()=>attendance()}
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
                  labelId="remark-label"
                  id="remark"
                  name="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)} />
                  
          </FormControl>
        }
        title="Comments or remarks"
        />

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{dialogMsg}</Typography>}
        title="Message Dialog"
        />
    </div>
);
}


export default ClassUsers;