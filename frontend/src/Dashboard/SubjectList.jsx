import TrashIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/MarkChatReadOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
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
function SubjectList(){
   const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [classList,setClassList] = useState([]);
  const [subjectList,setSubjectList] = useState([]);
  const [currSubject, setCurrSubject] = useState({});
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleOpenUpdateDialog = ()=>{
    setOpenUpdateDialog(true);
  }
  const handleCloseUpdateDialog = ()=>{
    setOpenUpdateDialog(false);
  }

  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }
  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }

  const getClassCode = (subject)=>{
    const classes = classList.filter(classlist=>(classlist.id === subject.classId))[0];
    return classes ? classes.classCode : "None";
  }

  const updateSubjectFromList = () => {
    setSubjectList(prevSubject =>
      prevSubject.map(subject =>
        subject.id === currSubject.id ? { ...subject, 
          subjectCode:currSubject.subjectCode, 
      subjectName:currSubject.subjectName, classId:currSubject.classId } : subject
      )
    );
  };

  const updates = async ()=>{
      const endpoint = "subjects/update-subject/"+currSubject.id+"/"; 
      setIsLoading(true);
        try{
            const response = await axiosInstance.put(endpoint, 
              currSubject);
            const data = response.data.results;
            if(data){
              setDialogMsg(data);
            }else{
              setDialogMsg("subject information changed successfully");
            }
             handleOpenMsgBox();
            setIsLoading(false);
            updateSubjectFromList();
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
  
  const deleteSubjectFromList = ()=>{
   const remainingSubject = subjectList.filter(subject => subject.id !== currSubject.id);
    setSubjectList(remainingSubject);
  }
  const deletes= async ()=>{
    const endpoint = "subjects/delete-subject/"+currSubject.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }
          setIsLoading(false);
          deleteSubjectFromList();
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
    //fetch all paginated subject data by recursively calling page by page
    const listSubjects = async(url)=>{
      try{
         const response = await axiosInstance.get(url)
          const data = response.data.results;
          const nextPage = response.data.next;
          if(nextPage){
            return data.concat(await listSubjects(nextPage));
          }else{
            return data;
          }
      }catch(error){
         setMsg(`Oops! sorry can't load subject List`);
         throw error; //rethrow consequent error
     }
    }

    const url = "subjects/subject-list/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
     }).catch((error)=>{
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
     })
  },[])
  

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
              Subject Lists</Typography>
        <Box component="form" sx={{backgroundColor:"#FFF", padding:"5px 10px"}}
                boxShadow={1}>
                <Paper elevation={0}>
                          <Scrollbars autoHide autoHideTimeout={1000}
                          style={{width:"100%", height:"350px"}}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>Id</TableCell>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>SubjectCode</TableCell>
                                 <TableCell style={{color:"#333",fontSize:"13px"}}>Subjectname</TableCell>
                                  <TableCell style={{color:"#333",fontSize:"13px"}}>ClassCode</TableCell>
                                 <TableCell style={{color:"#333", fontSize:"13px"}}>Update</TableCell>
                                 <TableCell style={{color:"#333", fontSize:"13px"}}>Delete</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                   subjectList.map(subjectlist=>(
                                    <TableRow key={subjectlist.id}>
                                       <TableCell style={{color:"#333",fontSize:"13px"}}>
                                       {
                                           subjectlist.id
                                        }
                                      </TableCell>
                                      <TableCell style={{color:"#333",fontSize:"13px"}}>
                                       {
                                           subjectlist.subjectCode
                                        }
                                      </TableCell>
                                      <TableCell style={{color:"#333",fontSize:"13px"}}>
                                        {subjectlist.subjectName}</TableCell>
                                       <TableCell style={{color:"#333",fontSize:"13px"}}>
                                        {getClassCode(subjectlist)}</TableCell>
                                     
                                      <TableCell>
                                         <Button style={{backgroundColor:"darkblue", 
                                                               border:"1px solid darkblue",
                                                                height:"30px", width:"15px"}}
                                                                 title="update"
                                         onClick={()=>{
                                            setCurrSubject(subjectlist);
                                            handleOpenUpdateDialog();
                                            
                                          }}>
                                          <UpdateIcon style={{color:"#FFF"}}></UpdateIcon>
                                         </Button>
                                      </TableCell>
                                      <TableCell>
                                         <Button style={{backgroundColor:"darkblue", 
                                                               border:"1px solid darkblue",
                                                                height:"30px", width:"15px"}}
                                                                 title="delete"
                                         onClick={()=>{
                                            setCurrSubject(subjectlist);
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
                          
                          </Scrollbars>
        
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
                    </Paper>
                </Box>
        </Box>
      </Layout>

        {/*Dialog window */}
        <ConfirmDialogForm open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog} 
        onSubmit={()=>deletes()}
        formContent={<Typography>This action will delete this subject</Typography>}
        title="Confirm Dialog"
        />

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{dialogMsg}</Typography>}
        title="Message Dialog"
        />

        <ConfirmDialogForm open={openUpdateDialog} 
                onClose={handleCloseUpdateDialog} 
                onSubmit={()=>updates()}
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
                          id="subjectName"
                          name="subjectName"
                          label="subjectName"
                          value={currSubject.subjectName}
                          onChange={(e) => setCurrSubject({...currSubject,
                            subjectName:e.target.value})} 
                          
                      />
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
                          id="subjectCode"
                          name="subjectCode"
                          label="subjectCode"
                          value={currSubject.subjectCode}
                          onChange={(e) => setCurrSubject({...currSubject,
                            subjectCode:e.target.value})} 
                          
                      />

                      <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "100%" }}>
                        <InputLabel id="class-label">{currSubject.classId || "class"}</InputLabel>
                        <Select
                          sx={{
                              height:"50px",
                          }}
                          fullWidth
                          margin="normal"
                          labelId="class-label"
                          id="classId"
                          name="classId"
                          value={currSubject.classId}
                          label="class"
                          onChange={(e) => setCurrSubject({...currSubject,
                            classId:e.target.value})}
                          >
                           {
                             classList.map(classlist=>(
                               <MenuItem key={classlist.id}
                               value={classlist.id}>{classlist.classCode}</MenuItem>
                             ))
                        
                           }
                        </Select>
                      </FormControl>
                  </FormControl>
                  
                }
                title="Update this  subject information"
                />

    </div>
);
}

export default SubjectList;