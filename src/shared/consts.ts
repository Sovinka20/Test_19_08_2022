export const baseUrl = 'https://piter-education.ru:7070';

export const loginUrl = 'sign-in';
export const lessonsUrl = 'lessons';
export const addNewTaskUrl = 'api/tasks/teacher';
export const getHomeworksByGroupId = (groupId: number) => {
  return `api/Homeworks/by-group/${groupId}`;
};
export const getHomeworkById = (id: number) => `api/homeworks/${id}`;
export const postStudentAnswer = (homeworkId: number) =>
  `api/student-homeworks/${homeworkId}`;
export const studentHomeworkById = (id: number) =>
  `api/student-homeworks/${id}`;
export const studentHomeworksByUserId = (userId: number) => {
  return `api/student-homeworks/by-user/${userId}`;
};
export const registerUrl = 'register';
