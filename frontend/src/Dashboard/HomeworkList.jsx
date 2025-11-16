import TrashIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/SearchOutlined";
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
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function HomeworkList(){
  const [isLoading, setIsLoading] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("homework/homework-list/"
  );
  const [query,setQuery] =useState({});
  const [currHomework, setCurrHomework] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  const [classList,setClassList] = useState([]);
  const [studentList,setStudentList] = useState([]);
  

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
  
    const getClassCode = (homework)=>{
      const classes = classList.filter(classlist=>(classlist.id === homework.classId))[0];
      return classes ? classes.classCode : "None";
    }
  
  
    useEffect(()=>{
      //fetch all paginated class data by recursively calling page by page
      const listStudents = async(url, queries)=>{
        try{
           const response = await axiosInstance.get(url, queries)
            const data = response.data.results;
            const nextPage = response.data.next;
            if(nextPage){
              return data.concat(await listStudents(nextPage));
            }else{
              return data;
            }
        }catch(error){
           setMsg(`Oops! sorry can't load student List`);
           throw error; //rethrow consequent error
       }
      }
  
      const url = "accounts/users-list/";
      const queries = {role:"student"};
      listStudents(url, queries).then(allData=>{
        setStudentList(allData)
       }).catch((error)=>{
        if(error.response){
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load students List`);
        }else{
          setMsg(JSON.stringify(error.message));
        }
       })
    },[])
  
    const getStudentName = (homework)=>{
      const user = studentList.filter(user=>(user.pk === homework.userId))[0];
      return user ? (user.firstName+" "+user.lastName): "None";
    }

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
              Homeworks</Typography>
            <Box component="form" sx={{backgroundColor:"#FFF",padding:"5px 10px"}}
            boxShadow={1}>
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
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Id</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Student</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Class</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Title</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Link</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Date</TableCell>
                 <TableCell style={{color:"#333", fontSize:"13px"}}>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  homeworkList.map(homework=>(
                    <TableRow key={homework.id}>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{homework.id}</TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{getStudentName(homework)}</TableCell>
                      <TableCell style={{color:"#333", fontSize:"13px"}}>{getClassCode(homework)}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', color:"#333",
                         fontSize:"13px",
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {homework.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a href={homework.link}  style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word",color:"", fontSize:"13px" }}>
                          {homework.link}
                        </a>
                      </TableCell>
                      <TableCell>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <span style={{ display: 'inline-block',color:"#333",
                                                 fontSize:"13px", 
                                                  whiteSpace:"normal", wordBreak:"break-word" }}>
                                                  {dayjs(homework.submission).format("YYYY-MM-DD HH:mm.ss")}
                                                </span>
                                                </LocalizationProvider>
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


export default HomeworkList;