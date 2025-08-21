import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function HomeworkList(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Homeworks
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Homeworks">
        <PageContent/>
      </Layout>
    </div>
);

}


export default HomeworkList;