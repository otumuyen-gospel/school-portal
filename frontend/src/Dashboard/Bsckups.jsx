import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import axiosInstance from "../Util/ApiRefresher";
import ConfirmDialogForm from "../Util/ConfirmDialogForm";
import Layout from "../Util/Layout";
import MessageDialogForm from "../Util/MessageDialogForm";

function Backups(){
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [msg, setMsg] = useState("");
  const [location, setLocation] = useState("");
  const [openBackupDialog, setOpenBackupDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }

  const handleOpenBackupDialog = ()=>{
    setOpenBackupDialog(true);
  }
  const handleCloseBackupDialog = ()=>{
    setOpenBackupDialog(false);
  }
  const handleOpenRestoreDialog = ()=>{
    setOpenRestoreDialog(true);
  }
  const handleCloseRestoreDialog = ()=>{
    setOpenRestoreDialog(false);
  }
  
 const backup = ()=>{
    setIsLoading(true);
    axiosInstance.post("accounts/system-backup/").then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg(res.data.message);
            setLocation(JSON.stringify(res.data.location))
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

  const restore = ()=>{
    setIsLoading(true);
    axiosInstance.post("accounts/system-restore/").then((res) => {
            setIsLoading(false)
            setIsDisabled(false)  //re-enable button
            setMsg(res.data.message);
            setLocation(JSON.stringify(res.data.location))
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
      <Layout title="Backups">
        <Box 
       sx={{
          minHeight:"100vh",
          marginTop:"10px",
        }}
        >
        <Typography component="h1" variant="h6">Backup / Restore</Typography>
        <Box sx={{width:{xs:"100%", textAlign:"center"}}}>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isDisabled}
                onClick={handleOpenBackupDialog}
                sx={{ mt: 2, mb: 2, margin:"10px", height:"50px", width:"150px",
                borderRadius:"10px", backgroundColor:"#FFF", color:"royalblue" }}>
                    Backup
            </Button>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isDisabled}
                onClick={handleOpenRestoreDialog}
                sx={{ mt: 2, mb: 2, margin:"10px", height:"50px", width:"150px",
                borderRadius:"10px" }}>
                    Restore
            </Button>


            <div className="loaderContainer" marginBottom={10}>
                {isLoading && <CircularProgress />}
            </div>

            <Box className="loaderContainer" padding={7} boxShadow={1} borderRadius={5}>
                <Typography component="h3" color="royalblue">
                    You can find your backups at this location {location}
                </Typography>
            </Box>

        </Box>
        </Box>

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{msg}</Typography>}
        title="Message Dialog"
        />

        <ConfirmDialogForm open={openBackupDialog} 
        onClose={handleCloseBackupDialog} 
        onSubmit={()=>backup()}
        formContent={<Typography>This action will create a backup for
             your files and databases</Typography>}
        title="Confirm Dialog"
        />

        <ConfirmDialogForm open={openRestoreDialog} 
        onClose={handleCloseRestoreDialog} 
        onSubmit={()=>restore()}
        formContent={<Typography>This action will restore your most 
            recent backups</Typography>}
        title="Confirm Dialog"
        />
      </Layout>
    </div>
    
);

}


export default Backups;