import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
function Dashboard(){
   const [studentCount, setStudentCount] = useState("");
   const [parentCount, setParentCount] = useState("");
   const [teacherCount, setTeacherCount] = useState("");
   const [adminCount, setAdminCount] = useState("");
   const [msg, setMsg] = useState('');
   const [isLoading, setIsLoading] = useState(false);
  const [classList,setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [year] = useState(new Date().getFullYear());
  const [setting1, setSetting1] = useState({});
  const [setting2, setSetting2] = useState({});
  const [setting3, setSetting3] = useState({});
  const [setting4, setSetting4] = useState({});
    
  useEffect(()=>{
    //fetch all paginated class data by recursively calling page by page
     setIsLoading(true);
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
         setMsg("an error has occured");
         throw error; //rethrow consequent error
     }
    }

    const url = "http://localhost:8000/classes/class-list/";
    listClasses(url).then(allData=>{
      setClassList(allData)
      setIsLoading(false);
     }).catch((error)=>{
       setMsg("an error has occured");
     })
  },[])
  
  useEffect(()=>{
    if(classList.length){
      setIsLoading(true);
      const listStudent = async()=>{
        try{
          const data = [];
         for(const classes of classList){
            const dataCount = [];
            for(let i = 0; i < 4; i++){
              const url = "http://localhost:8000/accounts/class-users/"+classes.id+"/";
              const param ={search:(year-i),role:"student"};;
              const response = await axiosInstance.get(url,{params:param});
              dataCount.push(response.data.count)
              
            }
            const classData = {
                data:dataCount,
                label: classes.classCode,
                id:(classes.id),
              };
              data.push(classData);
            
         }
         return data;
        }catch(error){
          setMsg("an error has occured");
          setIsLoading(false);
          throw error; //rethrow error
        }
      }

       listStudent().then(allData=>{
       setStudentList(allData);
       setIsLoading(false);
     }).catch((error)=>{
       setMsg("an error has occured");
     })
    }
  },[classList,year])

   /* fetch student count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
         
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setStudentCount(data);  
           }
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");

          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"student"};
      users(url, query);
  },[])

  /* fetch teacher count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setTeacherCount(data);  
           }
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"teacher"};
      users(url, query);
  },[])


  /* fetch admin count*/
   useEffect(()=>{
     setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setAdminCount(data);  
           }
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"admin"};
      users(url, query);
  },[])

  /* fetch parent count*/
   useEffect(()=>{
       setIsLoading(true);
      const users = async(endpoint, queries)=>{
        try{
           const response = await axiosInstance.get(endpoint,{params:queries})
           const data = response.data.count;
           if(data){
            setParentCount(data);  
           }
          }catch(error){
            setIsLoading(false);
            setMsg("an error has occured");
          }
      }
      const url = "http://localhost:8000/accounts/users-list/";
      const query = {role:"parent"};
      users(url, query);
  },[])
  
  useEffect(()=>{
    if(studentCount && parentCount && adminCount && teacherCount){
      const percentageCount = (data)=>{
        return ((data / (studentCount + parentCount + 
       teacherCount + adminCount)) * 100).toFixed(1);
      }
      setSetting1({width:150, height:150, value:percentageCount(studentCount)});
      setSetting2({width:150, height:150, value:percentageCount(parentCount)});
      setSetting3({width:150, height:150, value:percentageCount(teacherCount)});
      setSetting4({width:150, height:150, value:percentageCount(adminCount)});
    }
    
   
  },[studentCount, adminCount, teacherCount, parentCount])

  return (
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="Dashboard">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Dashboard</Typography>
        <Grid container spacing={4}>
          <Grid item size={{xs:12, md:3}}>
            <Card elevation={1} >
              <Typography sx={{textAlign:"left", marginLeft:"20px"}}>Students</Typography>
              <CardContent>
                <Gauge {...setting1}
                  sx={(theme)=>({
                    //style the value arc
                    [`& .${gaugeClasses.valueArc}`]:{
                      fill:'royalblue',
                    },
                     //style the reference arc(full range arc)
                    [`& .${gaugeClasses.referenceArc}`]:{
                      fill:theme.palette.grey[300],
                    },
                     //style the value text
                    [`& .${gaugeClasses.valueText}`]:{
                      fill:theme.palette.text.primary,
                      fontSize:40,
                    },
                  })}
                          
                  />
              </CardContent>
               <Typography sx={{textAlign:"center"}}>Total : {studentCount}</Typography>
            </Card>
          </Grid>

          <Grid item size={{xs:12, md:3}}>
            <Card elevation={1}>
              <Typography sx={{textAlign:"left", marginLeft:"20px"}}>Parents</Typography>
              <CardContent>
                <Gauge {...setting2}
                  sx={(theme)=>({
                    //style the value arc
                    [`& .${gaugeClasses.valueArc}`]:{
                      fill:'royalblue',
                    },
                     //style the reference arc(full range arc)
                    [`& .${gaugeClasses.referenceArc}`]:{
                      fill:theme.palette.grey[300],
                    },
                     //style the value text
                    [`& .${gaugeClasses.valueText}`]:{
                      fill:theme.palette.text.primary,
                      fontSize:40,
                    },
                  })}
                          
                  />
              </CardContent>
              <Typography sx={{textAlign:"center"}}>Total : {parentCount}</Typography>
            </Card>
          </Grid>

          <Grid item size={{xs:12, md:3}}>
            <Card elevation={1}>
              <Typography sx={{textAlign:"left", marginLeft:"20px"}}>Teachers</Typography>
              <CardContent>
                <Typography>
                  <Gauge {...setting3}
                  sx={(theme)=>({
                    //style the value arc
                    [`& .${gaugeClasses.valueArc}`]:{
                      fill:'royalblue',
                    },
                     //style the reference arc(full range arc)
                    [`& .${gaugeClasses.referenceArc}`]:{
                      fill:theme.palette.grey[300],
                    },
                     //style the value text
                    [`& .${gaugeClasses.valueText}`]:{
                      fill:theme.palette.text.primary,
                      fontSize:40,
                    },
                  })}
                          
                  />
                </Typography>
              </CardContent> 
              <Typography sx={{textAlign:"center"}}>Total : {teacherCount}</Typography>
            </Card>
          </Grid>

          <Grid item size={{xs:12, md:3}}>
            <Card elevation={1}>
              <Typography sx={{textAlign:"left", marginLeft:"20px"}}>Administrators</Typography>
              <CardContent>
                <Typography>
                  <Gauge {...setting4}
                  sx={(theme)=>({
                    //style the value arc
                    [`& .${gaugeClasses.valueArc}`]:{
                      fill:'royalblue',
                    },
                     //style the reference arc(full range arc)
                    [`& .${gaugeClasses.referenceArc}`]:{
                      fill:theme.palette.grey[300],
                    },
                     //style the value text
                    [`& .${gaugeClasses.valueText}`]:{
                      fill:theme.palette.text.primary,
                      fontSize:40,
                    },
                  })}
                          
                  />
                </Typography>
              </CardContent>
              <Typography sx={{textAlign:"center"}}>Total : {adminCount}</Typography>
            </Card>
          </Grid>

          <Grid item size={{xs:12, md:12}}>
            <Card elevation={1}>
              <CardContent>
                <BarChart 
                 series={studentList}
                 xAxis={[
                  {data:[(year), (year - 1), (year - 2), (year - 3)]}
                 ]}
                 yAxis={[{width:50}]}
                />
                {/*}
               <LineChart 
                  xAxis={[
                    {data:getValues(studentList)},
                  ]}
                  series={getKeys(studentList).map((key, index)=>({
                            data:studentList[index][key],
                            label:key,
                            area:true,   
                   }))}
                  height={300}
                  grid={{vertical:true, horizontal:true}}
               />
               {*/}
               
              </CardContent>
               <CardActions>
                <Typography style={{display:"center"}}>
                  Distribution of students in various Classes
                  </Typography>
               </CardActions>
            </Card>
          </Grid>
          
        </Grid>
          <div className="loaderContainer">
            {isLoading && <CircularProgress />}
          </div>
          <div className="loaderContainer">
            <Typography color="error">{msg}</Typography>
          </div>
        
        </Box>
      </Layout>


    </div>
);
}

export default Dashboard;