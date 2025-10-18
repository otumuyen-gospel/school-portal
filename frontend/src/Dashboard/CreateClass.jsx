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
            if (err) {
              setMsg(JSON.stringify(err.response.data));
                 handleOpenMsgBox();
            }
    })
        
  }
  
  return (
     
    <div style={{backgroundColor:"#FFF"}}>
      <Layout title="New Class">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">New Class</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
           width:{xs:"100%",}}}>
            <Typography marginTop={5} style={{color:"royalblue"}}>
              Create New Class</Typography>
            <Box boxShadow={1} marginBottom={5} borderTop="5px solid royalblue"
            marginTop={5} padding="10px 30px">
               <Grid container spacing={1} textAlign="center">
                 <Grid item size={{xs:12,}}>
                  <TextField
                      sx={{
                       width:"60%",
                      '& .MuiInputBase-root':{
                       height:"50px",
                       borderRadius:"10px",
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
                        width:"60%",
                      '& .MuiInputBase-root':{
                       height:"50px",
                       borderRadius:"10px",
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
            </Box>
            <div style={{textAlign:"center"}}>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 2, mb: 2, height:"50px", width:"150px",
              borderRadius:"10px" }}>Create</Button></div>
            
              <div className="loaderContainer" marginBottom={10}>
                     {isLoading && <CircularProgress />}
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