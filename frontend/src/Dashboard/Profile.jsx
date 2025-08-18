import Header from "../Util/Header";
import Sidebar from "../Util/Sidebar";
function Profile(){
  return (
    <div sx={{backgroundColor:"#EEF"}}>
      <Header title="Profile"/>
      <Sidebar />
      <h1>Profile Page</h1>
    </div>
);

}

export default Profile;