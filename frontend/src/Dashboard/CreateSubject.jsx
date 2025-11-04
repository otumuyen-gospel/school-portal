import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function CreateSubject(){
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [classId, setClassId] = useState("");
   const [classList, setClassList] = useState([]);
  
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
         setMsg(JSON.stringify(error.response.data)+` Oops! sorry can't load class List`);
         handleOpenMsgBox();
       })
    },[])
  
 const handleSubmit = (event)=>{
    event.preventDefault();
    setIsLoading(true);
    const form = {
    subjectName:subjectName,
    subjectCode:subjectCode,
    classId:classId

  };
    axiosInstance.post("subjects/create-subject/",
          form).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("subject created successfully");
            handleOpenMsgBox();
    }).catch((err) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            if (err) {
              setMsg(JSON.stringify(err.response.data));
                 handleOpenMsgBox();
            }
    })
        
  }
  
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
                     New Subject</Typography>
                   <Box component="form" onSubmit={handleSubmit} sx={{
                          backgroundColor:"#FFF", boxShadow:0, border:"0.5px solid #EEE", padding:"5px 10px"}}>
                  <Grid container spacing={2} textAlign="center">
                  <Grid item size={{xs:12,}}>
                      <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                          New Subject Information</Typography>
                    </Grid>
                     <Grid item size={{xs:12,}}>
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
                                  required
                                  id="subjectName"
                                  label="subjectName"
                                  type="text"
                                  value={subjectName}
                                  onChange={(e) => setSubjectName(e.target.value)}
                                  name="subjectName"             
                              />
                             </Grid>
                             <Grid item size={{xs:12,}}>
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
                                  required
                                  id="subjectCode"
                                  label="subjectCode"
                                  type="text"
                                  value={subjectCode}
                                  onChange={(e) => setSubjectCode(e.target.value)}
                                  name="subjectCode"             
                              />
                             </Grid>
                             <Grid item size={{xs:12,}}>
                              <FormControl sx={{margin:"16px 0px 0px 0px", 
                                minWidth: "100%" }}>
                                  <InputLabel id="class-label">{classId || "class"}</InputLabel>
                                  <Select
                                    sx={{
                                      height:"50px",
                                  }}
                                    fullWidth
                                    margin="normal"
                                    labelId="class-label"
                                    id="classId"
                                    name="classId"
                                    value={classId}
                                    label="class"
                                    onChange={(e) => setClassId(e.target.value )}
                                   >
                                    {
                                     classList.map(classlist=>(
                                          <MenuItem key={classlist.id}
                                           value={classlist.id}>{classlist.classCode}
                                           </MenuItem>
                                     ))
                        
                                    }
                                 </Select>
                              </FormControl>
                             </Grid>
                           </Grid>
                        <div style={{textAlign:"center"}}>
                         <Button
                         fullWidth
                         type="submit"
                         variant="contained"
                         disabled={isDisabled}
                         sx={{ mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue" }}>
                          Create New Subject</Button></div>
                       
                         <div className="loaderContainer" marginBottom={10}>
                                {isLoading && <CircularProgress sx={{
                           '& .MuiCircularProgress-circle': {
                            stroke: 'darkblue', 
                           },
                          '& .MuiCircularProgress-circle.MuiCircularProgress-circleDeterminate': {
                           stroke: 'darkblue', 
                          },
                       }}/>}
                          </div>
                        </Box>
                      </Box>

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{msg}</Typography>}
        title="Message Dialog"
        />
      </Layout>
    </div>
    
);

}


export default CreateSubject;