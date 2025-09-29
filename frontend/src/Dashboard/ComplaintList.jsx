import TrashIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MessageIcon from "@mui/icons-material/MessageOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";
function ComplaintList(){
  const [isLoading, setIsLoading] = useState(false);
  const [complaintList, setComplaintList] = useState([]);
  const [msg, setMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/complaints/complaint-list/"
  );
  const [query,setQuery] =useState({});
  const [currComplaint, setCurrComplaint] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  

  const handleCloseDeleteDialog = ()=>{
    setOpenDeleteDialog(false);
  }
  const handleOpenDeleteDialog = ()=>{
    setOpenDeleteDialog(true);
  }

  const handleCloseReplyDialog = ()=>{
    setOpenReplyDialog(false);
  }
  const handleOpenReplyDialog = ()=>{
    setOpenReplyDialog(true);
  }

  const updateComplaintFromList = () => {
    setComplaintList(prevComplaint =>
      prevComplaint.map(complaint =>
        complaint.id === currComplaint.id ? { ...complaint, 
          replyMessage: currComplaint.replyMessage,
          replyStatus: currComplaint.replyStatus,} : complaint
      )
    );
  };
  const reply = async ()=>{
    const endpoint = "http://localhost:8000/complaints/update-complaint/"+currComplaint.id+"/"; 
    setIsLoading(true);
      try{
          const response = await axiosInstance.put(endpoint, currComplaint);
          const data = response.data.results;
          if(data){
            setDialogMsg(JSON.stringify(data));
          }else{
            setDialogMsg("this data was updated successfully");
          }
          
           handleOpenMsgBox();
          setIsLoading(false);
          updateComplaintFromList();

      }catch(error){
          setIsLoading(false);
          setDialogMsg(JSON.stringify(error.response.data));
          handleOpenMsgBox();
    }
      
   }

  const removeComplaintFromList = (theComplaint, data)=>{
   const remainingComplaint = data.filter(complaint => complaint.id !== theComplaint.id);
    return remainingComplaint;
  }
   
  const deletes = async ()=>{
    const endpoint = "http://localhost:8000/complaints/delete-complaint/"+currComplaint.id+"/"; 
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
          setComplaintList(removeComplaintFromList(currComplaint,complaintList));

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
      const complaint = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.results;
           setNextPage(response.data.next);
           setPrevPage(response.data.previous);
           if(data){
           setComplaintList(data);
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setMsg(`Oops! sorry can't load complaint List`);
          }
      }

      complaint(url, query);
  },[url, query])
  
  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Tickets">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Tickets</Typography>
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
        <Grid container spacing={4} marginBottom={5}>
          {
            complaintList.map(complaint=>(
              <Grid item size={{xs:12, sm:12}} key={complaint.id}>
                  <Box>
                    <Box padding="15px 5px">
                      <Grid container spacing={4}>
                        <Grid item size={{xs:6,}}>
                          <Typography color="royalblue" fontWeight="bolder"  
                            textAlign="left" fontSize={15}>
                             {complaint.title}
                         </Typography>
                         <Typography color="darkblue" fontWeight="bolder"  
                          fontSize={12} textAlign="left">
                           {complaint.date}
                          </Typography>
                        </Grid>
                        <Grid item size={{xs:6,}}>
                          <Box textAlign="right">
                             <Checkbox checked={complaint.replyStatus}/>
                          </Box>
                      </Grid>
                      </Grid>
                    </Box>
                    <Box padding="10px 5px">
                        <Accordion width="100%">
                          <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          >
                            <Typography component="span">
                              {complaint.complaint.substring(0, 20)}...
                              </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                              {complaint.complaint}
                          </AccordionDetails>
                          <AccordionActions>
                             <IconButton title="reply"
                                 onClick={()=>{
                                    setCurrComplaint(complaint);
                                    handleOpenReplyDialog();
                                 }}>
                                <MessageIcon sx={{color:"#888", 
                                  width:"16px", height:"16px"}}></MessageIcon>
                             </IconButton>
                            <IconButton title="delete"
                                onClick={()=>{
                                   setCurrComplaint(complaint);
                                   handleOpenDeleteDialog();  
                                 }}>
                                 <TrashIcon sx={{color:"#888", 
                                  width:"16px", height:"16px"}}></TrashIcon>
                             </IconButton>
                          </AccordionActions>
                        </Accordion>
                    </Box>
                  </Box>
              </Grid>
            ))
          }
        </Grid>
        {/*}
        <Paper>
           <Scrollbars autoHide autoHideTimeout={1000}
                            style={{width:"100%", height:"200px"}}>

                  
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell>Id</TableCell>
                 <TableCell>Title</TableCell>
                 <TableCell>complaint</TableCell>
                 <TableCell>Date</TableCell>
                 <TableCell>Reply status</TableCell>
                 <TableCell>Reply</TableCell>
                 <TableCell>Delete</TableCell>
                 
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  complaintList.map(complaint=>(
                    <TableRow key={complaint.id}>
                      <TableCell>{complaint.id}</TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {complaint.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {complaint.complaint}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ display: 'inline-block', 
                          whiteSpace:"normal", wordBreak:"break-word" }}>
                          {complaint.date}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={complaint.replyStatus}/>
                      </TableCell>
                      <TableCell>
                        <IconButton title="reply"
                         onClick={()=>{
                             setCurrComplaint(complaint);
                             handleOpenReplyDialog();
                          }}>
                        <MessageIcon></MessageIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                         <IconButton title="delete"
                         onClick={()=>{
                             setCurrComplaint(complaint);
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
           </Scrollbars>
        </Paper>
        {*/}
         <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
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


         <ConfirmDialogForm open={openReplyDialog} 
        onClose={handleCloseReplyDialog} 
        onSubmit={()=>reply()}
        formContent={
          <TextField 
           fullWidth
           multiline
           label="message"
           id="message"
           rows={4}
           value={currComplaint.replyMessage}
           onChange={(e)=>setCurrComplaint({...currComplaint, replyMessage: e.target.value,
            replyStatus :true
           })}
          />
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


export default ComplaintList;