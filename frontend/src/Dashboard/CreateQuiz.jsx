import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function CreateQuiz(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>Add Quiz
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Add Quiz">
        <PageContent/>
      </Layout>
    </div>
);

}


export default CreateQuiz;