import Container from "@mui/material/Container";
import Layout from "../Util/Layout";
function Dashboard(){
  const PageContent = (props)=>{
    return (
      <Container sx={{
        marginLeft:props.marginLeft,
        width:props.width,
        }}>
        <ul>
          {new Array(500).fill(null).map((v, i) => (
             <li key={i}>{i}</li>
        ))}
       </ul>
      </Container>
    );
  }
  return (
    <div className="dashboard">
      <Layout title="Dashboard">
        <PageContent/>
      </Layout>
    </div>
);

}


export default Dashboard;