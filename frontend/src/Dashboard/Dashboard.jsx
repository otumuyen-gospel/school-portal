import Header from "../Util/Header";
import Sidebar from "../Util/Sidebar";
function Dashboard(){
  return (
    <div sx={{backgroundColor:"#EEF"}}>
      <Header title="Dashboard"/>
      <Sidebar />
      <ul>
            {new Array(500).fill(null).map((v, i) => (
                <li key={i}>{i}</li>
            ))}
        </ul>
    </div>
);

}

export default Dashboard;