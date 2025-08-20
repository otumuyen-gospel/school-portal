import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Auth/Login';
import Password from './Auth/Password';
import ProtectedRoute from './Auth/ProtectedRoute';
import Request from './Auth/Request';
import Verify from './Auth/Verify';
import ClassUsers from './Dashboard/ClassUsers';
import Dashboard from './Dashboard/Dashboard';
import Profile from './Dashboard/Profile';
import Register from './Dashboard/Register';
import Schedule from './Dashboard/Schedule';
import UserLists from './Dashboard/UserLists';

function App() {
  return <Routes>
    {/* add all unprotected routes here */}
    <Route path="/" element={<Login />} />
    <Route path="/password" element={<Password />} />
    <Route path="/verify" element={<Verify />} />
    <Route path="/request" element={<Request />} />
    
    {/* add all protected routes here*/}
     <Route path="/dashboard" element={
      
        <Dashboard />
      
     } />
     <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
     } />
     <Route path="/schedule" element={
      <ProtectedRoute>
        <Schedule />
      </ProtectedRoute>
     } />
     <Route path="/register" element={
      <ProtectedRoute>
        <Register/>
      </ProtectedRoute>
     } />
     <Route path="/classUsers" element={
      <ProtectedRoute>
        <ClassUsers />
      </ProtectedRoute>
     } />
     <Route path="/userLists" element={
      <ProtectedRoute>
        <UserLists />
      </ProtectedRoute>
     } />
  </Routes>
}

export default App;
