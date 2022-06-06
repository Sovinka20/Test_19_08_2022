import { useEffect, useState } from 'react';
import './AllUsersPage.scss';
import { UserRow, UserRowModel } from './components/UserRow';
import { FilterItem, FilterList } from '../../components/FilterList/FilterList';
import { UserRole } from '../../shared/enums/UserRole';
import { AllUsersPageState } from '../../store/reducers/allUsers.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import { onUsersLoad } from '../../actions/allUsers.thunk';

export interface UsersResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  phoneNumber: string;
  roles: UserRole[];
}

const roleFilterData: FilterItem[] = [
  { id: 7, name: 'Все' },
  { id: 1, name: 'Администратор' },
  { id: 2, name: 'Менеджер' },
  { id: 3, name: 'Методист' },
  { id: 4, name: 'Студент' },
  { id: 5, name: 'Учитель' },
  { id: 6, name: 'Тьютор' },
];

export const AllUsersPage = () => {
  const { userList } = useSelector(
    (state: AppState) => state.allUsersPageState as AllUsersPageState
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onUsersLoad());
    console.log(userList.values);
  }, []);

  const [listState] = useState<UserRowModel[]>(userList);
  const [filterRoleId, setFilterRoleId] = useState<UserRole>(UserRole.DefaultRole);
  const [filtredList, setFilteredList] = useState<UserRowModel[]>(userList);

  const FilterByRole = () => {
    const filtered = listState.filter(
      (item) =>
        filterRoleId === UserRole.DefaultRole ||
        (filterRoleId === UserRole.Admin && item.role.includes(filterRoleId))
    );
    filtered.map((i) => console.log(i.role));
    setFilteredList(filtered);
    console.log(filtered);
    console.log(filterRoleId);
  };

  useEffect(() => FilterByRole(), [filterRoleId]);

  const applyRoleFilter = (item: FilterItem) => {
    setFilterRoleId(item.id);
  };

  return (
    <>
      <div className="content-container">
        <div className="head-row">
          <div className="user-name">ФИО Пользователя</div>
          <div className="user-role">Роль</div>
          <div>
            <input type="search" placeholder="Поиск" />
          </div>
        </div>
        <div className="role-filter-row">
          Выберите роль <FilterList data={roleFilterData} callback={applyRoleFilter} />
        </div>

        <div>
          {filtredList.map((item) => (
            <UserRow data={item} />
          ))}
        </div>
      </div>
    </>
  );
};
