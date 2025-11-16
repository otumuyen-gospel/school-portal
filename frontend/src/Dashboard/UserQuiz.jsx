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
import Typography from "@mui/material/Typography";
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";

function UserQuiz(){
  const subject = useLocation().state;
  const [counter, setCounter] = useState(0);
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [isLoading, setIsLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [msg, setMsg] = useState("");
  const [url] = useState("quizzes/user-quiz/"+
     authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({search:subject?.id});
  const [subjectList,setSubjectList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [params, setParams] = useState("");
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectMsg, setSelectMsg] = useState("");
  const [subjectName, setSubjectName]  = useState('')

  const autoDeselectRadioInput = ()=>{
    const inputs = document.getElementsByName("quiz");
    for(var i = 0; i < inputs.length; i++){
      inputs[i].checked = false;
    }
  }

const convertToHtml = (content)=>{
        const unsafeHtml = draftToHtml(JSON.parse(content));
        return DOMPurify.sanitize(unsafeHtml);
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
    
    if(authUser){
       const url = "subjects/class-subject-list/"+
       authUser['user'].classId+"/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
      
     }).catch((error)=>{
      if(error.response){
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
      }else{
        setMsg(JSON.stringify(error.message));
      }
     })
    }
   
  },[authUser])
 
  useEffect(()=>{
      if(subjectList.length){
        const getSubjectCode = (subjectId)=>{
             const subjects = subjectList.filter(subjectlist=>(subjectlist.id === subjectId))[0];
             return subjects ? subjects.subjectCode : "None";
        }
        //fetch all paginated quiz by recursively calling page by page
        const quizzes = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries});
           const data = response.data.results;
           const nextPage = response.data.next;
            if(nextPage){
              return data.concat(await quizzes(nextPage,query));
            }else{
              return data;
            }
           
          }catch(error){
            throw error; //rethrow consequent error
          }
      }
      if(query.search){ 
        quizzes(url,query).then(allData=>{
          if(allData){
            setQuizList(allData)
            if(allData.length){
               setShowQuiz(true);
               setSelectMsg("")
               setSubjectName(getSubjectCode(parseInt(query.search)))
               setMsg("");
            }else{
             setShowQuiz(false)
             setSubjectName("");
             setSelectMsg("no quiz for this course "+getSubjectCode(query.search))

            }
           
          }
          setIsLoading(false);
        }).catch((error)=>{
            setIsLoading(false);
           setMsg(`Oops! sorry can't load quiz List`);
           setSelectMsg("");
           setSubjectName("")
           setShowQuiz(false);
        })
      }else{
        setSelectMsg("you have not selected any quiz yet");
      }
    }
  },[url, query, subjectList])

  const saveReport = (quiz, option, counter)=>{
    const data = {
      'id':counter,
     'question':quiz.question,
     'correctAnswer':quiz.answer,
     'selectedOption':option,
     'status': (quiz.answer === option) ? 'passed' : 'failed',
    };
    //filter old data away and return new list excluding old data
    const list = reportList.filter((report) => (report.question !== data.question))
    if(list){
      // now push updated data
      list.push(data)  
      setReportList(list)
    }else{
       reportList.push(data)  // add new data
    }
  }
  
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
             Practice Quiz</Typography>
       <Box sx={{backgroundColor:"#FFF", padding:"5px 10px"}} boxShadow={1}>
            <div style={{marginBottom:"20px",float:"right",
               marginTop:"20px", marginRight:"auto"}}>
          <select required placeholder="Search" 
              style={{padding:"10px",border:"1px solid #CCC",
                outline:"none", color:"#999", backgroundColor:"#FFF"
              }} value={params}
                   onChange={(e) =>setParams(e.target.value)}
                   name="params" id="params">
            
             <option value="None">None</option>
                    {
                      subjectList.map(list=>(
                        <option key={list.id}
                          value={list.id}>{list.subjectCode}</option>
                        ))
                                  
                    }
          </select>
          <IconButton
                onClick={()=>{
                   setReportList([]);
                   setQuery({...query,search:params});
                }}
               >
                <SearchIcon style={{color:"#666", width:"30px", height:"30px"}}/>
               </IconButton>
        </div>
        <Container>
          <div>
             <Typography variant="h3"  
             style={{color:"royalblue", marginTop:"50px"}}>
             {subjectName}</Typography>
          </div>
          <div>
            <Typography style={{color:"#888", marginTop:"50px"}}>
            {msg}</Typography>
          </div>
          <div>
             <Typography style={{color:"#888",marginTop:"50px"}}>
               {
               selectMsg
               }
             </Typography>
          </div>
        </Container>
        <Container>
          {
            showQuiz ? <Paper style={{padding:"20px"}} elevation={0}>
              <Typography style={{color:"#888",fontSize:"20px", marginBottom:"20px"}}>
               Question #{counter} :  <span dangerouslySetInnerHTML
                               ={{__html:convertToHtml(quizList[counter].question)}}/>
              </Typography>
              <Box style={{marginBottom:"20px"}}>
                <input name="quiz" 
                type="radio"
                style={{display:"inline", marginRight:"10px"}}
                value={quizList[counter].option1}
                 onChange={(e)=>{
                    saveReport(quizList[counter],quizList[counter].option1,counter);
                }}/>
                 <Typography style={{display:"inline"}}>
                  {quizList[counter].option1}
                </Typography>
              </Box>

              <Box style={{marginBottom:"20px"}}>
                <input name="quiz" 
                 type="radio"
                style={{display:"inline",  marginRight:"10px"}}
                value={quizList[counter].option2}
                 onChange={(e)=>{
                   saveReport(quizList[counter],quizList[counter].option2,counter);
                }}/>
                <Typography style={{display:"inline"}}>
                  {quizList[counter].option2}
                </Typography>
              </Box>

              <Box style={{marginBottom:"20px"}}>
                <input name="quiz" 
                 type="radio"
                style={{display:"inline", marginRight:"10px"}}
                value={quizList[counter].option3}
                 onChange={(e)=>{
                    saveReport(quizList[counter],quizList[counter].option3,counter);
                }}/>
                <Typography style={{display:"inline"}}>
                  {quizList[counter].option3}
                </Typography>
              </Box>
               </Paper>
            : <Scrollbars autoHide autoHideTimeout={1000}
                style={{width:"100%", height:"250px"}}>
                <Table>
                    <TableHead>
                      <TableRow>
                         { reportList.length ? Object.keys(reportList[0]).map((key)=>(
                          <TableCell>{key}</TableCell>
                         )): <TableCell/>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                          reportList.map((report)=>( 
                            <TableRow key={report.id}>
                              <TableCell>{report.id}</TableCell>
                              <TableCell><span dangerouslySetInnerHTML
                               ={{__html:convertToHtml(report.question).substring(0,20)}}/>...
                               </TableCell>
                              <TableCell>{report.correctAnswer}</TableCell>
                              <TableCell>{report.selectedOption}</TableCell>
                              <TableCell>{report.status}</TableCell>
                            </TableRow>
                          ))
                      }
                    </TableBody>
                </Table>
            </Scrollbars>
        }
        </Container>
        </Box>
        <Container>
          <div className="loaderContainer">
            {isLoading && <CircularProgress  x={{
                                    '& .MuiCircularProgress-circle': {
                                     stroke: 'darkblue', 
                                    },
                                   '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
                                    stroke: 'darkblue', 
                                   },
                                }}/>}
          </div>
        </Container>
        <Container sx={{textAlign:"right", marginTop:"20px",
                              marginBottom:"20px", marginRight:"-21px"}}>
          <Button disabled={quizList.length ? false : true }
            sx={{backgroundColor:"#FFF", color:"darkblue",fontSize:"12px",
                                border:"1px solid darkblue", height:"30px", width:"15px"}}
          onClick={()=>{
             let c = counter;
             if(c >= quizList.length - 1){
                setShowQuiz(false)
                //reset all variable
                setCounter(0)
                setQuizList([]) 
                setSubjectName("")
            }else{
              c = counter + 1;  //increment counter
              setCounter(c);
              autoDeselectRadioInput();

            }
          }}>
            {(counter >= quizList.length - 1)?"Submit":"Next"} 
          </Button>
        </Container>
        </Box>
      </Layout>  
    </div>
);
}


export default UserQuiz;