import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function CreateClass(){
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }
  
 const handleSubmit = (event)=>{
    event.preventDefault();
    setIsLoading(true);
    const form = {
    className:className,
    classCode:classCode,

  };
    axiosInstance.post("classes/create-class/",
          form).then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg("class created successfully");
            handleOpenMsgBox();
    }).catch((err) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            if (err.response) {
              setMsg(JSON.stringify(err.response.data));
                 handleOpenMsgBox();
            }else{
               setMsg(JSON.stringify(err.message));
                 handleOpenMsgBox();
            }
    })
        
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
                     New Class</Typography>
                   <Box component="form" onSubmit={handleSubmit} 
                   sx={{backgroundColor:"#FFF", padding:"5px 10px"}}
                boxShadow={1}>
                  <Grid container spacing={2} textAlign="center">
                  <Grid item size={{xs:12,}}>
                     <Typography marginTop={1} style={{color:"darkblue", textAlign:"left"}}>
                        New Class Information</Typography>
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
                      id="className"
                      label="className"
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      name="className"             
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
                      id="classCode"
                      label="classCode"
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      name="classCode"             
                  />
                 </Grid>
               </Grid>
            <div style={{textAlign:"center"}}>
                         <Button
                         fullWidth
                         type="submit"
                         variant="contained"
                         disabled={isDisabled}
                         sx={{ mt: 2, mb: 2, height:"50px", backgroundColor:"darkblue" }}>
                          Create New Class</Button></div>
                       
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


export default CreateClass;