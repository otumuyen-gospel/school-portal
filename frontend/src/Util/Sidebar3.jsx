import AccountIcon from "@mui/icons-material/AccountBoxOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import ToggleOn from "@mui/icons-material/ArrowDropDown";
import ToggleOff from "@mui/icons-material/ArrowDropUp";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import LogoutIcon from "@mui/icons-material/PortableWifiOff";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";
import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "./ApiRefresher";
import ConfirmDialogForm from "./ConfirmDialogForm";
import MessageDialogForm from "./MessageDialogForm";

function Sidebar3(props){
  const navigate = useNavigate();    
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [openDialog, setOpenDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState({
    Account: false,
    Classes:false,
    Assessment:false,
    Others:false,
  });

  const [items] = useState({
        Account:[
            {label:"Profile", Icon:AccountIcon,
                 to:"/profile/", hidden:false},
             {label:"My Attendance", Icon:AccountIcon, 
                to:"/my-attendance/", hidden:false},
            
        ],
        Classes:[
            {label:"Class Subject", Icon:ClassIcon, 
                to:"/class-subject-list/", hidden:false},
        ],

         Assessment:[
            {label:"My Grades", Icon:AccountIcon,
                 to:"/user-marks/", hidden:false},
            {label:"New work", Icon:AddIcon, 
                to:"/create-homework/", hidden:false},
            {label:"My Work", Icon:AccountIcon,
                 to:"/user-homework-list/", hidden:false},
            {label:"My Quiz", Icon:AccountIcon,
                 to:"/user-quiz/", hidden:false},
            
        ],

        Others:[
            {label:"My Schedules", Icon:ScheduleIcon, 
                to:"/user-schedule/", hidden:false},
            {label:"New Ticket", Icon:AddIcon, 
                to:"/create-complaint/", hidden:false},
            {label:"My Tickets", Icon:AccountIcon,
                 to:"/user-complaint-list/", hidden:false},
            
        ],

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
    try{
    const {refresh} = JSON.parse(localStorage.getItem("auth"));
    axiosInstance.post("http://localhost:8000/auth/logout/",
        {refresh_token:refresh}).then((res) => {
        // logout and delete client auth storage
        localStorage.removeItem("auth");
        navigate("/");
      }).catch((err) => {
        setError(err.message);
        handleOpenMsgBox();
      })}catch(err){
        navigate("/");
      }
   };

   const ListItems = ({ items}) =>
        items.filter(({ hidden }) => !hidden).map((
            { label, Icon, to, }, i) => (
            <ListItem 
                button
                key={i} 
                sx={{cursor:"pointer"}}
            >
                <ListItemButton
                selected={ location.pathname === to }
                component={NavLink}
                to={to}
                >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
                </ListItemButton>
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

    const Categories = ()=>{
       return Object.keys(sections).map((key, index)=>{
           return <CreateCategory 
               key={key}
               item={items[key]} 
               section={sections[key]}
               sectionTitle={key}
               sectionKey={key}
         />;
        });
    }

    return <Drawer anchor="Left" open={props.open} 
    onClose={props.onOpenDrawer}
    variant= {isMobile ? "temporary":"persistent"} 
    ModalProps={{
        keepMounted:true,
    }}
    sx={{
        '& .MuiDrawer-paper': {
            backgroundColor:'#F9F9F9',
            boxSizing:'border-box',
            color:'royalblue',
            boxShadow:0,
        },
        flexShrink:0,
        display:{sx:"none",sm:"block"},
    }}
    >
        {/* header section*/}
        <ListItem alignItems="center" sx={{
            padding:"15px",
            backgroundColor:"royalblue",
             }}>
            <ListItemIcon><StudentIcon style={{color:"white"}} /></ListItemIcon>
            <ListItemText style={{color:"white"}}>SCHOOL PORTAL</ListItemText>
        </ListItem>
          {/* page links */}
         <ListItem  sx={{
            cursor:"pointer",
          }}
          button onClick={()=>{navigate("/dashboard/")}} >
               <ListItemIcon><DashboardIcon /></ListItemIcon><br/>
              <ListItemText>Dashboard</ListItemText>  
         </ListItem>

         {/*Collapsible categories*/}
        <Categories />

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
        
        <ListItem sx={{
            cursor:"pointer",
        }} button onClick={()=>{
            handleOpenDialog()
            
        }}>
            <ListItemIcon><LogoutIcon/></ListItemIcon>
            <ListItemText>Logout</ListItemText>
        </ListItem>
    
    </Drawer>
}

export default Sidebar3;