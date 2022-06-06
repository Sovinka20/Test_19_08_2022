import React, { useEffect, useState } from 'react';
import { FilterItem, FilterList } from '../../components/FilterList/FilterList';
import { baseWretch } from '../../services/base-wretch.service';
import { studentsUrl } from '../../shared/consts';
import { groupsUrl } from '../../shared/consts';
import { StudentRow } from './components/StudentsGroupChangingRow';
import './StudentsListPage.scss';

const surnameFilterData: FilterItem[] = [
  { id: 1, name: 'Сортировать по фамилии' },
  { id: 2, name: 'Сортировать обратно' },
];

const groupFilterData: FilterItem[] = [
  { id: 0, name: 'Показать все' },
  { id: 1, name: 'Без группы' },
  { id: 2, name: 'Группа 1' },
  { id: 3, name: 'Группа 2' },
];

export type Group = {
  id: number;
  name: string;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  groups: Group[];
  phoneNumber: string;
  email: string;
};

export type StudentToShow = {
  id: number;
  firstName: string;
  lastName: string;
  group: Group | undefined;
  groups: Group[];
  phoneNumber: string;
  email: string;
};

export const StudentsListPage = () => {
  const [students, setStudents] = useState<StudentToShow[]>([]);
  const [filterSurnameValue, setFilterSurnameValue] = useState(1);
  const [filterGroupValue, setFilterGroupValue] = useState(0);
  const [filtredList, setFiltredList] = useState<StudentToShow[]>(students);
  const [groups, setGroups] = useState<Group[]>();

  async function getData() {
    const studentsList: StudentToShow[] = await baseWretch()
      .url(studentsUrl)
      .get()
      .json((data) => {
        const respData: Student[] = data as Student[];
        return respData.map<StudentToShow>((s) => {
          return {
            ...s,
            group: s.groups?.length ? s.groups[0] : undefined,
            groups: s.groups?.length ? s.groups : [{ id: 0, name: 'Без группы' }],
          };
        });
      });
    setStudents(studentsList);
  }
  async function getGroups() {
    const groupsList: Group[] = await baseWretch()
      .url(groupsUrl)
      .get()
      .json((data) => {
        const respData: Group[] = data as Group[];
        return respData;
      });
    setGroups(groupsList);
  }

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getGroups();
  }, []);
  useEffect(() => {
    setFiltredList(students);
  }, [students]);

  const applySurnameSorting = () => {
    if (filterSurnameValue == 1) {
      const sortedForward = filtredList.sort(function (prev, next) {
        if (prev.lastName < next.lastName) {
          return -1;
        }
        if (prev.lastName > next.lastName) {
          return 1;
        } else {
          return 0;
        }
      });
      setStudents(sortedForward);
      setFiltredList(sortedForward);
    }
    if (filterSurnameValue == 2) {
      const sortedBackward = filtredList.sort(function (prev, next) {
        if (prev.lastName > next.lastName) {
          return -1;
        }
        if (prev.lastName < next.lastName) {
          return 1;
        } else {
          return 0;
        }
      });
      setStudents(sortedBackward);
      setFiltredList(sortedBackward);
    }
  };

  useEffect(() => applySurnameSorting(), [filterSurnameValue]);

  const applySurnameFilter = (item: FilterItem) => {
    setFilterSurnameValue(item.id);
  };

  const FilterByGroup = () => {
    const filtered = students.filter(
      (s) =>
        filterGroupValue === 0 ||
        (filterGroupValue > 1 && s.groups[0].id === filterGroupValue) ||
        (!s.group && filterGroupValue === 1)
    );
    setFiltredList(filtered);
  };

  useEffect(() => FilterByGroup(), [filterGroupValue]);

  const applyGroupFilter = (item: FilterItem) => {
    setFilterGroupValue(item.id);
  };

  const changeGroup = (studentId: number, groupId: number) => {
    const studentIndex = students.findIndex((item) => item.id == studentId);
    if (students[studentIndex].groups[0].id) {
      students[studentIndex].groups[0].id = groupId;
    }
    setStudents([...students]);
  };

  return (
    <div className="content-container">
      <div className="group-table-wrapper">
        <div className="groups-table-header group-table-grid-container">
          <span>ФИО студента</span>
          <span>E-mail</span>
          <span>Телефон</span>
          <span className="group-column">Группа</span>
        </div>
      </div>
      <div className="group-table-wrapper">
        <div className="group-table-flex-container filters-row">
          <FilterList data={surnameFilterData} callback={applySurnameFilter} />
          <div className="group-column">
            <FilterList data={groupFilterData} callback={applyGroupFilter} />
          </div>
        </div>
      </div>
      <div>
        {filtredList.map((item) => (
          <StudentRow data={item} changeGroupId={changeGroup} />
        ))}
      </div>
    </div>
  );
};

