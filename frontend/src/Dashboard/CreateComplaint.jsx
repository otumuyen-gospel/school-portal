import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function CreateComplaint(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>New Ticket
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="New Ticket">
        <PageContent/>
      </Layout>
    </div>
);

}


export default CreateComplaint;