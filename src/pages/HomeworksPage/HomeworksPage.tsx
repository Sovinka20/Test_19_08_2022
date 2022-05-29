import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadHomeworkPageTabsCourses, selectTab } from '../../actions/homeworks.actions';
import { loadHomeworks, loadTasksByCourse } from '../../actions/homeworks.thunks';
import { TabContainer } from '../../components/TabContainer/TabContainer';
import { AppState } from '../../store/store';
import { HomeworkCard } from './components/HomeworkCard';
import { LoginPageState } from '../../store/reducers/login.reducer';
import { UserRole } from '../../shared/enums/UserRole';
// import { loadCourses } from '../../actions/courses.actions';
import { CourseResponse } from '../../models/responses/CourseResponse';
import { TaskCard } from './components/TaskCard';
// import { Task } from '../../models/responses/HomeworksResponse';
// import { selectTabCoursePage } from '../../actions/courses.actions';
// import { baseWretch } from '../../services/base-wretch.service';
export const HomeworksPage = () => {
  const dispatch = useDispatch();
  const { tabs, selectedTab, tasks, homeworks } = useSelector(
    (state: AppState) => state.homeworksPageState
  );
  const { task } = useSelector((state: AppState) => state.homeworkPageState);
  const { currentRole } = useSelector((state: AppState) => state.loginPageState as LoginPageState);
  const { courses } = useSelector((state: AppState) => state.coursesPageState);
  useEffect(() => {
    if (courses && courses?.length > 0)
      if (currentRole == UserRole.Methodist) {
        dispatch(loadHomeworkPageTabsCourses(courses as CourseResponse[]));
      }
  }, [courses]);

  useEffect(() => {
    if (selectedTab > 0 && currentRole != UserRole.Methodist) {
      dispatch(loadHomeworks(selectedTab));
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab > 0 && currentRole == UserRole.Methodist) {
      dispatch(loadTasksByCourse(selectedTab));
    }
  }, [selectedTab]);
  useEffect(() => {
    if (selectedTab > 0 && currentRole == UserRole.Methodist) {
      dispatch(loadTasksByCourse(selectedTab));
    }
  }, [task]);
  return (
    <>
      <div>
        <TabContainer tabContainerData={tabs} selectedTab={selectedTab} onClick={selectTab} />
        {currentRole == UserRole.Methodist ? (
          tasks && tasks.length > 0 ? (
            tasks?.map((tsk) => <TaskCard data={tsk} key={tsk.id} />)
          ) : (
            <span className="lack-of-homeworks">Домашних заданий еще нет</span>
          )
        ) : homeworks && homeworks.length > 0 ? (
          homeworks.map((hwk) => <HomeworkCard data={hwk} key={hwk.id} />)
        ) : (
          <span className="lack-of-homeworks">Домашних заданий еще нет</span>
        )}
      </div>
    </>
  );
};
