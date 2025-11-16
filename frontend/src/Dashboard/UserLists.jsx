import TrashIcon from "@mui/icons-material/DeleteOutline";
import ExcelIcon from "@mui/icons-material/ImportExportOutlined";
import UpdateIcon from "@mui/icons-material/MarkChatReadOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import PromoteIcon from "@mui/icons-material/UpgradeOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function UserLists(){
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("accounts/users-list/");
  const [query,setQuery] =useState({});
  const [classList,setClassList] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [disabled, setDisabled] = useState(false)

  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }
  const handleClosePromoteDialog = ()=>{
    setOpenPromoteDialog(false);
  }
  const handleOpenPromoteDialog = ()=>{
    setOpenPromoteDialog(true);
  }
  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
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
  
  const deletes= async ()=>{
    const endpoint = "accounts/remove-user/"+currUser.pk+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user account was deleted successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          //remove the currently deleted user from the list
          const remainingUsers = removeUserFromList(currUser, userList);
          setUserList(remainingUsers);
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

   const promotes = async ()=>{
    const endpoint = "accounts/user-promotion/"+currUser.pk+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.patch(endpoint, {classId:currUser.classId});
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }else{
            setDialogMsg("this user promoted successfully");
          }
           handleOpenMsgBox();
          setIsLoading(false);
          updateUserFromList();
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

  const Download = async()=>{
      setIsLoading(true);
      setDisabled(true);

      axiosInstance.get("accounts/export-users/", {
        responseType: 'blob' // Important for file downloads
      })
      .then(response => {
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'user_search_result.xlsx');
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
              Users' Lists</Typography>
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
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Username</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>FirstName</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>LastName</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Class</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Role</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Promote</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Update</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  userList.map(user=>(
                    <TableRow key={user.pk}>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{user.pk}</TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{user.username}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"#333",
                        fontSize:"13px", 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.firstName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"#333",
                          fontSize:"13px",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {user.lastName}
                        </span>
                      </TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>
                        {
                           getClassCode(user)
                        }
                      </TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{user.role}</TableCell>
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
                      <TableCell>
                         <Button style={{backgroundColor:"darkblue", 
                                                 height:"30px", width:"15px"}} 
                                                 title="update"
                         onClick={()=>{
                            setCurrUser(user);
                            navigate('/user-update',{state:user.pk});
                            
                          }}>
                          <UpdateIcon style={{color:"#FFF"}}></UpdateIcon>
                         </Button>
                      </TableCell>
                      <TableCell>
                         <Button style={{backgroundColor:"darkblue", 
                                                 height:"30px", width:"15px"}}
                                                  title="delete"
                         onClick={()=>{
                            setCurrUser(user);
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
            {isLoading && <CircularProgress  sx={{
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

        {/*Dialog window */}
        <ConfirmDialogForm open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
        onSubmit={()=>deletes()}
        formContent={<Typography>This action will delete this user</Typography>}
        title="Confirm Dialog"
        />

        <ConfirmDialogForm open={openPromoteDialog} 
        onClose={handleClosePromoteDialog} 
        onSubmit={()=>promotes()}
        formContent={
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
              <InputLabel id="class-label"/>
              <Select
                   sx={{ height:"50px",
                              borderRadius:"10px",}}
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

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{dialogMsg}</Typography>}
        title="Message Dialog"
        />
    </div>
);
}


export default UserLists;