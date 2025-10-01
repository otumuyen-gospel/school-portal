import ComplainIcon from "@mui/icons-material/CommentOutlined";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function ClassComplaintList(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [isLoading, setIsLoading] = useState(false);
  const [complaintList, setComplaintList] = useState([]);
  const [msg, setMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/complaints/class-complaint-list/"+
    authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);
  

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
      <Layout title="Class Tickets">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Class Tickets</Typography>
        <Container sx={{textAlign:"right", marginRight:"-25px"}} >
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
                             <IconButton>
                              <ComplainIcon sx={{color:"#888", 
                                  width:"16px", height:"16px"}}></ComplainIcon>
                             </IconButton>
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
                          
                        </Accordion>
                    </Box>
                  </Box>
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
        <Container sx={{textAlign:"right", marginTop:"40px",
          marginBottom:"40px", marginRight:"-21px"}}>
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
    </div>
);
}


export default ClassComplaintList;