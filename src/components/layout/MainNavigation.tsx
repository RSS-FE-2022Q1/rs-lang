import { Link, useNavigate } from '@tanstack/react-location';
import { useSelector, useDispatch } from 'react-redux';

import React from 'react';

import './MainNavigation.pcss';

import { authActions } from '@/store/authSlice';
import { RootState } from '@/store/store';

const MainNavigation = ({ children }:React.PropsWithChildren): JSX.Element => {
  // console.log('MainNavigation');
  const authState = useSelector((state: RootState) => state.authentication);
  const { isLoggedIn } = authState;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate({ to:'/', replace:true });
    window.location.reload(); // bad
  };

  const getActiveProps = () => ({
    style: { color: 'rgb(120 53 15)' },
  });

  return (
    <>
      <header className="header">

        <Link to="/" getActiveProps={getActiveProps}>
          <div className="logo">RS Lang</div>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/team" getActiveProps={getActiveProps}>
                Команда
              </Link>
            </li>
            <li>
              <Link to="/textbook" getActiveProps={getActiveProps}>
                Учебник
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/dictionary" getActiveProps={getActiveProps}>
                Мои слова
                </Link>
              </li>
            )}
            <li>
              <Link to="/games" getActiveProps={getActiveProps}>
              Игры
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link to="/auth" getActiveProps={getActiveProps}>
                Войти
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/profile" getActiveProps={getActiveProps}>
                Профиль {authState.user.name}
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/debug" getActiveProps={getActiveProps}>
                  Debug
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button type="button" onClick={logoutHandler}>
                Выйти
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {children}

    </>
  );
};

export default MainNavigation;
