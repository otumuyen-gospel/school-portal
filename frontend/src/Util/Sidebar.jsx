import AddIcon from "@mui/icons-material/AddCircleOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useState } from "react";

function Sidebar(props){
    const ListItems = ({ items}) =>
        items.filter(({ hidden }) => !hidden).map((
            { label, Icon, component, to }, i) => (
            <ListItem 
                button
                key={i}
                component={component}
                to={to}   
            >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
            </ListItem>
        ));

    const [items] = useState({
        Account:[
            {label:"Add User", Icon:AddIcon, component:"Link", to:"/register/", hidden:false},
            {label:"View User", Icon:PersonOutline, component:"Link", to:"/userList/", hidden:false},
        ]
    });

    return <Drawer anchor="Left" open={props.open} variant="persistent" sx={{
        '& .MuiDrawer-paper': {
            backgroundColor:'#EEF',
            color:'royalblue',
        },
    }}>
        <List>
            <ListSubheader sx={{backgroundColor:"#EEF"}}>Account</ListSubheader>
            <ListItems items={items.Account} />
        </List>
    </Drawer>
}

export default Sidebar;