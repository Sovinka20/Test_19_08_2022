import './NewGroupPage.scss';
import '../../components/InputTextarea/InputTextarea.scss';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { baseWretch } from '../../services/base-wretch.service';
import { Button, ButtonModel, ButtonType } from '../../components/Button/Button';
import { CheckboxGroup } from '../../components/CheckBoxGroup/CheckBoxGroup';
import {
  addUserInGroup,
  // changeGroupStatus,
  deleteUserFromGroup,
  groupByIdUrl,
  groupUrl,
} from '../../shared/consts';
import { FilterItem, FilterList } from '../../components/FilterList/FilterList';
import { CheckboxData } from '../../components/CheckBoxGroup/CheckBox/CheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { loadCoursesAndUsers, loadGroup } from '../../actions/NewGroupForm.thunks';
import { AppState } from '../../store/store';
import { NewGroupFormState } from '../../store/reducers/NewGroupForm.reducer';
import { UserRole } from '../../shared/enums/UserRole';
import { useNavigate } from 'react-router-dom';
import {
  getIdForGroup,
  getTeachersForGroup,
  getTutorsForGroup,
  resetNewGroupPage,
} from '../../actions/NewGroupForm.actions';
import { Loader } from '../HomeworksPage/HomeworkPage/Loader';
import { useParams } from 'react-router-dom';
import Datepicker from '../../components/Datepicker/Datepicker';
import { GroupResponse } from '../../models/responses/GroupResponse';
import { convertDate } from '../../shared/helpers/dateHelpers';
import { GroupStatus } from '../../shared/enums/GroupStatus';
import {
  getGroupStatusLocalName,
  getGroupStatusLocalNameReverse,
} from '../../shared/helpers/translations';
import { groupStatusEnumReverse } from '../../shared/helpers/groupStatusForEnum';

export type GroupFormData = {
  name: string;
  teacherIds: number[];
  tutorIds: number[];
  groupStatus: string;
  startDate: string;
  endDate: string;
  timetable: string;
  paymentPerMonth: number;
  courseId: number;
  paymentsCount: number;
};

export type Course = {
  id: number;
  name: string;
};

export const paymentsCount = [
  {
    id: 1,
    name: '3',
    value: 3,
  },
  {
    id: 2,
    name: '4',
    value: 4,
  },
];
export const NewGroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { group, users, courses, isLoading, teacherIdsForGroup, tutorIdsForGroup } = useSelector(
    (state: AppState) => state.newGroupFormState as NewGroupFormState
  );
  // добавить useEffect, который по id задиспетчит thunk, который получит данные о группе и запишет их в стейт этой страницы

  const methods = useForm<GroupFormData>({
    // инициализировать или этими значениями, или взятыми из стейта (в случае редактирования группы)
    defaultValues: {
      name: group?.name,
      teacherIds: teacherIdsForGroup,
      tutorIds: tutorIdsForGroup,
      courseId: group?.course.id,
      groupStatus: group ? groupStatusEnumReverse(group.groupStatus) : 'Forming',
      endDate: group?.endDate,
      startDate: group?.startDate,
      timetable: group?.timetable,
      paymentPerMonth: group?.paymentPerMonth,
      paymentsCount: group?.paymentsCount ?? 3,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (id) {
      dispatch(loadGroup(+id));
    } else {
      reset();
      dispatch(resetNewGroupPage());
    }
    dispatch(loadCoursesAndUsers());
  }, [id]);

  const tutorsForCheckbox: CheckboxData[] | undefined = users
    .filter((u) => u.roles.includes(UserRole.Tutor))
    .map((tutor) => {
      const newTutor: CheckboxData = {
        value: tutor.id,
        text: `${tutor.firstName + ' ' + tutor.lastName}`,
        isChecked: false,
      };
      return newTutor;
    });

  const teachersForCheckbox: CheckboxData[] | undefined = users
    .filter((u) => u.roles.includes(UserRole.Teacher))
    .map((teacher) => {
      const newTeacher: CheckboxData = {
        value: teacher.id,
        text: `${teacher.firstName + ' ' + teacher.lastName}`,
        isChecked: false,
      };
      return newTeacher;
    });

  const GroupStatusForFilterList = [
    {
      id: GroupStatus.Forming,
      name: getGroupStatusLocalName(GroupStatus.Forming),
      value: groupStatusEnumReverse(GroupStatus.Forming),
    },
    {
      id: GroupStatus.ReadyToStudy,
      name: getGroupStatusLocalName(GroupStatus.ReadyToStudy),
      value: groupStatusEnumReverse(GroupStatus.ReadyToStudy),
    },
    {
      id: GroupStatus.InProgress,
      name: getGroupStatusLocalName(GroupStatus.InProgress),
      value: groupStatusEnumReverse(GroupStatus.InProgress),
    },
    {
      id: GroupStatus.Completed,
      name: getGroupStatusLocalName(GroupStatus.Completed),
      value: groupStatusEnumReverse(GroupStatus.Completed),
    },
  ];

  async function getDataAndGetIdOfNewGroup(data: GroupFormData) {
    if (typeof data.teacherIds === 'string') data.teacherIds = [+data.teacherIds];
    data.startDate = convertDate(data.startDate);
    data.endDate = convertDate(data.endDate);
    const createdGroup = await baseWretch().url(groupUrl).post(data);
    console.log(createdGroup);
    const idLastGroups: number = await baseWretch()
      .url(groupUrl)
      .get()
      .json((dataGroups) => {
        const idLast: number = (dataGroups as GroupResponse[])[dataGroups.length - 1].id;
        return idLast;
      });
    console.log(idLastGroups);
    let role = 'Teacher';
    await data.teacherIds.map((teacher) => {
      baseWretch().url(addUserInGroup(idLastGroups, teacher, role)).post();
    });
    role = 'Tutor';
    await data.tutorIds.map((tutor) => {
      baseWretch().url(addUserInGroup(idLastGroups, tutor, role)).post();
    });
    dispatch(getIdForGroup(idLastGroups));
  }

  const deleteGroup = (groupId: number) => {
    baseWretch().url(groupByIdUrl(groupId)).delete();
  };

  // async function updateGroup(idGroup: number, data: GroupFormData) {
  //   const role = 'Teacher';
  //   // if (group?.teachers.length !== 0 && teacherIdsForGroup !== data.teacherIds) {
  //   if (group?.teachers.length !== 0) {
  //     await group?.teachers.map((teacher) => {
  //       baseWretch()
  //         .url(deleteUserFromGroup(idGroup, +teacher.id))
  //         .delete();
  //     });
  //   }
  //   dispatch(getTeachersForGroup(data.teacherIds));
  //   if (teacherIdsForGroup.length !== 0) {
  //     await teacherIdsForGroup.map((teacher) => {
  //       baseWretch().url(addUserInGroup(idGroup, teacher, role)).post();
  //     });
  //   }

  //   const roleForTutor = 'Tutor';
  //   // if (group?.tutors.length !== 0 && tutorIdsForGroup !== data.tutorIds) {
  //   if (group?.tutors.length !== 0) {
  //     await group?.tutors.map((tutor) => {
  //       baseWretch()
  //         .url(deleteUserFromGroup(idGroup, +tutor.id))
  //         .delete();
  //     });
  //   }
  //   dispatch(getTutorsForGroup(data.tutorIds));
  //   if (tutorIdsForGroup.length !== 0) {
  //     await tutorIdsForGroup.map((tutor) => {
  //       baseWretch().url(addUserInGroup(idGroup, tutor, roleForTutor)).post();
  //     });
  //   }
  //   const updateGroupData = await baseWretch().url(groupByIdUrl(idGroup)).put(data);
  //   console.log(updateGroupData);
  // }

  // const updateGroupStatus = (groupId: number, statusId: number) => {
  //   if (group?.groupStatus !== statusId) {
  //     const status: string = groupStatusEnumReverse(statusId);
  //     baseWretch().url(changeGroupStatus(groupId, status)).patch();
  //   }
  // };
  function updateGroup(idGroup: number, data: GroupFormData) {
    data.groupStatus = getGroupStatusLocalNameReverse(data.groupStatus);
    if (data.endDate !== group?.endDate) {
      data.endDate = convertDate(data.endDate);
    }
    if (data.startDate !== group?.startDate) {
      data.startDate = convertDate(data.startDate);
    }
    const role = 'Teacher';
    if (group?.teachers.length !== 0) {
      group?.teachers.map((teacher) => {
        baseWretch()
          .url(deleteUserFromGroup(idGroup, +teacher.id))
          .delete();
      });
    }
    dispatch(getTeachersForGroup(data.teacherIds));
    if (teacherIdsForGroup.length !== 0) {
      teacherIdsForGroup.map((teacher) => {
        baseWretch().url(addUserInGroup(idGroup, teacher, role)).post();
      });
    }

    const roleForTutor = 'Tutor';
    if (group?.tutors.length !== 0) {
      group?.tutors.map((tutor) => {
        baseWretch()
          .url(deleteUserFromGroup(idGroup, +tutor.id))
          .delete();
      });
    }
    dispatch(getTutorsForGroup(data.tutorIds));
    if (tutorIdsForGroup.length !== 0) {
      tutorIdsForGroup.map((tutor) => {
        baseWretch().url(addUserInGroup(idGroup, tutor, roleForTutor)).post();
      });
    }
    const updateGroupData = baseWretch().url(groupByIdUrl(idGroup)).put(data);
    console.log(updateGroupData);
  }

  const onSubmit = (data: GroupFormData) => {
    if (typeof data.teacherIds === 'string') data.teacherIds = [+data.teacherIds];
    if (id) {
      updateGroup(+id, data);
    } else {
      getDataAndGetIdOfNewGroup(data);
      reset();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="new-group-page">
        <h2>{id ? `Редактирование группы "${group?.name}"` : 'Новая группа'}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid-container">
              <div className="form-element with-dropdown choose-course">
                Курс:
                {id ? (
                  <FilterList
                    data={courses.map((course) => {
                      const newCourse: FilterItem = {
                        id: course.id,
                        name: course.name,
                      };
                      return newCourse;
                    })}
                    selected={group?.course.id}
                    callback={(item) => setValue('courseId', item.id)}
                  />
                ) : (
                  <FilterList
                    data={courses.map((course) => {
                      const newCourse: FilterItem = {
                        id: course.id,
                        name: course.name,
                      };
                      return newCourse;
                    })}
                    placeholder="Выберите курс"
                    selected={group?.course.id}
                    callback={(item) => setValue('courseId', item.id)}
                  />
                )}
                {errors.courseId && <span>Вы не выбрали курс</span>}
              </div>
              {id && (
                <div className="form-element with-dropdown choose-status">
                  Статус группы:
                  <FilterList
                    data={GroupStatusForFilterList.map((status) => {
                      const newStatus = {
                        id: status.id,
                        name: getGroupStatusLocalName(status.id),
                      };
                      return newStatus;
                    })}
                    callback={(item) => setValue('groupStatus', item.name)}
                    selected={group?.groupStatus}
                  />
                </div>
              )}
            </div>
            <div className="form-grid-container">
              <div className="form-element">
                Название
                <input
                  defaultValue={group?.name}
                  className="form-input"
                  placeholder="Введите название"
                  {...register('name', { required: true })}
                />
                {errors.name && <span>Вы не указали название</span>}
              </div>
              <div className="form-element">
                Расписание занятий
                <input
                  className="form-input"
                  defaultValue={group?.timetable}
                  placeholder="Введите текст"
                  {...register('timetable', { required: true })}
                />
                {errors.timetable && <span>Вы не составили расписание</span>}
              </div>
            </div>
            <div className="form-element form-grid-container">
              <div>
                Дата начала занятий
                <Controller
                  name="startDate"
                  defaultValue={group?.startDate}
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field }) => <Datepicker field={field} />}
                />
              </div>
              <div>
                Дата окончания занятий
                <Controller
                  name="endDate"
                  defaultValue={group?.endDate}
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field }) => <Datepicker field={field} />}
                />
              </div>
            </div>
            <div className="form-element form-grid-container">
              <div className="form-element with-dropdown choose-count">
                Число платежей:
                <FilterList
                  data={paymentsCount}
                  callback={(item) => setValue('paymentsCount', item.value)}
                  selected={group?.paymentsCount}
                />
              </div>
              <div>
                Оплата за месяц
                <input
                  type="number"
                  className="form-input"
                  defaultValue={group?.paymentPerMonth}
                  placeholder="Введите сумму"
                  {...register('paymentPerMonth', { required: true, pattern: /^[ 0-9]+$/ })}
                />
                {errors.paymentPerMonth?.type === 'required' && <span>Вы не ввели сумму</span>}
                {errors.paymentPerMonth?.type === 'pattern' && (
                  <span>Проверьте корректность данных</span>
                )}
              </div>
            </div>
            <div className="teachers-list">
              <h3>Преподаватель:</h3>
              <div className="list">
                <CheckboxGroup
                  // required={true}
                  checkboxArr={teachersForCheckbox}
                  defaultValue={teacherIdsForGroup}
                  name="teacherIds"
                />
              </div>
            </div>
            <div className="tutors-list">
              <h3>Тьютор:</h3>
              <div className="list">
                <CheckboxGroup
                  // required={true}
                  checkboxArr={tutorsForCheckbox}
                  defaultValue={tutorIdsForGroup}
                  name="tutorIds"
                />
              </div>
            </div>
            <div className="buttons-group">
              <Button
                model={ButtonModel.Colored}
                text="Сохранить"
                type={ButtonType.submit}
                width="190"
              />
              <Button
                model={ButtonModel.Text}
                text="Отмена"
                type={ButtonType.reset}
                onClick={() => navigate(-1)}
              />
              {id ? (
                <div className="delete-btn">
                  <Button
                    model={ButtonModel.Colored}
                    text="Удалить группу"
                    type={ButtonType.button}
                    width="220"
                    onClick={() => deleteGroup(+id)}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};
