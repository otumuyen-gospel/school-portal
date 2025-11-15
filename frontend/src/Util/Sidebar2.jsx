import AccountIcon from "@mui/icons-material/AccountBoxOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import ClassHomwWork from "@mui/icons-material/AssessmentOutlined";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import OtherIcon from "@mui/icons-material/DevicesOther";
import childIcon from "@mui/icons-material/PeopleAltOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import LogoutIcon from "@mui/icons-material/PortableWifiOff";
import QuizIcon from "@mui/icons-material/QuizOutlined";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";
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
function Sidebar2(props){
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
            {label:"Students", Icon:childIcon, 
                to:"/class-users/", hidden:false},
            {label:"Profile", Icon:AccountIcon,
                 to:"/profile/", hidden:false},
             {label:"Attendance", Icon:PeopleOutline, 
                to:"/class-attendance/", hidden:false},
            
        ],
        Classes:[
            {label:"Subjects", Icon:ClassIcon, 
                to:"/class-subject-list/", hidden:false},
        ],

         Assessment:[
            {label:"Add Grade", Icon:AddIcon, 
                to:"/create-marks/", hidden:false},
            {label:"Grades", Icon:ClassIcon, 
                to:"/class-marks/", hidden:false},
            {label:"Homeworks", Icon:ClassHomwWork, 
                to:"/class-homework-list/", hidden:false},
            {label:"Add Quiz", Icon:AddIcon, 
                to:"/create-quiz/", hidden:false},
            {label:"Quizzes", Icon:ClassIcon, 
                to:"/class-quiz/", hidden:false},
            
        ],

        Others:[
            {label:"New Schedule", Icon:AddIcon, 
                to:"/create-schedule/", hidden:false},
            {label:"Schedules", Icon:ScheduleIcon, 
                to:"/schedule-list/", hidden:false},
            {label:"Complaints", Icon:ClassIcon, 
                to:"/class-complaint-list/", hidden:false},
            
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

export default Sidebar2;