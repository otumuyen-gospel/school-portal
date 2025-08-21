import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function ComplaintList(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Tickets
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Tickets">
        <PageContent/>
      </Layout>
    </div>
);

}


export default ComplaintList;