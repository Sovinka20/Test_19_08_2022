import moment from 'moment';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsEdit } from '../../actions/lessons.actions';
import { getDataToEdit, resetDataToCreate } from '../../actions/newLessonPage.action';
import { updateLesson, uploadLesson } from '../../actions/newLessonPage.thunk';
import { Button, ButtonModel, ButtonType } from '../../components/Button/Button';
import Datepicker from '../../components/Datepicker/Datepicker';
import { LinkWithUnderline } from '../../components/LinkWithUnderline/LinkWithUnderline';
import { RadioData } from '../../components/RadioGroup/RadioButton/RadioButton';
import { RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { LessonFullInfoResponse } from '../../models/responses/LessonResponse';
import { baseWretch } from '../../services/base-wretch.service';
import { getUrlLessonsFullInfo } from '../../shared/consts';
import { LessonsPageState } from '../../store/reducers/lessons.reducer';
import { LoginPageState } from '../../store/reducers/login.reducer';
import { NewLessonPageState } from '../../store/reducers/newLessonPage.reducer';
import { AppState } from '../../store/store';
import './NewLessonPage.scss';

export type NewLessonFormData = {
  id?: number;
  date: string | Date;
  additionalMaterials: string;
  groupId?: number;
  name: string;
  linkToRecord: string;
  isPublished: boolean;
};

export const NewLessonPage = () => {
  const dispatch = useDispatch();
  const { lessonsData } = useSelector(
    (state: AppState) => state.newLessonPageState as NewLessonPageState
  );

  const { isEditing } = useSelector(
    (state: AppState) => state.lessonsPageState as LessonsPageState
  );

  const methods = useForm<NewLessonFormData>({
    defaultValues: lessonsData,
  });

  const {
    register,
    formState: { errors },
    getValues,
    control,
    reset,
  } = useForm<NewLessonFormData>({});

  const { currentUser } = useSelector((state: AppState) => state.loginPageState as LoginPageState);
  const navigate = useNavigate();

  const onPublishHandler = (data: NewLessonFormData) => {
    data.isPublished = true;
    if (!isEditing) dispatch(uploadLesson(data));
    else dispatch(updateLesson(data));
    alert(`published ${data.groupId}!!`); //to delete
    dispatch(resetDataToCreate());
    reset();
  };

  const onSaveHandler = (data: NewLessonFormData) => {
    data.isPublished = false;
    if (!isEditing) dispatch(uploadLesson(data));
    else dispatch(updateLesson(data));
    alert(`saved to group ${data.groupId}!`); //to delete
    dispatch(resetDataToCreate());
    reset();
  };

  const initFields = async (id: number) => {
    const fullLessonsData: LessonFullInfoResponse = await baseWretch()
      .url(getUrlLessonsFullInfo(+id))
      .get()
      .json();

    const lessonsFormData: NewLessonFormData = {
      id: fullLessonsData.id,
      date: fullLessonsData.date,
      additionalMaterials: fullLessonsData.additionalMaterials,
      isPublished: false,
      linkToRecord: fullLessonsData.linkToRecord,
      name: fullLessonsData.name,
      groupId: undefined,
    };

    dispatch(getDataToEdit(lessonsFormData));
    dispatch(setIsEdit(true));
  };
  const { id } = useParams();

  useEffect(() => {
    if (id) initFields(+id);
    else {
      dispatch(resetDataToCreate());
      dispatch(setIsEdit(false));
    }
  }, [location.pathname]);

  return (
    <FormProvider {...methods}>
      <div className="form-container homework-form">
        <div className="flex-between base-line">
          <h2 className="homework-form_title">
            {!isEditing ? `${'Новое занятие'}` : `${'Редактирование'}`}
          </h2>
          <LinkWithUnderline
            path="new-lesson/unpublished"
            text="Список сохраненных занятий"
          ></LinkWithUnderline>
        </div>
        <div className="form-element flex-container">
          Номер группы:
          <div className="radio-group-container flex-container">
            {currentUser?.groups && (
              <RadioGroup
                radioData={currentUser.groups?.map((group) => {
                  return { text: group.name, value: group.id } as RadioData;
                })}
                name="groupId"
              />
            )}
          </div>
        </div>
        <span className="invalid-feedback">{errors?.groupId?.message}</span>
        <div>
          Дата проведения занятия
          <Controller
            name="date"
            control={control}
            defaultValue={`${moment().format('DD.MM.YYYY')}`}
            rules={{ required: false }}
            render={({ field }) => <Datepicker field={field} />}
          />
        </div>
        <div className="form-element">
          Название занятия
          <input
            className={`form-input${errors.name ? ' invalid-input' : ''}`}
            type="text"
            placeholder="Введите название"
            defaultValue={`${lessonsData?.name}`}
            {...register('name', { required: true })}
          />
        </div>
        <div className="invalid-feedback">{errors.date?.message}</div>
        <div className="form-element">
          Ссылка на видео
          <input
            className={`form-input${errors.linkToRecord ? ' invalid-input' : ''}`}
            type="text"
            placeholder="Ссылка на видео"
            defaultValue={`${lessonsData?.linkToRecord}`}
            {...register('linkToRecord', { required: false })}
          />
        </div>
        <div className="form-element">
          Дополнительные материалы
          <textarea
            className={`form-input${errors.additionalMaterials ? ' invalid-input' : ''}`}
            placeholder="Введите текст"
            defaultValue={`${lessonsData?.additionalMaterials}`}
            {...register('additionalMaterials', { required: true })}
          />
        </div>
        <div className="buttons-group">
          <Button
            text="Опубликовать"
            model={ButtonModel.Colored}
            type={ButtonType.submit}
            disabled={false}
            onClick={() => {
              onPublishHandler(getValues());
            }}
          />
          <Button
            text={'Сохранить'}
            model={ButtonModel.White}
            type={ButtonType.submit}
            disabled={false}
            onClick={() => {
              onSaveHandler(getValues());
            }}
          />
          <Button
            text="Отмена"
            type={ButtonType.reset}
            model={ButtonModel.Text}
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    </FormProvider>
  );
};
