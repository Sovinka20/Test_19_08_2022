import './App.scss';
import { Route, Routes } from "react-router-dom";
import { HomeworksPage } from './pages/HomeworksPage/HomeworksPage';
import { LessonsPage } from './pages/LessonsPage/LessonsPage';
import { NotificationsPage } from './pages/NotificationsPage/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage/RegistrationPage';
import {MainPanel} from './components/MainPanel/MainPanel';
import {CoursesPage} from "./pages/CoursesPage/CoursesPage";
import {EditCoursesPage} from "./pages/CoursesPage/EditCoursesPage";
import {IssuingHomework} from "./pages/IssuingHomework/IssuingHomework";
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './actions/login.actions';
import { UserResponse } from './models/responses/UserResponse';
import { baseWretch } from './services/base-wretch.service';
import { useEffect } from 'react';
import { loadLessonPageTabs } from './actions/lessons.actions';
import { GroupResponse } from './models/responses/GroupResponse';


function App() {

  const dispatch = useDispatch();
  const getUser = () => {baseWretch()
  .url('api/Users/self')
  .get()
  .json(data => {
    const user = data as UserResponse;
    dispatch(setCurrentUser(user));
    dispatch(loadLessonPageTabs(user?.groups));
  });
  }
  ////////////////////////////////////////////////////////--- MOCK: to delete 
  // const getUser = () => {
  //   const user = {
  //     id: 0,
  //     firstName: "string",
  //     lastName: "string",
  //     roles: ["student"],
  //     groups: [
  //       {
  //         id: 1,
  //         name: '1',
  //         course: {id:1, name: "Базовый курс", isDeleted: false},
  //       },
  //       {
  //         id: 2,
  //         name: '2',
  //         course: {id:2, name: "QA automation", isDeleted: false},
  //       },
  //     ]
  //   }
  //   dispatch(setCurrentUser(user as UserResponse));
  //   dispatch(loadLessonPageTabs(user?.groups as GroupResponse[]));
  // }
////////////////////////////////////////////////////////--- MOCK: to delete 
  useEffect(() => {
    getUser();
  }, []);
  
  return (
     
    <div className='flex-container'>
      <MainPanel/>
      <main>
        <Routes>
          <Route path="/" element={<NotificationsPage />} />
          <Route path="homeworks" element={<HomeworksPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="edit-courses" element={<EditCoursesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="issuing-homework" element={<IssuingHomework />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
