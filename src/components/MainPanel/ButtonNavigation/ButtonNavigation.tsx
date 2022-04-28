import { Link } from 'react-router-dom';
import './ButtonNavigation.scss';
import { useLocation } from 'react-router-dom';
import { NavLink } from '../Navigation/NavLinkButtons';
import { SvgIcon } from '../../SvgIcon/SvgIcon';

export type ButtonProps = {
  data: NavLink;
};

export const ButtonNavigation = (props: ButtonProps) => {
  const location = useLocation();

  return (
    <Link
      to={props.data.path}
      className={`nav-link flex-center transition-styles ${
        props.data.path === location.pathname ? 'active' : ''
      } ${props.data.icon ? '' : 'subbutton'}`}
    >
      {props.data.icon ? <SvgIcon icon={props.data.icon} /> : ''}
      <span className={`links-name transition-styles`}>
        {props.data.displayName}
      </span>
    </Link>
  );
};
