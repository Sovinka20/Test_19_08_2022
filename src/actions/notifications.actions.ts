import { NotificationData } from '../pages/NotificationsPage/components/NotificationsCard';

export const SET_NOTIFICATIONS = 'notifications/SET_NOTIFICATIONS' as const;
export const FILTER_NOTIFICATIONS = 'notifications/FILTER_NOTIFICATIONS' as const;

export const setNotifications = (notifications: NotificationData[]) => ({
  type: SET_NOTIFICATIONS,
  payload: notifications,
});

export const filterNotification = (notifications: NotificationData[]) => ({
  type: FILTER_NOTIFICATIONS,
  payload: notifications,
});

export type NotificationsPageActions =
  | ReturnType<typeof setNotifications>
  | ReturnType<typeof filterNotification>;
