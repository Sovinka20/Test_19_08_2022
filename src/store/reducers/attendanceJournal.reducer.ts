import { TabData } from '../../models/TabData';
import { Reducer } from 'redux';
import {
  AttendanceJournalActions,
  FILTER_STUDENTS_LIST,
  LOAD_ATTENDANCE,
  LOAD_ATTENDANCE_FAIL,
  LOAD_ATTENDANCE_STARTED,
  LOAD_ATTENDANCE_SUCCESS,
  LOAD_TABS,
  SELECT_TAB,
} from '../../actions/attendanceJournal.actions';

export type AttendanceJournalState = {
  tabs?: TabData[];
  selectedTab: number;
  attendanceData?: any[];
  filteredStudentList?: any[];
  isLoad: boolean;
  error?: string;
};

export const initialState: AttendanceJournalState = {
  tabs: [],
  selectedTab: -1,
  attendanceData: undefined,
  filteredStudentList: undefined,
  isLoad: false,
  error: undefined,
};

export const attendanceJournalReducer: Reducer<AttendanceJournalState, AttendanceJournalActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case LOAD_TABS:
      return {
        ...state,
        tabs: action.payload,
        selectedTab: action.payload[0].id,
      };
    case SELECT_TAB:
      return {
        ...state,
        selectedTab: action.payload,
      };
    case LOAD_ATTENDANCE:
      return {
        ...state,
        attendanceData: action.payload,
        filteredStudentList: action.payload[0].students,
        isLoad: false,
        error: undefined,
      };
    case FILTER_STUDENTS_LIST:
      return {
        ...state,
        filteredStudentList: action.payload,
      };
    case LOAD_ATTENDANCE_STARTED:
      return {
        ...state,
        isLoad: true,
      };
    case LOAD_ATTENDANCE_SUCCESS:
      return {
        ...state,
        isLoad: false,
        error: undefined,
      };
    case LOAD_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoad: false,
      };
    default:
      return state;
  }
};
