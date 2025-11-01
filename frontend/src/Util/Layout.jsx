import CloseOutlined from "@mui/icons-material/CloseRounded";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutline from "@mui/icons-material/PersonOutline";
import StudentIcon from "@mui/icons-material/SchoolOutlined";
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from "@mui/material/Divider";
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from './ApiRefresher';
import SideBar from "./Sidebar";
import SideBar2 from './Sidebar2';
import SideBar3 from './Sidebar3';
import SideBar4 from './Sidebar4';

function Layout(props){
   const [username,setUsername] = useState("username");
   const [role, setRole] = useState("role");
   const [pics, setPics] = useState("");
   const [badge, setBadge] = useState(0);
   const [open, setOpen] = useState(true);
   const navigate = useNavigate();
   const isMobile = useMediaQuery('(max-width:700px)');

   const openDrawer = ()=>{
    setOpen(open ? false : true);
   }

   const setUser = async()=>{
    const auth = JSON.parse(localStorage.getItem("auth"));
    if(auth){
      try{
        const url = "accounts/retrieve-user/"+auth['user'].pk+"/";
        const response = await axiosInstance.get(url)
        setRole(response.data.role);
        setUsername(response.data.username);
        setPics(response.data.pics)
      }catch(error){}
    }
   }

   const fetchNotification = async ()=>{
    axiosInstance.get("schedule/schedule-list/").then((res) => {
        // grab notifications and schedules
        setBadge(res.data.count);
      }).catch((err) => {
        setBadge(0); //reset notification badge
      })
   }
   useEffect(()=>{
     setUser();
   },[])
   useEffect(()=>{
    fetchNotification(); // when component mounts
    //fetch data every 1 hour
    const intervalId = setInterval(fetchNotification, '3600000');

    return ()=> clearInterval(intervalId); //clear interval when component unmount
   },[]); 

   const userSideBar = ()=>{
    const auth = JSON.parse(localStorage.getItem("auth"));
    if(auth['user'].role === 'admin'){
       return  <SideBar/>;
    }else if(auth['user'].role === 'teacher'){
        return  <SideBar2/> ;
    }else if(auth['user'].role === 'student'){
        return <SideBar3/> ;
    }else if(auth['user'].role === 'parent'){
        return  <SideBar4/>;
    }else{
        navigate("/");
    }

   }

    return(
    <div sx={{flexGrow: 1}}>

           {/* Header or app bar*/}
           <AppBar sx={{backgroundColor:"#FFF",borderBottom:"0.5px solid #DDD"}} 
           elevation={0}>
                    <Toolbar>
                        <IconButton onClick={()=> openDrawer()}
                           sx={{color:"darkblue", marginLeft:"-22px"}}
                           aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <IconButton  sx={{
                            color:"darkblue", 
                            marginRight:"10px"
                            }}>
                            <StudentIcon/>
                        </IconButton>
                        
                        <Typography
                            variant="h6"
                            color="darkblue"
                            sx={{flex:1, fontSize:"15px"}}>
                            {props.title}
                        </Typography>
                        <IconButton sx={{
                            color:"darkblue", 
                            marginRight:"30px"
                            }}
                            component={Link} 
                            to="/user-schedule/"
                            >
                            <Badge badgeContent={badge} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Box sx={{marginTop:"3px"}}>
                            <Box sx={{
                                color:"darkblue",
                                flex:1, 
                                marginRight:"5px", 
                                fontSize:"14px",
                                textAlign:"center",
                                }}>
                                {username}
                                <Typography sx={{
                                color:"#666",
                                flex:1, 
                                marginRight:"5px", 
                                fontSize:"10px",
                                textAlign:"center",
                                marginTop:"-5px"
                                }}>
                                {role}
                            </Typography>
                            </Box>
                            
                        </Box>
                        <IconButton component={Link} 
                        to="/profile/"
                        sx={{
                            color:"darkblue",
                            }}>
                           <Avatar
                            src={pics}
                            sx={{
                                width:30,
                                height:30,
                                marginRight:"-22px"
                            }}
                           >
                            {!pics && <PersonOutline/>}
                           </Avatar>

                        </IconButton>
                    </Toolbar>
            </AppBar>
            <Toolbar/> {/*make space between appbar and page contents */}
            <div>
                <div  style={{
                    display: (isMobile && open) ? "block" : "none",
                    position:"fixed",
                    width:"100%",
                    height:"100vh",
                    backgroundColor:"rgba(0,0,0,0.5)",
                    top:0,
                    right:0,
                    zIndex:1200,
                }}>
                    <IconButton onClick={()=>setOpen(false)} 
                    style={{position:"fixed", bottom:0, right:0, marginBottom:"10px",
                         backgroundColor:"#FFF",marginRight:"10px"}}>
                        <CloseOutlined style={{color:"darkblue", height:"30px", 
                        width:"30px"}} 
                        /></IconButton>

                    <div style={{width:"250px", backgroundColor:"darkblue"}}>
                     {/* navigation sidebar */}
                     <ListItem style={{backgroundColor:"rgb(0,0,150)",}}>
                        <ListItemIcon>
                            <StudentIcon style={{color:'#FFF'}}/>
                        </ListItemIcon>
                        <ListItemText style={{color:'#FFF', fontWeight:"bolder",
                             fontSize:"15px", padding:"10px auto"}}>
                            De Modern Pace
                        </ListItemText>
                     </ListItem>
                     <Divider color="#555"/>
                     {userSideBar()}
                     </div>
                </div>
                <div  style={{
                    display: (!isMobile && open) ? "block" : "none",
                    position:"fixed",
                    width:"23%",
                    padding:"auto 1%",
                    
                }}>
                     {/* navigation sidebar */}
                     {userSideBar()}
                </div>
                <div style={{
                    marginLeft:open ? "25%"  : "1%",
                    width:open ? "73%" : "98%",
                    marginRight:"1%",
                }}>
                     {/* render page contents here at the bottom and pass new props to them */}
                   {React.Children.map(props.children, child=>{
                       return React.cloneElement(child,{
                          width:"100%",
                        });

                    })}
                </div>
         </div>
            
    </div>
    );
}

export default Layout;