import AccountIcon from "@mui/icons-material/AccountBoxOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import OtherIcon from "@mui/icons-material/DevicesOther";
import LogoutIcon from "@mui/icons-material/PortableWifiOff";
import QuizIcon from "@mui/icons-material/QuizOutlined";
import ScheduleIcon from "@mui/icons-material/ScheduleOutlined";
import StudentIcon from "@mui/icons-material/SchoolOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "./ApiRefresher";
import ConfirmDialogForm from "./ConfirmDialogForm";
import MessageDialogForm from "./MessageDialogForm";

function Sidebar4(props){
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
  const [sectionIcons] = useState({
    Account: AccountIcon,
    Classes:ClassIcon,
    Assessment:QuizIcon,
    Others:OtherIcon,
  });

  const [items] = useState({
        Account:[
            {label:"Profile", Icon:AccountIcon,
                 to:"/profile/", hidden:false},
             {label:"Attendance", Icon:AccountIcon, 
                to:"/my-attendance/", hidden:false},
            
        ],
        Classes:[
            {label:"Subjects", Icon:ClassIcon, 
                to:"/class-subject-list/", hidden:false},
        ],
         Assessment:[
            {label:"Grades", Icon:AccountIcon,
                 to:"/user-marks/", hidden:false},
        ],

        Others:[
            {label:"Schedules", Icon:ScheduleIcon, 
                to:"/user-schedule/", hidden:false},
            {label:"New Ticket", Icon:AddIcon, 
                to:"/create-complaint/", hidden:false},
            {label:"Tickets", Icon:AccountIcon,
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
                    <Icon style={{
                       color:"#FFF",
                       width:"17px",
                       height:"17px"}}/>
                </ListItemIcon>
                <ListItemText style={{
                      color:"#FFF",
                      fontWeight:"bold",
                      fontSize:"5px"}}>
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
                width:"17px",
                height:"17px"}}/>
               </ListItemIcon>
               <ListItemText style={{
                color:"#FFF",
                fontWeight:"bold",
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

    return <Drawer anchor="Left" open={props.open} 
    onClose={props.onOpenDrawer}
    variant= {isMobile ? "temporary":"persistent"} 
    ModalProps={{
        keepMounted:true,
    }}
    sx={{
        '& .MuiDrawer-paper': {
            backgroundColor:'darkblue',
            boxSizing:'border-box',
            boxShadow:1,
            width:"19%",
        },
        flexShrink:0,
        display:{sx:"none",sm:"block"},
    }}
    >
        {/* header section*/}
        <ListItem alignItems="center" sx={{
            display:"block",
            textAlign:"center",
             }}>
            <ListItemIcon><StudentIcon style={{
                color:"#FFF",
                width:"50px",
                height:"50px"
            }}/></ListItemIcon>
            <ListItemText style={{
                color:"#FFF",
                fontWeight:"bold",
                fontSize:"5px"
            }}>School Portal</ListItemText>
        </ListItem>
        <Divider style={{backgroundColor:"#666", height:"0.01px"}}/>
          {/* page links */}

          <Scrollbars  autoHide autoHideTimeout={1000}
                  style={{width:"100%", height:"400px"}}>
          <Box>
         <ListItem  sx={{
            cursor:"pointer",
          }}
          button onClick={()=>{navigate("/dashboard/")}} >
               <ListItemIcon><DashboardIcon style={{
                color:"#FFF",
                width:"17px",
                height:"17px"
            }}/></ListItemIcon><br/>
              <ListItemText style={{
                color:"#FFF",
                fontWeight:"bold",
                fontSize:"5px"
            }}>Dashboard</ListItemText>  
         </ListItem>

         {/*Collapsible categories*/}
        <Categories />
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

        {/* logout section*/}
        <Divider style={{backgroundColor:"#666", height:"0.01px"}}/>
        <ListItem sx={{
            cursor:"pointer",
        }} button onClick={()=>{
            handleOpenDialog()
            
        }}>
            <ListItemIcon><LogoutIcon style={{
                color:"#FFF",
                width:"17px",
                height:"17px"
            }}/></ListItemIcon><br/>
              <ListItemText style={{
                color:"#FFF",
                fontWeight:"bold",
                fontSize:"5px"
            }}>Logout</ListItemText>
        </ListItem>
    
    </Drawer>
}

export default Sidebar4;