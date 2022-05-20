export const baseUrl = 'https://piter-education.ru:7070';

export const loginUrl = 'sign-in';
export const lessonsUrl = 'lessons';
export const usersUrl = 'api/Users';
export const groupUrl = 'api/Groups';
export const addNewTaskUrl = 'api/tasks/teacher';
export const getHomeworkById = (id: number) => `api/homeworks/${id}`;
export const postStudentAnswer = (homeworkId: number) => `api/student-homeworks/${homeworkId}`;
export const studentHomeworkById = (id: number) => `api/student-homeworks/${id}`;
export const studentHomeworksByUserId = (userId: number) =>
  `api/student-homeworks/by-user/${userId}`;
export const getHomeworksByGroupId = (groupId: number) => `api/Homeworks/by-group/${groupId}`;
export const getStudentAnswerByTaskId = (taskId: number) => `api/Tasks/${taskId}/answer`;
export const registerUrl = 'register';
export const coursesUrl = 'api/Courses';
export const GroupByIdUrl = (groupId: number) => `${groupUrl}/${groupId}`;
export const updateUserUrl = (id: number) => `api/Users/${id}`;
export const updatePassword = 'api/Users/password';
