import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonOutline from "@mui/icons-material/PersonOutline";
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './ApiRefresher';

function Header(props){
   const [scrolling, setScrolling] = useState(false);
   const [scrollTop, setScrollTop] = useState(0);
   const [username,setUsername] = useState("username");
   const [role, setRole] = useState("role");
   const [badge, setBadge] = useState(0);

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
        <Fade in={!scrolling}>
                <AppBar sx={{backgroundColor:"#FFFFFF"}} elevation={0}>
                    <Toolbar>
                        <IconButton
                           sx={{color:"royalblue", marginLeft:"-10px"}}
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
            <Toolbar /> {/*make space between appbar and other page content */}
    </div>
    );
}






/*
const styles = theme => ({
    root: {flexGrow: 1},
    flex: {flex: 1},
    menuButton: {
       marginLeft: -12,
       marginRight: 20
    },
    toolbarMargin: theme.mixins.toolbar
});


const ScrolledAppBar = makeStyles(styles)(
    class extends Component {
        state = {
            scrolling: false,
            scrollTop: 0
        };
        onScroll = e => {
            this.setState(state => ({
                scrollTop: e.target.documentElement.scrollTop,
                scrolling: e.target.documentElement.scrollTop > state.scrollTop
            }));
        };
        shouldComponentUpdate(props, state) {
            return this.state.scrolling !== state.scrolling;
        }
        componentDidMount() {
            window.addEventListener('scroll', this.onScroll);
        }
        componentWillUnmount() {
            window.removeEventListener('scroll', this.onScroll);
        }
        render() {
            const { classes } = this.props;
            return (
            <Fade in={!this.state.scrolling}>
                <AppBar>
                    <Toolbar>
                        <IconButton
                           className={classes.menuButton}
                           color="inherit"
                           aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.flex}>
                            My Title
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Fade>
            );
        }
    }
);


const AppBarWithButtons = makeStyles(styles)(
    ({ classes, title, buttonText }) => (
    <div className={classes.root}>
        <ScrolledAppBar />
        <div className={classes.toolbarMargin} />
        <ul>
            {new Array(500).fill(null).map((v, i) => (
                <li key={i}>{i}</li>
            ))}
        </ul>
    </div>
    )
);*/

export default Header;