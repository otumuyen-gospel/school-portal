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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ClassHomeworkList(){
  const[authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/homework/class-homework-list/"+
    authUser['user'].classId+"/"
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
    const endpoint = "http://localhost:8000/homework/delete-homework/"+currHomework.id+"/"; 
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
  
      const url = "http://localhost:8000/accounts/class-users/"+authUser['user'].classId+"/";
      const queries = {role:"student"};
      listStudents(url, queries).then(allData=>{
        setStudentList(allData)
       }).catch((error)=>{
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load students List`);
       })
    },[authUser])
  
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
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Class Homeworks">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Class Homeworks</Typography>
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
                 <TableCell>Student</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Title</TableCell>
                 <TableCell>Link</TableCell>
                 <TableCell>Date</TableCell>
                 <TableCell>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  homeworkList.map(homework=>(
                    <TableRow key={homework.id}>
                      <TableCell>{homework.id}</TableCell>
                      <TableCell>{getStudentName(homework)}</TableCell>
                      <TableCell>{getClassCode(homework)}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {homework.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a href={homework.link}  style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {homework.link}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {homework.submission}
                        </span>
                      </TableCell>
                      <TableCell>
                         <IconButton title="delete"
                         onClick={()=>{
                             setCurrHomework(homework);
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


export default ClassHomeworkList;