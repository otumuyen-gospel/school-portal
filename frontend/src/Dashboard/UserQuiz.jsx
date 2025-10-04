import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
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
import Typography from "@mui/material/Typography";
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
  const [url] = useState("http://localhost:8000/quizzes/user-quiz/"+
     authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({search:subject?.id});
  const [subjectList,setSubjectList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [params, setParams] = useState("");
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectMsg, setSelectMsg] = useState("");
  const [subjectName, setSubjectName]  = useState('')

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
       const url = "http://localhost:8000/subjects/class-subject-list/"+
       authUser['user'].classId+"/";
    listSubjects(url).then(allData=>{
      setSubjectList(allData)
      
     }).catch((error)=>{
       setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load subject List`);
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
               setSubjectName(getSubjectCode(query.search))
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
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="My Quizzes">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Practice Quiz</Typography>
        <Container sx={{textAlign:"right", marginRight:"-25px"}} >
          <FormControl sx={{margin:"16px 0px 0px 0px", minWidth: "200px" }}>
              <InputLabel id="params">{params || "subject"}</InputLabel>
              <Select
                minWidth="200px"
                margin="normal"
                required
                id="params"
                labelId="params"
                name='params'
                value={params}
                onChange={(e) => {
                  setParams(e.target.value)
                }}
                >
                  <MenuItem value="">None</MenuItem>
                    {
                      subjectList.map(list=>(
                        <MenuItem key={list.id}
                          value={list.id}>{list.subjectCode}</MenuItem>
                        ))
                                  
                    }
               </Select>
          </FormControl>
          <Button 
               sx={{backgroundColor:"royalblue",
                color:"#FFFFFF",
                border:"1px",
                borderRadius:"0px",
                marginTop:"16px",
                '& .hover':{backgroundColor:"dodgerblue"},
                minHeight:"56px"}}
                onClick={()=>{
                   setReportList([]);
                   setQuery({...query,search:params});
                }}
               >
                <SearchIcon></SearchIcon>
               </Button>
        </Container>
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
            showQuiz ? <Paper style={{padding:"20px"}}>
              <Typography style={{color:"#888",fontSize:"20px", marginBottom:"20px"}}>
               Question #{counter} : {quizList[counter].question}
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
                              <TableCell>{report.question}</TableCell>
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
        <Container>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
        </Container>
        <Container sx={{textAlign:"right", marginTop:"40px", 
          marginRight:"-21px",marginBottom:"40px"}}>
          <Button disabled={quizList.length ? false : true }
            sx={{backgroundColor:"royalblue", color:"#FFF"}}
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