import { Reducer } from 'react';
import {
  FILTER_LESSONS,
  LessonsPageActions,
  LOAD_LESSONS,
  SELECT_TAB,
  LOAD_TABS,
} from '../../actions/lessons.actions';
import { LessonResponse } from '../../models/responses/LessonResponse';
import { TabData } from '../../models/TabData';
import { CourseName, getCourseIcon } from '../../shared/helpers/iconHelpers';

export interface LessonsPageState {
  filteredLessons: LessonResponse[];
  tabs?: TabData[];
  selectedTab: number;
  lessons?: LessonResponse[];
}

export const initialState: LessonsPageState = {
  filteredLessons: [],
  lessons: [],
  tabs: [],
  selectedTab: -1,
};

export const lessonsPageReducer: Reducer<LessonsPageState | undefined, LessonsPageActions> = (
  state: LessonsPageState | undefined = initialState,
  action
) => {
  switch (action.type) {
    case FILTER_LESSONS:
      return {
        ...state,
        filteredLessons: action.payload,
      };
    case SELECT_TAB: {
      return {
        ...state,
        selectedTab: action.payload,
      };
    }
    case LOAD_TABS: {
      const tabs: TabData[] = action.payload.map((group) => {
        const tabData: TabData = {
          id: group.id,
          text: group.course.name,
          icon: getCourseIcon(group.course.name as CourseName),
        };
        return tabData;
      });

      return {
        ...state,
        tabs: tabs,
        selectedTab: tabs[0]?.id,
      };
    }
    case LOAD_LESSONS: {
      return {
        ...state,
        lessons: action.payload,
      };
    }
    default:
      return state;
  }
};
