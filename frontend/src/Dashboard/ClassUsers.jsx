import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function classUsers(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Class Users
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Class Users">
        <PageContent/>
      </Layout>
    </div>
);

}


export default classUsers;