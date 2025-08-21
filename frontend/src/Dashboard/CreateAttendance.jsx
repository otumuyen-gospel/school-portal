import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function CreateAttendance(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Add New Attendance
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Add New Attendance">
        <PageContent/>
      </Layout>
    </div>
);

}


export default CreateAttendance;