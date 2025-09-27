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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ScheduleList(){
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/schedule/schedule-list/");
  const [query,setQuery] =useState({});
  const [currSchedule, setCurrSchedule] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
   const navigate = useNavigate();

  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }

  const removeScheduleFromList = (theSchedule, data)=>{
   const remainingSchedule = data.filter(schedule => schedule.id !== theSchedule.id);
    return remainingSchedule;
  }
   
  const deletes = async ()=>{
    const endpoint = "http://localhost:8000/schedule/delete-schedule/"+currSchedule.id+"/"; 
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
          setScheduleList(removeScheduleFromList(currSchedule,scheduleList));

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
      const schedule = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.results;
           setNextPage(response.data.next);
           setPrevPage(response.data.previous);
           if(data){
           setScheduleList(data);
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(`Oops! sorry can't load attendance List`);
          }
      }

      schedule(url, query);
  },[url, query])
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="All Schedule">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">All Schedule</Typography>
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
                 <TableCell>Title</TableCell>
                 <TableCell>Details</TableCell>
                 <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                 <TableCell>Update</TableCell>
                 <TableCell>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  scheduleList.map(schedule=>(
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {schedule.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {schedule.detail}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {schedule.startDateTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {schedule.endDateTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <IconButton title="update"
                         onClick={()=>{
                             setCurrSchedule(schedule);
                             navigate('/schedule-update',{state:schedule});
                           
                          }}>
                        <PromoteIcon></PromoteIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                         <IconButton title="delete"
                         onClick={()=>{
                             setCurrSchedule(schedule);
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


export default ScheduleList;