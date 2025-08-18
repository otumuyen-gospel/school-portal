import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutline from "@mui/icons-material/PersonOutline";
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './ApiRefresher';
import SideBar from "./Sidebar";

function Layout(props){
   const [scrolling, setScrolling] = useState(false);
   const [scrollTop, setScrollTop] = useState(0);
   const [username,setUsername] = useState("username");
   const [role, setRole] = useState("role");
   const [badge, setBadge] = useState(0);
   const [open, setOpen] = useState(true);

   const openDrawer = ()=>{
    setOpen(open ? false : true);
   }

   const fetchNotification = async ()=>{
    axiosInstance.get("http://localhost:8000/schedule/schedule-list/").then((res) => {
        // grab notifications and schedules
        setBadge(res.data.count);
      }).catch((err) => {
        setBadge(0); //reset notification badge
      })
   }

   useEffect(()=>{
    fetchNotification(); // when component mounts
    //fetch data every 2 minute
    const intervalId = setInterval(fetchNotification, '120000');

    return ()=> clearInterval(intervalId); //clear interval when component unmount
   },[]);
   
   useEffect(()=>{
     const auth = JSON.parse(localStorage.getItem("auth"));
     if(auth){
        setRole(auth['user'].role);
        setUsername(auth['user'].username);
     }
    const onScroll = (e) => {
        setScrollTop(e.target.documentElement.scrollTop);
        setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll); //component did mount
    return ()=>{
        window.removeEventListener("scroll", onScroll); // component did unmount
    }
   },[scrollTop]); // keep updating

    return(
    <div sx={{flexGrow: 1}}>
        {/* navigation sidebar */}
        <SideBar open={open} />

        {/* Header or app bar*/}
        <Fade in={!scrolling}>
                <AppBar sx={{backgroundColor:"#EEF"}} elevation={0}>
                    <Toolbar>
                        <IconButton onClick={()=> openDrawer()}
                           sx={{color:"royalblue",  
                            marginLeft: open ? "15%" : "auto" }}
                           aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            color="royalblue"
                            sx={{flex:1, marginLeft:"20px", fontSize:"15px"}}>
                            {props.title}
                        </Typography>
                        <IconButton sx={{
                            color:"royalblue", 
                            marginRight:"30px"
                            }}
                            component={Link} 
                            to="/schedule/"
                            >
                            <Badge badgeContent={badge} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Typography marginTop="3px">
                            <Typography sx={{
                                color:"#333",
                                flex:1, 
                                marginRight:"5px", 
                                fontSize:"14px",
                                textAlign:"center",
                                }}>
                                {username}
                                <Typography sx={{
                                color:"#999",
                                flex:1, 
                                marginRight:"5px", 
                                fontSize:"10px",
                                textAlign:"center",
                                marginTop:"-5px"
                                }}>
                                {role}
                            </Typography>
                            </Typography>
                            
                        </Typography>
                        <IconButton component={Link} 
                        to="/profile/"
                        sx={{backgroundColor:"#EEF",
                            color:"royalblue",}}>
                            <PersonOutline></PersonOutline>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Fade>
            <Toolbar /> {/*make space between appbar and page contents */}

            {/* render page contents here at the bottom and pass new props to them */}
            {React.Children.map(props.children, child=>{
            return React.cloneElement(child,{
                marginLeft: open ? "13%" : "auto",
                width:"87%",
            });

            })}
    </div>
    );
}

export default Layout;