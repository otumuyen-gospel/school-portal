import AccountIcon from "@mui/icons-material/AccountBoxOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import TicketIcon from "@mui/icons-material/AirplaneTicket";
import BackupIcon from "@mui/icons-material/BackupOutlined";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import OtherIcon from "@mui/icons-material/DevicesOther";
import GradeIcon from "@mui/icons-material/GradeOutlined";
import HomeWorkIcon from "@mui/icons-material/HomeWorkOutlined";
import AttendanceIcon from "@mui/icons-material/PagesOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import LogoutIcon from "@mui/icons-material/PortableWifiOff";
import QuizIcon from "@mui/icons-material/QuizOutlined";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";
import SubjectIcon from "@mui/icons-material/SubjectOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "./ApiRefresher";
import ConfirmDialogForm from "./ConfirmDialogForm";
import MessageDialogForm from "./MessageDialogForm";

function Sidebar(props){
  const navigate = useNavigate();    
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openMsgBox, setOpenMsgBox] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState({
    Account: false,
    Classes:false,
    Assessment:false,
    Others:false,
  });

  const [sectionIcons] = useState({
    Account: AccountIcon,
    Classes:ClassIcon,
    Assessment:QuizIcon,
    Others:OtherIcon,
  });

  const [items] = useState({
        Account:[
            {label:"New User", Icon:AddIcon, 
                to:"/register/", hidden:false},
            {label:"Users", Icon:PeopleOutline, 
                to:"/user-lists/", hidden:false},
            {label:"Profile", Icon:AccountIcon,
                 to:"/profile/", hidden:false},
             {label:"Attendance", Icon:AttendanceIcon, 
                to:"/attendance-lists/", hidden:false},
            
        ],
        Classes:[
            {label:"New Class", Icon:AddIcon, 
                to:"/create-class/", hidden:false},
            {label:"Classes", Icon:ClassIcon, 
                to:"/class-lists/", hidden:false},
            {label:"New Subject", Icon:AddIcon, 
                to:"/create-subject/", hidden:false},
            {label:"Subjects", Icon:SubjectIcon, 
                to:"/subject-list/", hidden:false},
        ],

         Assessment:[
            {label:"Grades", Icon:GradeIcon, 
                to:"/mark-list/", hidden:false},
            {label:"Homeworks", Icon:HomeWorkIcon, 
                to:"/homework-list/", hidden:false},
            {label:"Quizzes", Icon:QuizIcon, 
                to:"/quiz-list/", hidden:false},
            
        ],

        Others:[
            {label:"New Schedule", Icon:AddIcon, 
                to:"/create-schedule/", hidden:false},
            {label:"Schedules", Icon:ScheduleIcon, 
                to:"/schedule-list/", hidden:false},
            {label:"Complaints", Icon:TicketIcon, 
                to:"/complaint-list/", hidden:false},
            {label:"Backups", Icon:BackupIcon, 
                to:"/backups/", hidden:false},
            
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
    axiosInstance.post("auth/logout/",
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
                    <Icon style={{
                       color:"#FFF",
                       width:"15px",
                       height:"15px"}}/>
                </ListItemIcon>
                <ListItemText style={{
                      color:"#FFF",
                      fontWeight:"normal",
                      fontSize:"25px"}}>
                       {label}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
            
        ));

    const CreateCategory = ({item, section, sectionKey,sectionTitle, Icon})=>{
        return (<List>
            <ListItem  sx={{cursor:"pointer"}}  button
                onClick={()=>{
                    setSections({...sections, 
                     [sectionKey]:section ? false : true});
                }}
            >
               <ListItemIcon>
               <Icon style={{
                color:"#FFF",
                width:"15px",
                height:"15px"}}/>
               </ListItemIcon>
               <ListItemText style={{
                color:"#FFF",
                fontWeight:"normal",
                fontSize:"5px"}}>{sectionTitle}</ListItemText>
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
               Icon={sectionIcons[key]}
         />;
        });
    }

    return <div style={{
        backgroundColor:"darkblue",
        height:"100vh",
        padding:"auto 10px"
    }}
    >
          {/* page links */}
          <Scrollbars autoHide autoHideTimeout={2000}
                  style={{width:"100%", height:"85vh",}}>
          <Box>
         <ListItem  sx={{
            cursor:"pointer",
          }}
          button onClick={()=>{navigate("/dashboard/")}} >
               <ListItemIcon><DashboardIcon style={{
                color:"#FFF",
                width:"15px",
                height:"15px"
            }}/></ListItemIcon><br/>
              <ListItemText style={{
                color:"#FFF",
                fontWeight:"normal",
                fontSize:"5px"
            }}>Dashboard</ListItemText>  
         </ListItem>
         {/*Collapsible categories*/}
        <Categories />

        
        {/* logout section*/}
        <ListItem sx={{
            cursor:"pointer",
        }} button onClick={()=>{
            handleOpenDialog()
            
        }}>
            <ListItemIcon><LogoutIcon style={{
                color:"#FFF",
                width:"15px",
                height:"15px"
            }}/></ListItemIcon><br/>
              <ListItemText style={{
                color:"#FFF",
                fontWeight:"normal",
                fontSize:"5px"
            }}>Logout</ListItemText>
        </ListItem>
        </Box>
        </Scrollbars>

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
    
    </div>
}

export default Sidebar;