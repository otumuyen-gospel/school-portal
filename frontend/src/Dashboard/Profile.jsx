import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function Profile(){
  /* 
    const [currUser, setCurrUser] = useState({});
    useEffect(()=>{
    //if the same current user is logged in update the user currently saved login profile
     const auth = JSON.parse(localStorage.getItem("auth"));
     if(auth){
      if(auth['user'].pk === currUser.pk){
          auth['user'] = currUser;
          localStorage.setItem("auth",JSON.stringify(auth));
      }
     }
  },[currUser])
  */
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Profile
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Profile">
        <PageContent/>
      </Layout>
    </div>
);

}


export default Profile;