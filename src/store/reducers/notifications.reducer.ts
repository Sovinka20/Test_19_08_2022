import { Reducer } from 'redux';
import {
  LOAD_TABS,
  NotificationsPageAction,
  SELECT_TAB,
} from '../../actions/notifications.actions';
import { TabData } from '../../models/TabData';
import { Icon } from '../../shared/enums/Icon';

const tabsMock = [
  {
    id: 1,
    text: 'Tab 1',
    icon: Icon.Cake,
  },
  {
    id: 2,
    text: 'Tab 2',
    icon: Icon.Cookie,
  },
  {
    id: 3,
    text: 'Tab Comp',
    icon: Icon.Computer,
  },
];

export interface NotificationsPageState {
  tabs: TabData[];
  selectedTab: number;
}

const initialState: NotificationsPageState = {
  tabs: [],
  selectedTab: 1,
};

export const notificationsPageReducer: Reducer<
  NotificationsPageState,
  NotificationsPageAction
> = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_TAB: {
      return {
        ...state,
        selectedTab: action.payload,
      };
    }
    case LOAD_TABS: {
      return {
        ...state,
        tabs: tabsMock,
      };
    }
    default:
      return state;
  }
};
