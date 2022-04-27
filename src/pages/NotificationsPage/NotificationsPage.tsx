import senderPhoto from './images/avatar.png';
import { NotificationsCard } from '../NotificationsPage/components/NotificationsCard';
import { FilterItem, FilterList } from '../../components/FilterList/FilterList';
import React from 'react';
const notifications = [
  {
    id: 1,
    senderPhoto: senderPhoto,
    sender: 'Антон Ефременков',
    senderRole: 'предподаватель',
    message:
      'Идейные соображения высшего порядка, а также укрепление и развитие структуры играет важную роль в формировании...',
    date: '12.02.22',
    time: ' 12:34',
  },
  {
    id: 2,
    senderPhoto: senderPhoto,
    sender: 'Антон Ефременков',
    senderRole: 'предподаватель',
    message:
      'Повседневная практика показывает, что укрепление и развитие структуры обеспечивает широкому кругу (специалистов) участие в формировании...',
    date: '10.02.22',
    time: '10:02',
  },
  {
    id: 3,
    senderPhoto: senderPhoto,
    sender: 'Антон Ефременков',
    senderRole: 'предподаватель',
    message:
      'Равным образом рамки и место обучения кадров влечет за собой процесс внедрения и модернизации системы обучения кадров...',
    date: '12.02.22',
    time: '19:10',
  },
];
const notificationsFilterData: FilterItem[] = [
  { id: 1, name: 'Все' },
  { id: 2, name: 'Непрочитанные' },
];
export const NotificationsPage = () => {
  return (
    <>
      <FilterList data={notificationsFilterData} />
      <div className="card-container content-container">
        {notifications.map((item) => (
          <NotificationsCard data={item} key={item.id}></NotificationsCard>
        ))}
      </div>
    </>
  );
};
