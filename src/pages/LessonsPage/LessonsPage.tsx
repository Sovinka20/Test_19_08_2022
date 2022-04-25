import { useEffect, useState } from "react";
import { Lesson, LessonModel } from "./components/Lesson";
import { TabContainer } from "../../components/TabContainer/TabContainer";
import { useDispatch, useSelector } from "react-redux";
import { baseWretch } from "../../services/base-wretch.service";
import { AppState } from "../../store/store";
import { loadLessons } from "../../actions/lessons.actions";
import { LessonResponse } from "../../models/responses/LessonResponse";

export const LessonsPage = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const { lessons, tabs, selectedTab } = useSelector(
    (state: AppState) => state.lessonPageState
  );

  const dispatch = useDispatch();

  function onElementClick(id: number) {
    setActiveLesson(id === activeLesson ? 0 : id);
  }

  //////////////  -- to delete
  // const lessonsMock: LessonModel[] = [
  //   {id: 5, name: 'Занятие 5', date: '10.03.2022', theme: 'Познакомитесь с основами C++ и научитесь создавать простейшие консольные программы.', videoLink: 'https://disk.yandex.com/d/9WeaF1Yua7D1IA', additionalInfo: 'Плагин Figma, позволяет создавать красивые тени, просто перетаскивая «источник света»' },
  //   {id: 4, name: 'Занятие 4', date: '14.02.2022', theme: 'Научитесь проектировать быстрые алгоритмы, применять стандартные структуры данных, а главное — мыслить как программист. Знание алгоритмов может повысить ваши шансы на трудоустройство, так как в большинстве компаний задачи на алгоритмы — неотъемлемая часть собеседования и тестового задания.', videoLink: '', additionalInfo: '' },
  //   {id: 3, name: 'Занятие 3', date: '10.03.2022', theme: 'Познакомитесь с основами C++ и научитесь создавать простейшие консольные программы.', videoLink: 'https://disk.yandex.com/d/9WeaF1Yua7D1IA', additionalInfo: 'Плагин Figma, позволяет создавать красивые тени, просто перетаскивая «источник света»' },
  //   {id: 2, name: 'Занятие 2', date: '14.02.2022', theme: 'Научитесь проектировать быстрые алгоритмы, применять стандартные структуры данных, а главное — мыслить как программист. Знание алгоритмов может повысить ваши шансы на трудоустройство, так как в большинстве компаний задачи на алгоритмы — неотъемлемая часть собеседования и тестового задания.', videoLink: '', additionalInfo: '' },
  //   {id: 1, name: 'Занятие 1', date: '10.02.2022', theme: 'В этом модуле вас ждут 10 видеолекций, которые помогут вам начать разговаривать на английском языке как настоящий разработчик.', videoLink: '', additionalInfo: '' },
  // ];
  ////////////////////////////
  useEffect(() => {
    if (selectedTab > 0) {
      baseWretch()
        .url(`by-groupId/${selectedTab}`)
        .get()
        .json((data) => dispatch(loadLessons(data as LessonResponse[])));

      // dispatch(loadLessons(lessonsMock))
    }
  }, [selectedTab]);

  const newLessons = lessons?.map((item) => {
    let newLessons: LessonModel = {
      id: item.id,
      name: "Имя", //заменить методом (пока сортировка по дате) (взять данные, которых нет, с бэка)!
      date: item.date,
      theme: "Тема", //заменить (взять данные, которых нет, с бэка)!
      //theme: item.name,
      videoLink: item.linkToRecord,
      additionalInfo: item.additionalMaterials,
    };
    return newLessons;
  });

  return (
    <>
      <TabContainer tabContainerData={tabs} selectedTab={selectedTab} />

      <div>Занятия</div>
      <div className="lessons-container">
        {newLessons?.map((lesson) => (
        // {lessonsMock?.map((lesson) => (
          <Lesson
            data={lesson}
            id={lesson.id}
            key={lesson.id}
            activeLessonId={activeLesson}
            onClick={onElementClick}
          />
        ))}
      </div>
    </>
  );
};
