import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function ClassList(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Class Lists
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Class Lists">
        <PageContent/>
      </Layout>
    </div>
);

}


export default ClassList;