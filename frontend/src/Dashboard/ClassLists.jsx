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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ClassList(){
   const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [classList,setClassList] = useState([]);
  const [currClass, setCurrClass] = useState({});
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

  const updateClassFromList = () => {
    setClassList(prevClass =>
      prevClass.map(classes =>
        classes.id === currClass.id ? { ...classes, 
          classCode:currClass.classCode, className:currClass.className } : classes
      )
    );
  };

  const updates = async ()=>{
      const endpoint = "http://localhost:8000/classes/update-class/"+currClass.id+"/"; 
      setIsLoading(true);
        try{
            const response = await axiosInstance.put(endpoint, 
              currClass);
            const data = response.data.results;
            if(data){
              setDialogMsg(data);
            }else{
              setDialogMsg("class information changed successfully");
            }
             handleOpenMsgBox();
            setIsLoading(false);
            updateClassFromList();
        }catch(error){
            setIsLoading(false);
            setDialogMsg(JSON.stringify(error.response.data));
            handleOpenMsgBox();
      }
        
     }
  
  const deleteClassFromList = ()=>{
   const remainingClass = classList.filter(classes => classes.id !== currClass.id);
    setClassList(remainingClass);
  }
  const deletes= async ()=>{
    const endpoint = "http://localhost:8000/classes/delete-class/"+currClass.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.delete(endpoint);
          const data = response.data.results;
          if(data){
            setDialogMsg(data);
          }
          setIsLoading(false);
          deleteClassFromList();
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
  
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Class Lists">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Class Lists</Typography>
        <Grid>
          {
            classList.map(classlist=>(
              <Grid item key={classlist.id}>
                <Card style={{marginBottom:"25px"}}>
                  <CardContent>
                     <Typography>{classlist.classCode}</Typography>
                     <Typography>{classlist.className}</Typography>
                  </CardContent>
                  <CardActions>
                     <IconButton title="update"
                         onClick={()=>{
                            setCurrClass(classlist);
                            handleOpenUpdateDialog();
                          }}>
                          <UpdateIcon></UpdateIcon>
                         </IconButton>
                          <IconButton title="delete"
                         onClick={()=>{
                            setCurrClass(classlist);
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
        formContent={<Typography>This action will delete this class</Typography>}
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
                          id="className"
                          name="className"
                          label="className"
                          value={currClass.className}
                          onChange={(e) => setCurrClass({...currClass,
                            className:e.target.value})} 
                          
                      />
                      <TextField
                          fullWidth
                          margin="normal"
                          id="classCode"
                          name="classCode"
                          label="classCode"
                          value={currClass.classCode}
                          onChange={(e) => setCurrClass({...currClass,
                            classCode:e.target.value})} 
                          
                      />
                  </FormControl>
                  
                }
                title="Update this  class information"
                />

    </div>
);
}

export default ClassList;