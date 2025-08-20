import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function MessageDialogForm({open, onClose, formContent, title}){
    return (<Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{color:"#666", fontSize:14}}>{title}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
        <DialogActions>
            <center>
            <Button sx={{backgroundColor:"royalblue",borderRadius:50,
             color:"#FFF",}}
             onClick={onClose}>OK</Button>
             </center>
        </DialogActions>
    </Dialog>);
}

export default MessageDialogForm;