import TrashIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/MarkChatReadOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
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
      const endpoint = "http://localhost:8000/subjects/update-subject/"+currSubject.id+"/"; 
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
            setDialogMsg(JSON.stringify(error.response.data));
            handleOpenMsgBox();
      }
        
     }
  
  const deleteSubjectFromList = ()=>{
   const remainingSubject = subjectList.filter(subject => subject.id !== currSubject.id);
    setSubjectList(remainingSubject);
  }
  const deletes= async ()=>{
    const endpoint = "http://localhost:8000/subjects/delete-subject/"+currSubject.id+"/"; 
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

    const url = "http://localhost:8000/subjects/subject-list/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
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

    const url = "http://localhost:8000/classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
     })
  },[])
  
  
  return (
    <div style={{backgroundColor:"#FCFCF9"}}>
      <Layout title="Subject Lists">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Subject Lists</Typography>
        <Grid container spacing={4}>
          {
            subjectList.map(subjectlist=>(
              <Grid item size={{xs:12, md:6}} key={subjectlist.id}>
                <Card elevation={3} style={{marginBottom:"25px"}}>
                  <CardContent>
                     <Typography
                     >{subjectlist.subjectCode}</Typography>
                     <Typography>{subjectlist.subjectName}</Typography>
                     <Typography>{getClassCode(subjectlist)}</Typography>
                  </CardContent>
                  <CardActions>
                     <IconButton title="update"
                         onClick={()=>{
                            setCurrSubject(subjectlist);
                            handleOpenUpdateDialog();
                          }}>
                          <UpdateIcon></UpdateIcon>
                         </IconButton>
                          <IconButton title="delete"
                         onClick={()=>{
                            setCurrSubject(subjectlist);
                            handleOpenDeleteDialog();
                          }}>
                          <TrashIcon></TrashIcon>
                         </IconButton>
                  </CardActions>
                </Card>
              </Grid> 
            ))      
           }
        </Grid>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
        
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