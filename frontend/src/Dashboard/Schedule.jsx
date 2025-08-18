import Container from "@mui/material/Container";
import Layout from "../Util/Layout";
function Schedule(){
  const PageContent = (props)=>{
    return (
      <Container sx={{
        marginLeft:props.marginLeft,
        width:props.width,
        }}>
        <h1>Schedule</h1>
      </Container>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Schedule">
        <PageContent/>
      </Layout>
    </div>
);

}


export default Schedule;