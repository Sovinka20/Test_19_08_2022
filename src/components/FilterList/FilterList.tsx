import { useState } from 'react';
import './FilterList.scss';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { SvgArrow } from '../SvgIcon/SvgFiles/SvgArrow';
//import { useSelector } from 'react-redux';
//import { AllUsersPageState } from '../../store/reducers/allUsers.reducer';
//import { AppState } from '../../store/store';

export type FilterListProps = {
  data: FilterItem[];
  cssClass?: string;
  selected?: number;
  callback?: (item: any) => void;
  arrowHidden?: boolean;
  cssAlign?: Align;
  placeholder?: string;
};

export enum Align {
  Center = 'center',
  Left = 'left',
}

export type FilterItem = {
  id: number;
  name: string;
  checkbox?: boolean;
};

export const FilterList = (props: FilterListProps) => {
  //const { selectedUserId } = useSelector(
  //  (state: AppState) => state.allUsersPageState as AllUsersPageState
  //);

  const filterData = props.data;
  const selectedItem = props.selected ? filterData.find((x) => x.id === props.selected) : undefined;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [item, setItem] = useState<FilterItem>(selectedItem ?? filterData[0]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const closeDropdown = () => {
    setIsOpen(false);
  };
  const clickOutside = useDetectClickOutside({ onTriggered: closeDropdown });

  const onElementClick = (elem: FilterItem) => {
    setItem(elem);
    props.callback?.(elem);
    //if (elem.checkbox) {
    //console.log(selectedUserId);
    //}
  };

  return (
    <div className="drop-down-filter__wrapper flex-container" ref={clickOutside}>
      <div
        className={`drop-down-filter flex-container ${props.cssClass ?? ''} ${
          props.cssAlign ?? ''
        }`}
        onKeyPress={() => toggle()}
        onClick={() => toggle()}
        data-lesson-id={item?.id}
      >
        {item?.name ? (
          <span>{item?.checkbox ? '' : item?.name}</span>
        ) : props.placeholder ? (
          <span className="placeholder">{props.placeholder}</span>
        ) : (
          ''
        )}
        {!props.arrowHidden && <SvgArrow direction={isOpen ? 'top' : 'bottom'} />}
      </div>

      {isOpen && (
        <div className={`drop-down-filter__list-wrapper ${props.cssAlign ?? 'right'}`}>
          <ul className={`drop-down-filter__list ${filterData.length > 4 ? 'overflow' : ''}`}>
            {filterData.map((elem) => (
              <li
                key={elem.id}
                className={`drop-down-filter__element ${elem.id === item?.id ? 'selected' : ''}`}
                onClick={() => onElementClick(elem)}
              >
                {elem.name}
                {elem.checkbox ? <input type="checkbox" /> : <></>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
