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
import Typography from "@mui/material/Typography";
import DOMPurify from 'dompurify';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
  const [url,setUrl] = useState("complaints/complaint-list/"
  );
  const [query,setQuery] =useState({});
  const [currComplaint, setCurrComplaint] = useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  
  const convertToHtml = (content)=>{
      const unsafeHtml = draftToHtml(JSON.parse(content));
      return DOMPurify.sanitize(unsafeHtml);
  }

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newEditorState) => {
          setEditorState(newEditorState);
      };
    const convertForDatabase = ()=>{
        return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      }

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
    const endpoint = "complaints/update-complaint/"+currComplaint.id+"/"; 
    setIsLoading(true);
      try{
          const dbData = convertForDatabase();
          setCurrComplaint({...currComplaint, replyMessage: dbData,
            replyStatus :true
           })
           const obj = currComplaint;
           obj.replyMessage = dbData;
           obj.replyStatus = true
           setCurrComplaint(obj)
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
    const endpoint = "complaints/delete-complaint/"+currComplaint.id+"/"; 
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
              Complaint Lists</Typography>
        <div style={{marginBottom:"20px",textAlign:"right",
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
        <Box minHeight={70}>
        <Grid container spacing={4} marginBottom={5}>
          {
            complaintList.map(complaint=>(
              <Grid item size={{xs:12,}} key={complaint.id}>
                  <Box  boxShadow={0} style={{backgroundColor:"#FFF"}}>
                    <Box padding="15px 5px">
                      <Grid container spacing={4}>
                        <Grid item size={{xs:6,}}>
                          <Typography color="darkblue" fontWeight="bolder"  
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
                    <Box>
                        <Accordion width="100%">
                          <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          >
                            <Typography component="span">
                              <div dangerouslySetInnerHTML
                               ={{__html:convertToHtml(complaint.complaint).substring(0,20)+ "..."
                               }}/>
                              </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                             <div dangerouslySetInnerHTML
                               ={{__html:convertToHtml(complaint.complaint)
                               }}/>
                          </AccordionDetails>
                          <AccordionActions>
                             <IconButton title="reply"
                                 onClick={()=>{
                                    if(complaint.replyMessage){
                                    const contentState = convertFromRaw(JSON.parse(complaint.replyMessage));
                                    setEditorState(EditorState.createWithContent(contentState));}
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
        </Box>
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
          <Editor
              minHeight="150px"
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
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