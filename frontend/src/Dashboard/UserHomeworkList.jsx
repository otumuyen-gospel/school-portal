import TrashIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import PromoteIcon from "@mui/icons-material/UpgradeOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function UserHomeworkList(){
  const[authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("homework/user-homework-list/"+
    authUser['user'].pk+"/"
  );
  const [query,setQuery] =useState({});
  const [currHomework, setCurrHomework] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [userClass,setUserClass] = useState([]);
  
   const navigate = useNavigate();

  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }


  const removeHomeworkFromList = (theHomework, data)=>{
   const remainingHomework = data.filter(homework => homework.id !== theHomework.id);
    return remainingHomework;
  }
   
  const deletes = async ()=>{
    const endpoint = "homework/delete-homework/"+currHomework.id+"/"; 
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
          setHomeworkList(removeHomeworkFromList(currHomework,homeworkList));

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
      const listClasses = async(url)=>{
        try{
           const response = await axiosInstance.get(url);
            const data = response.data;
              if(data){
               setUserClass(data);
            }
        }catch(error){
           setMsg(`Oops! sorry can't load user class`);
       }
      }
  
      if(authUser){
           const url = "classes/user-class/"+authUser['user'].classId+"/";
           listClasses(url);
      }
      
    },[authUser])

  useEffect(()=>{
      const complaint = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.results;
           setNextPage(response.data.next);
           setPrevPage(response.data.previous);
           if(data){
           setHomeworkList(data);
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(`Oops! sorry can't load homework List`);
          }
      }

      complaint(url, query);
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
              Homeworks</Typography>
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
                 <TableCell style={{color:"darkblue"}}>Class</TableCell>
                 <TableCell style={{color:"darkblue"}}>Title</TableCell>
                 <TableCell style={{color:"darkblue"}}>Link</TableCell>
                 <TableCell style={{color:"darkblue"}}>Date</TableCell>
                 <TableCell style={{color:"darkblue"}}>Update</TableCell>
                 <TableCell style={{color:"darkblue"}}>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  homeworkList.map(homework=>(
                    <TableRow key={homework.id}>
                      <TableCell style={{color:"darkblue"}}>{homework.id}</TableCell>
                      <TableCell style={{color:"darkblue"}}>{userClass.className}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"darkblue",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {homework.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a href={homework.link}  style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word", color:"darkblue" }}>
                          {homework.link}
                        </a>
                      </TableCell>
                      <TableCell>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <span style={{ display: 'inline-block', color:"darkblue",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {dayjs(homework.submission).format("YYYY-MM-DD HH:mm.ss")}
                        </span>
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell>
                        <Button style={{backgroundColor:"darkblue", 
                                                height:"30px", width:"15px"}}
                                                 title="update"
                         onClick={()=>{
                             setCurrHomework(homework);
                             navigate('/homework-update',{state:homework});
                           
                          }}>
                        <PromoteIcon style={{color:"#FFF"}}></PromoteIcon>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button style={{backgroundColor:"darkblue", 
                                                height:"30px", width:"15px"}}
                                                 title="delete"
                         onClick={()=>{
                             setCurrHomework(homework);
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


export default UserHomeworkList;