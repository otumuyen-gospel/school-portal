import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Auth/Login';
import Password from './Auth/Password';
import ProtectedRoute from './Auth/ProtectedRoute';
import Request from './Auth/Request';
import Verify from './Auth/Verify';
import Attendance from './Dashboard/Attendance';
import ClassAttendance from './Dashboard/ClassAttendance';
import ClassComplaintList from "./Dashboard/ClassComplaintList";
import ClassHomeworkList from "./Dashboard/ClassHomeworkList";
import ClassList from './Dashboard/ClassLists';
import ClassMarks from "./Dashboard/ClassMarks";
import ClassQuiz from "./Dashboard/ClassQuiz";
import ClassSubjectList from './Dashboard/ClassSubjectList';
import ClassUsers from './Dashboard/ClassUsers';
import ComplaintList from "./Dashboard/ComplaintList";
import CreateClass from './Dashboard/CreateClass';
import CreateComplaint from "./Dashboard/CreateComplaint";
import CreateHomework from "./Dashboard/CreateHomework";
import CreateMarks from "./Dashboard/CreateMarks";
import CreateQuiz from "./Dashboard/CreateQuiz";
import CreateSchedule from './Dashboard/CreateSchedule';
import CreateSubject from './Dashboard/CreateSubject';
import Dashboard from './Dashboard/Dashboard';
import HomeworkList from "./Dashboard/HomeworkList";
import MarkList from "./Dashboard/MarkList";
import Profile from './Dashboard/Profile';
import QuizList from "./Dashboard/QuizList";
import Register from './Dashboard/Register';
import ScheduleList from './Dashboard/ScheduleList';
import SubjectList from './Dashboard/SubjectList';
import UpdateComplaint from './Dashboard/updateComplaint';
import UpdateHomework from './Dashboard/updateHomework';
import UpdateMark from './Dashboard/updateMark';
import UpdateQuiz from './Dashboard/updateQuiz';
import UpdateSchedule from './Dashboard/updateSchedule';
import UpdateUser from './Dashboard/updateUser';
import UserAttendance from "./Dashboard/UserAttendance";
import UserComplaintList from "./Dashboard/UserComplaintList";
import UserHomeworkList from "./Dashboard/UserHomeworkList";
import UserLists from './Dashboard/UserLists';
import UserMarks from "./Dashboard/UserMarks";
import UserQuiz from "./Dashboard/UserQuiz";
import UserSchedule from "./Dashboard/UserSchedule";
function App() {
  return <Routes>
    {/* add all unprotected routes here */}
    <Route path="/" element={<Login />} />
    <Route path="/password" element={<Password />} />
    <Route path="/verify" element={<Verify />} />
    <Route path="/request" element={<Request />} />
    
    {/* add all protected routes here*/}
     <Route path="/dashboard" element={
      <ProtectedRoute>
         <Dashboard />
      </ProtectedRoute>
      
     } />
     <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
     } />
     <Route path="/register" element={
      <ProtectedRoute>
        <Register/>
      </ProtectedRoute>
     } />
     <Route path="/class-users" element={
      <ProtectedRoute>
        <ClassUsers />
      </ProtectedRoute>
     } />
     <Route path="/user-lists" element={
      <ProtectedRoute>
        <UserLists />
      </ProtectedRoute>
     } />
     
      <Route path="/user-update" element={
      <ProtectedRoute>
        <UpdateUser/>
      </ProtectedRoute>
     } />

     <Route path="/class-attendance" element={
      <ProtectedRoute>
        <ClassAttendance />
      </ProtectedRoute>
     } />
     
     <Route path="/my-attendance" element={
      <ProtectedRoute>
        <UserAttendance/>
      </ProtectedRoute>
     } />

     <Route path="/attendance-lists" element={
      <ProtectedRoute>
        <Attendance />
      </ProtectedRoute>
     } />
     <Route path="/create-class" element={
      <ProtectedRoute>
        <CreateClass />
      </ProtectedRoute>
     } />
     <Route path="/class-lists" element={
      <ProtectedRoute>
        <ClassList />
      </ProtectedRoute>
     } />
     <Route path="/class-complaint-list" element={
      <ProtectedRoute>
        <ClassComplaintList />
      </ProtectedRoute>
     } />
     <Route path="/user-complaint-list" element={
      <ProtectedRoute>
        <UserComplaintList />
      </ProtectedRoute>
     } />
     <Route path="/complaint-update" element={
      <ProtectedRoute>
        <UpdateComplaint />
      </ProtectedRoute>
     } />
     <Route path="/complaint-list" element={
      <ProtectedRoute>
        <ComplaintList />
      </ProtectedRoute>
     } />
     <Route path="/create-complaint" element={
      <ProtectedRoute>
        <CreateComplaint />
      </ProtectedRoute>
     } />

     <Route path="/class-homework-list" element={
      <ProtectedRoute>
        <ClassHomeworkList />
      </ProtectedRoute>
     } />
     <Route path="/user-homework-list" element={
      <ProtectedRoute>
        <UserHomeworkList />
      </ProtectedRoute>
     } />
     <Route path="/homework-list" element={
      <ProtectedRoute>
        <HomeworkList />
      </ProtectedRoute>
     } />
      <Route path="/homework-update" element={
      <ProtectedRoute>
        <UpdateHomework />
      </ProtectedRoute>
     } />
     <Route path="/create-homework" element={
      <ProtectedRoute>
        <CreateHomework />
      </ProtectedRoute>
     } />

     <Route path="/class-marks" element={
      <ProtectedRoute>
        <ClassMarks />
      </ProtectedRoute>
     } />
     <Route path="/mark-update" element={
      <ProtectedRoute>
        <UpdateMark/>
      </ProtectedRoute>
     } />
     <Route path="/user-marks" element={
      <ProtectedRoute>
        <UserMarks />
      </ProtectedRoute>
     } />
     <Route path="/mark-list" element={
      <ProtectedRoute>
        <MarkList />
      </ProtectedRoute>
     } />
     <Route path="/create-marks" element={
      <ProtectedRoute>
        <CreateMarks />
      </ProtectedRoute>
     } />

     <Route path="/class-subject-list" element={
      <ProtectedRoute>
        <ClassSubjectList />
      </ProtectedRoute>
     } />
     <Route path="/subject-list" element={
      <ProtectedRoute>
        <SubjectList />
      </ProtectedRoute>
     } />
     <Route path="/create-subject" element={
      <ProtectedRoute>
        <CreateSubject />
      </ProtectedRoute>
     } />

     <Route path="/schedule-list" element={
      <ProtectedRoute>
        <ScheduleList />
      </ProtectedRoute>
     } />
     <Route path="/create-schedule" element={
      <ProtectedRoute>
        <CreateSchedule />
      </ProtectedRoute>
     } />

      <Route path="/schedule-update" element={
      <ProtectedRoute>
        <UpdateSchedule/>
      </ProtectedRoute>
     } />

     <Route path="/user-schedule" element={
      <ProtectedRoute>
        <UserSchedule/>
      </ProtectedRoute>
     } />

     <Route path="/class-quiz" element={
      <ProtectedRoute>
        <ClassQuiz />
      </ProtectedRoute>
     } />
      <Route path="/update-quiz" element={
      <ProtectedRoute>
        <UpdateQuiz />
      </ProtectedRoute>
     } />
     <Route path="/user-quiz" element={
      <ProtectedRoute>
        <UserQuiz />
      </ProtectedRoute>
     } />
     <Route path="/quiz-list" element={
      <ProtectedRoute>
        <QuizList />
      </ProtectedRoute>
     } />

     <Route path="/create-quiz" element={
      <ProtectedRoute>
        <CreateQuiz />
      </ProtectedRoute>
     } />
     
  </Routes>
}

export default App;
