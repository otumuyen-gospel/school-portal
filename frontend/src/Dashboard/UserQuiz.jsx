import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function UserQuiz(){
  const [authUser] = useState(JSON.parse(localStorage.getItem('auth')));
   const [isLoading, setIsLoading] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [msg, setMsg] = useState("");
  const [url,setUrl] = useState("http://localhost:8000/quizzes/user-quiz/"+
     authUser['user'].classId+"/"
  );
  const [query,setQuery] =useState({});
  const [subjectList,setSubjectList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [params, setParams] = useState("");
  const [nextPage,setNextPage] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

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

  const getSubjectCode = (mark)=>{
    const subjects = subjectList.filter(subjectlist=>(subjectlist.id === mark.id))[0];
    return subjects ? subjects.subjectCode : "None";
  }
 
  useEffect(()=>{
     //fetch all paginated students scores by recursively calling page by page
      const quizzes = async(endpoint, queries)=>{
        setIsLoading(true);
        try{
           const response = await axiosInstance.get(endpoint,{params:queries});
           const data = response.data.results;
           setNextPage(response.data.next);
           if(data){
            setQuizList(data);  
            setMsg("");
           }
           setIsLoading(false);
          }catch(error){
           setIsLoading(false);
           setQuizList([]);
           setMsg(`Oops! sorry can't load quiz List`);
          }
      }
      quizzes(url, query);
  },[url, query])

  const saveReport = (quiz)=>{
    const data = {
     'question':quiz.question,
      'answer':quiz.answer,
      'option':selectedOption,
      'id':quiz.id,
    };
   deleteReport(data) // delete report if it already exist
   setReportList(data); //add the new data
  }
  const deleteReport = (data)=>{
     const reports = reportList.filter(report=>(report.id === data.id));
    setReportList(reports);
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
        <Typography component="h1" variant="h6">My Quizzes</Typography>
        <Container sx={{textAlign:"right"}} >
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
                   setQuery({...query,search:params});
                }}
               >
                <SearchIcon></SearchIcon>
               </Button>
        </Container>
        <Container>
          {
          quizList.map((quiz)=>(
            <Paper>
            <FormControl>
              <Typography variant="h3"  style={{color:"royalblue", marginBottom:"10px"}}>
                {getSubjectCode(quiz)}
                </Typography>
              <FormLabel id={quiz.id}>
                {quiz.question}
              </FormLabel>
              <RadioGroup
                aria-labelledby={quiz.id}
                name={quiz.question}
                value={selectedOption}
                onChange={(e)=>{
                    setSelectedOption(e.target.value)
                    saveReport(quiz);
                }}
              />
              <FormControlLabel 
              value={quiz.option1} 
              control={<Radio/>} 
              label={quiz.option1}/>

               <FormControlLabel 
              value={quiz.option2} 
              control={<Radio/>} 
              label={quiz.option2}/>

               <FormControlLabel 
              value={quiz.option3} 
              control={<Radio/>} 
              label={quiz.option3}/>

               <FormControlLabel 
              value={quiz.answer} 
              control={<Radio/>} 
              label={quiz.answer}/>
            </FormControl> </Paper>
            
          ))
        }
        </Container>
        <Container>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
        </Container>
        <Container sx={{textAlign:"right", margin:"40px auto"}}>
          <Button 
            sx={{backgroundColor:"royalblue", color:"#FFF"}}
          onClick={()=>{
             if(nextPage){
                setUrl(nextPage)
              }
          }}>
            {nextPage?"Next":"Submit"} 
          </Button>
        </Container>
        </Box>
      </Layout>  
    </div>
);
}


export default UserQuiz;