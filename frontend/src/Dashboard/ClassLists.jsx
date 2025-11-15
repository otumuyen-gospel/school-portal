import TrashIcon from "@mui/icons-material/DeleteOutline";
import UpdateIcon from "@mui/icons-material/MarkChatReadOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
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
      const endpoint = "classes/update-class/"+currClass.id+"/"; 
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
            if(error.response){
            setDialogMsg(JSON.stringify(error.response.data));
            }else{
              setDialogMsg(JSON.stringify(error.message));
            }
            handleOpenMsgBox();
      }
        
     }
  
  const deleteClassFromList = ()=>{
   const remainingClass = classList.filter(classes => classes.id !== currClass.id);
    setClassList(remainingClass);
  }
  const deletes= async ()=>{
    const endpoint = "classes/delete-class/"+currClass.id+"/"; 
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
              Class Lists</Typography>
        <Box component="form" sx={{backgroundColor:"#FFF", padding:"5px 10px"}}
        boxShadow={1}>
        <Paper elevation={0}>
                  <Scrollbars autoHide autoHideTimeout={1000}
                  style={{width:"100%", height:"350px"}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                         <TableCell style={{color:"#333",fontSize:"13px"}}>Id</TableCell>
                         <TableCell style={{color:"#333",fontSize:"13px"}}>ClassCode</TableCell>
                         <TableCell style={{color:"#333",fontSize:"13px"}}>Classname</TableCell>
                         <TableCell style={{color:"#333", fontSize:"13px"}}>Update</TableCell>
                         <TableCell style={{color:"#333", fontSize:"13px"}}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                           classList.map(classlist=>(
                            <TableRow key={classlist.id}>
                               <TableCell style={{color:"#333",fontSize:"13px"}}>
                               {
                                   classlist.id
                                }
                              </TableCell>
                              <TableCell style={{color:"#333",fontSize:"13px"}}>
                               {
                                   classlist.classCode
                                }
                              </TableCell>
                              <TableCell style={{color:"#333",fontSize:"13px"}}>{classlist.className}</TableCell>
                             
                              <TableCell>
                                 <Button style={{backgroundColor:"darkblue", 
                                                       border:"1px solid darkblue",
                                                        height:"30px", width:"15px"}}
                                                         title="update"
                                 onClick={()=>{
                                    setCurrClass(classlist);
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
                                    setCurrClass(classlist);
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
                          id="className"
                          name="className"
                          label="className"
                          value={currClass.className}
                          onChange={(e) => setCurrClass({...currClass,
                            className:e.target.value})} 
                          
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