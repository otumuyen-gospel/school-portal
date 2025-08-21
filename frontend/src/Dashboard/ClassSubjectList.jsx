import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function ClassSubjectList(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Class Subject
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Class Subject">
        <PageContent/>
      </Layout>
    </div>
);

}


export default ClassSubjectList;