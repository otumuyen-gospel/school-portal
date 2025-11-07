import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BellIcon from "@mui/icons-material/NotificationsRounded";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function UserSchedule(){
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [msg, setMsg] = useState("");
  const [url,setUrl] = useState("schedule/schedule-list/");
  const [query,setQuery] =useState({});
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [prevPage,setPrevPage] = useState(null);

  const convertToHtml = (content)=>{
        const unsafeHtml = draftToHtml(JSON.parse(content));
        return DOMPurify.sanitize(unsafeHtml);
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
              My Schedule</Typography>
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
            scheduleList.map(schedule=>(
              <Grid item size={{xs:12, sm:12}} key={schedule.id}>
                  <Box boxShadow={0} style={{backgroundColor:"#FFF"}}>
                    <Box padding="15px 5px">
                      <Grid container spacing={4}>
                        <Grid item size={{xs:6,}}>
                          <Typography color="darkblue" fontWeight="bolder"  
                            textAlign="left" fontSize={15}>
                             {schedule.title}
                         </Typography>
                         <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <Typography color="darkblue" fontWeight="bolder"  
                          fontSize={12} textAlign="left">
                           {dayjs(schedule.startDateTime).format("YYYY-MM-DD HH:mm.ss")} - 
                           {dayjs(schedule.sendDateTime).format("YYYY-MM-DD HH:mm.ss")}
                          </Typography>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item size={{xs:6,}}>
                          <Box textAlign="right">
                            <IconButton title="Schedules">
                               <BellIcon sx={{color:"#888",
                                    width:"16px", height:"16px"
                                   }}></BellIcon>
                            </IconButton>
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
                               ={{__html:convertToHtml(schedule.detail).substring(0,20)
                               }}/> ...
                              </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                               <div dangerouslySetInnerHTML
                               ={{__html:convertToHtml(schedule.detail)}}/>
                          </AccordionDetails>
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
    </div>
);
}


export default UserSchedule;