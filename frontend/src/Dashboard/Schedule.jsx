import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function Schedule(){
  const PageContent = (props)=>{
    return (
       <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Schedules
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Schedules">
        <PageContent/>
      </Layout>
    </div>
);

}


export default Schedule;