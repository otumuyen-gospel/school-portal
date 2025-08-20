import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDialogForm({open, onClose, onSubmit, formContent, title}){
    const handleSubmit = ()=>{
        onSubmit();
        onClose();

    }
    return (<Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{color:"#666", fontSize:14}}>{title}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
        <DialogActions>
            <Button sx={{backgroundColor:"#EEE",borderRadius:50, 
            color:"royalblue",}} 
            onClick={onClose}>Cancel</Button>
            <Button sx={{backgroundColor:"royalblue",borderRadius:50,
             color:"#FFF",}}
             onClick={handleSubmit}>Go</Button>
        </DialogActions>
    </Dialog>);
}

export default ConfirmDialogForm;