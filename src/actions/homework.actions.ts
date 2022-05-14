import { Homework, StudentHomework } from '../models/responses/HomeworksResponse';

export const GET_STUDENT_HOMEWORK = 'homework/GET_STUDENT_HOMEWORK' as const;
export const EDIT_HOMEWORK = 'homework/EDIT_HOMEWORK' as const;
export const LOAD_ANSWER = 'homework/LOAD_ANSWER' as const;
export const LOAD_HOMEWORK_SUCCESS = 'homework/LOAD_HOMEWORK_SUCCESS' as const;
export const CLEAR_HOMEWORK = 'homework/CLEAR_HOMEWORK' as const;
export const LOAD_HOMEWORK_STARTED = 'homework/LOAD_HOMEWORK_STARTED' as const;
export const LOAD_HOMEWORK_FAIL = 'homework/LOAD_HOMEWORK_FAIL' as const;

export const loadHomeworkSuccess = (homework: Homework | undefined) => ({
  type: LOAD_HOMEWORK_SUCCESS,
  payload: homework,
});

export const editHomework = (edit: boolean) => ({
  type: EDIT_HOMEWORK,
  payload: edit,
});

export const loadAnswer = (answer: string) => ({
  type: LOAD_ANSWER,
  payload: answer,
});

export const loadStudentHomework = (studentHomework: StudentHomework | undefined) => ({
  type: GET_STUDENT_HOMEWORK,
  payload: studentHomework ?? undefined,
});

export const clearHomework = () => ({
  type: CLEAR_HOMEWORK,
});

export const loadHomeworkStarted = () => ({
  type: LOAD_HOMEWORK_STARTED,
});

export const loadHomeworkFail = (message: string) => ({
  type: LOAD_HOMEWORK_FAIL,
  payload: message,
});

export type HomeworkPageAction =
  | ReturnType<typeof loadHomeworkSuccess>
  | ReturnType<typeof loadStudentHomework>
  | ReturnType<typeof editHomework>
  | ReturnType<typeof loadAnswer>
  | ReturnType<typeof clearHomework>
  | ReturnType<typeof loadHomeworkStarted>
  | ReturnType<typeof loadHomeworkFail>;
