export const baseUrl = 'https://piter-education.ru:7070';

export const loginUrl = 'sign-in';
export const lessonsUrl = 'lessons';
export const usersUrl = 'api/Users';
export const groupUrl = 'api/Groups';
export const addNewTaskUrl = 'api/tasks/teacher';
export const addNewTaskUrlByMethodist = 'api/tasks/methodist';
export const getHomeworkById = (id: number) => `api/homeworks/${id}`;
export const postStudentAnswer = (homeworkId: number) => `api/student-homeworks/${homeworkId}`;
export const studentHomeworkById = (id: number) => `api/student-homeworks/${id}`;
export const studentHomeworksByUserId = (userId: number) =>
  `api/student-homeworks/by-user/${userId}`;
export const getHomeworksByGroupId = (groupId: number) => `api/Homeworks/by-group/${groupId}`;
export const getTasksByCourseId = (courseId: number) => `api/Tasks/by-course/${courseId}`;
export const getStudentAnswerByTaskId = (taskId: number) => `api/Tasks/${taskId}/answer`;
export const registerUrl = 'register';
export const coursesUrl = 'api/Courses';
export const updateUserUrl = (id: number) => `${usersUrl}/${id}`;
export const GroupByIdUrl = (groupId: number) => `${groupUrl}/${groupId}`;
