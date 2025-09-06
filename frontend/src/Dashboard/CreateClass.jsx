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
    axiosInstance.post("http://localhost:8000/classes/create-class/",
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
            <Typography component="p" sx={{
              textAlign:"center",
              color:"primary",
              }}>
                Create New Class
           </Typography>

           <Grid container width="sm" direction="column" spacing={4}>
            <Grid>
              <TextField
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
            <Grid>
              <TextField
                 fullWidth
                 margin="normal"
                 required
                 id="classCode"
                 label="classCode"
                 type="classCode"
                 value={classCode}
                 onChange={(e) => setClassCode(e.target.value)}
                 name="classCode"
                 
              />
            </Grid>
            <Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}>Create Class</Button>
            
              <div className="loaderContainer">
                     {isLoading && <CircularProgress />}
               </div>
            </Grid>
           </Grid>
           

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