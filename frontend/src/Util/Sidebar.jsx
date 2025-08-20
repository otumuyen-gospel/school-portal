import AccountIcon from "@mui/icons-material/AccountBoxOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import ToggleOn from "@mui/icons-material/ArrowDropDown";
import ToggleOff from "@mui/icons-material/ArrowDropUp";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import childIcon from "@mui/icons-material/PeopleAltOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import LogoutIcon from "@mui/icons-material/PowerOffOutlined";
import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./ApiRefresher";
import ConfirmDialogForm from "./ConfirmDialogForm";
import MessageDialogForm from "./MessageDialogForm";

function Sidebar(props){
    const navigate = useNavigate();
  const {refresh}  = JSON.parse(localStorage.getItem("auth"));
  const [openDialog, setOpenDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState({
    Account: true,
  });
  const [items] = useState({
        Account:[
            {label:"New User", Icon:AddIcon, 
                to:"/register/", hidden:false},
            {label:"All Users", Icon:PeopleOutline, 
                to:"/userLists/", hidden:false},
            {label:"Class Users", Icon:childIcon, 
                to:"/classUsers/", hidden:false},
            {label:"Profile", Icon:AccountIcon,
                 to:"/profile/", hidden:false},
            
        ]
    });
  
  const handleOpenDialog = ()=>{
    setOpenDialog(true);
  }
  const handleCloseDialog = ()=>{
    setOpenDialog(false);
  }
  const handleOpenMsgBox = ()=>{
    setOpenMsgBox(true);
  }
  const handleCloseMsgBox = ()=>{
    setOpenMsgBox(false);
  }
  const logout= async ()=>{
    axiosInstance.post("http://localhost:8000/auth/logout/",
        {refresh_token:refresh}).then((res) => {
        // logout and delete client auth storage
        localStorage.removeItem("auth");
        navigate("/");
      }).catch((err) => {
        setError(err.message);
        handleOpenMsgBox();
      })
   };

   const ListItems = ({ items}) =>
        items.filter(({ hidden }) => !hidden).map((
            { label, Icon, to, }, i) => (
            <ListItem 
                button
                key={i}
                onClick={()=>{
                    navigate(to);
                }}   
                sx={{cursor:"pointer"}}
            >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
            </ListItem>
            
        ));

    const CreateCategory = ({item, section, sectionKey,sectionTitle})=>{
        return (<List>
            <ListItem  sx={{cursor:"pointer"}}  button
                onClick={()=>{
                    setSections({...sections, 
                     [sectionKey]:section ? false : true});
                }}
            >
               <ListItemIcon>
               { section ? <ToggleOn/> : <ToggleOff/>}
               </ListItemIcon>
               <ListItemText>{sectionTitle}</ListItemText>
            </ListItem>
            <Collapse in={section}>
                <ListItems items={item} />
            </Collapse>
         </List>);
    }
    
    const isMobile = useMediaQuery('(max-width:600px)'); 

    return <Drawer anchor="Left" open={props.open} 
    onClose={props.onOpenDrawer}
    variant= {isMobile ? "temporary":"persistent"} 
    ModalProps={{
        keepMounted:true,
    }}
    sx={{
        '& .MuiDrawer-paper': {
            backgroundColor:'#FFF',
            boxSizing:'border-box',
            color:'royalblue',
            boxShadow:5,
        },
        flexShrink:0,
        display:{sx:"none",sm:"block"}
    }}>
        {/* header section*/}
        <ListItem alignItems="center" sx={{
            padding:"10px",
             backgroundColor:"royalblue",
             color:"#FFF"
             }}>
            <ListItemIcon><StudentIcon style={{color:"#FFF"}} /></ListItemIcon>
            <ListItemText>Portal</ListItemText>
        </ListItem>
         <Divider/>

          {/* page links */}
         <ListItem  sx={{
            cursor:"pointer",
          }}
          button onClick={()=>{navigate("/dashboard/")}} >
               <ListItemIcon><DashboardIcon /></ListItemIcon><br/>
              <ListItemText>Dashboard</ListItemText>  
         </ListItem>

         {/*collapsible sections and categories*/}
         <CreateCategory 
         item={items.Account} 
         section={sections.Account}
         sectionTitle={"Accounts"}
         sectionKey={"Account"}
         />


        {/*Dialog window */}
        <ConfirmDialogForm open={openDialog} 
        onClose={handleCloseDialog} 
        onSubmit={logout}
        formContent={<Typography>This action will log you out</Typography>}
        title="Confirm Dialog"
        />

        <MessageDialogForm open={openMsgBox} 
        onClose={handleCloseMsgBox} 
        formContent={<Typography>{error}</Typography>}
        title="Message Dialog"
        />

        {/* logout section*/}
        <Divider/>
        <ListItem button onClick={()=>{
            handleOpenDialog()
            
        }}>
            <ListItemIcon><LogoutIcon/></ListItemIcon>
            <ListItemText>Logout</ListItemText>
        </ListItem>
    </Drawer>
}

export default Sidebar;