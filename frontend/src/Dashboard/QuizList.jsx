import Box from "@mui/material/Box";
import Layout from "../Util/Layout";
function QuizList(){
  const PageContent = (props)=>{
    return (
      <Box marginLeft={props.marginLeft}
       marginRight={props.marginRight}
       width={props.width}
       sx={{
        minHeight:"100vh",
        }}>
        <h1>All Quizzes
        </h1>
      </Box>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="All Quizzes">
        <PageContent/>
      </Layout>
    </div>
);

}


export default QuizList;