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
  const [url,setUrl] = useState("http://localhost:8000/accounts/class-users/"
    +authUser['user'].classId+"/");
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [remark,setRemark] = useState("");
  const [mark,setMark]  = useState(false);
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
  const handleOpenAttendanceDialog = ()=>{
    if(mark){ //checked
       setOpenAttendanceDialog(true);
    }else{ //unchecked
      //delete instances of current attendance from backend and frontend
      
    }
   
  }

  const attendance = async ()=>{
    const endpoint = "http://localhost:8000/attendance/create-attendance/"; 
    setIsLoading(true);
      try{
        const userData = {
          classId:currUser.classId,
          userId:currUser.pk,
          remark:remark,
          attendance:true
        };
          const response = await axiosInstance.post(endpoint, userData );
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user attendance captured successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
      }catch(error){
          setIsLoading(false);
          setDialogMsg(JSON.stringify(error.response.data));
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
   
  const promotes = async ()=>{
    const endpoint = "http://localhost:8000/accounts/user-promotion/"+currUser.pk+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.patch(endpoint, {classId:currUser.classId});
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user was promoted successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          updateUserFromList();
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

  const getClassCode = (user)=>{
    const classes = classList.filter(classlist=>(classlist.id === user.classId))[0];
    return classes ? classes.classCode : "None";
  }

  const getMarkedAttendance = (user)=>{
    const marked = markedAttendance.filter(att=>(att.userId === user.pk))[0];
    setMark(marked ? true : false);
    return <Checkbox
              checked={mark}
              onChange={(e)=>{
              setCurrUser(user);
              setMark(e.target.value)
              handleOpenAttendanceDialog();
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
         setMsg(`Oops! sorry can't load class List`);
         throw error; //rethrow consequent error
     }
    }

    if(authUser){
      const classId = authUser['user'].classId;
      const url = "http://localhost:8000/attendance/class-attendance/"+classId+"/";
      const queries = {search:today()};
      listAttendance(url, queries).then(allData=>{
         setMarkedAttendance(allData)
      }).catch((error)=>{
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class attendance List`);
      })
    }
    
  },[authUser])

  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="All Users">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">All Users</Typography>
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
                 <TableCell>Username</TableCell>
                 <TableCell>FirstName</TableCell>
                 <TableCell>LastName</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Role</TableCell>
                 <TableCell>Promote</TableCell>
                 <TableCell>Attendance</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  userList.map(user=>(
                    <TableRow key={user.pk}>
                      <TableCell>{user.pk}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.firstName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.lastName}
                        </span>
                      </TableCell>
                      <TableCell>
                        {
                           getClassCode(user)
                        }
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton title="promote"
                         onClick={()=>{
                             setCurrUser(user);
                             handleOpenPromoteDialog();
                          }}>
                        <PromoteIcon></PromoteIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {getMarkedAttendance(user)}
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

        <ConfirmDialogForm open={openPromoteDialog} 
        onClose={handleClosePromoteDialog} 
        onSubmit={()=>promotes()}
        formContent={
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
              <InputLabel id="class-label"/>
              <Select
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