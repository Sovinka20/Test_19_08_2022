import './Navigation.scss';
import { ButtonNavigation } from '../ButtonNavigation/ButtonNavigation';
import { useSelector } from 'react-redux';
import { LoginPageState } from '../../../store/reducers/login.reducer';
import { AppState } from '../../../store/store';
import { Link } from 'react-router-dom';
import { getNavLinksByRole } from './navLinksProvider';

export const Navigation = () => {
  const { currentUser } = useSelector(
    (state: AppState) => state.loginPageState as LoginPageState
  );

  return (
    <nav className="main-nav-panel">
      {currentUser ? (
        getNavLinksByRole(currentUser.roles[0]).map((item) => (
          <ButtonNavigation data={item} key={item?.path} />
        ))
      ) : (
        <>
          <Link className="login-link" to={'/login'}>
            Вход
          </Link>
          <div>
            <Link className="register-link" to={'/register'}>
              Регистрация
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};
