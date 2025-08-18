import Container from "@mui/material/Container";
import Layout from "../Util/Layout";
function Profile(){
  const PageContent = (props)=>{
    return (
      <Container sx={{
        marginLeft:props.marginLeft,
        width:props.width,
        }}>
        <h1>Profile</h1>
      </Container>
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