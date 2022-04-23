export interface Homework {
  id: number;
  startDate: string;
  endDate: string;
  task: Task;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  links: string;
  isRequired: boolean;
  isDeleted: boolean;
}

export interface StudentHomework {
  id: number;
  answer: string;
  studentHomeworkStatus: StudentHomeworkStatus;
  completedDate: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  };
  isDeleted: boolean;
  homework: Homework;
}

export enum StudentHomeworkStatus {
  Unchecked = 'Unchecked',
  NotDone = 'NotDone',
}

export interface HomeworkData {
  id: number;
  taskNumber: number;
  title: string;
  startDate: string;
  endDate: string;
  status: StudentHomeworkStatus;
  elseData: string;
}
