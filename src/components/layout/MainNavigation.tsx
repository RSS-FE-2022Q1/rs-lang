import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link, useNavigate } from '@tanstack/react-location';
import { useSelector, useDispatch } from 'react-redux';

import React, { useState } from 'react';

import './MainNavigation.pcss';

import { authActions } from '@/store/authSlice';
import { RootState } from '@/store/store';

type TSVGIcon = {
  icon:(props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const MainNavigation = ({ children }:React.PropsWithChildren): JSX.Element => {
  // console.log('MainNavigation');
  const authState = useSelector((state: RootState) => state.authentication);
  const { isLoggedIn } = authState;
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const menuIcon:TSVGIcon = { icon:MenuIcon };
  const closeIcon:TSVGIcon = { icon:XIcon };

  const toggleMobileMenu = () => {
    setMenuOpen(prev => !prev);
    if(navRef.current){
      navRef.current.classList.toggle('mobile-nav');
    }
  };

  const logoutHandler = () => {
    toggleMobileMenu();
    dispatch(authActions.logout());
    navigate({ to:'/', replace:true });
    window.location.reload(); // bad
  };

  const getActiveProps = () => ({
    style: { color: '#6c5ce7', borderBottom: '1px dashed black' },
  });

  return (
    <>
      <header className="header">

        <Link to="/" getActiveProps={getActiveProps}>
          <div className="logo">RS Lang</div>
        </Link>

        <div className='header-nav' ref={navRef}>
          <nav >
            <ul className='nav-list'>

              <li>
                <Link to="/textbook" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
                Учебник
                </Link>
              </li>

              <li>
                <Link to="/games" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
              Игры
                </Link>
              </li>

              {isLoggedIn && (
                <li>
                  <Link to="/dictionary" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
                Мои слова
                  </Link>
                </li>
              )}

              {isLoggedIn && (
                <li>
                  <Link to="/profile" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
                Профиль ({authState.user.name})
                  </Link>
                </li>
              )}

              <li>
                <Link to="/team" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
                О нас
                </Link>
              </li>

              {!isLoggedIn && (
                <li>
                  <Link to="/auth" getActiveProps={getActiveProps} onClick={toggleMobileMenu}>
                Войти
                  </Link>
                </li>
              )}

              {isLoggedIn && (
                <li>
                  <button type="button" onClick={logoutHandler} >
                Выйти
                  </button>
                </li>
              )}

            </ul>
          </nav>
        </div>

        <div className='menu-burger-btn' role="button"  tabIndex={0} onClick={toggleMobileMenu} onKeyPress={toggleMobileMenu}>
          { menuOpen ? <closeIcon.icon/> : <menuIcon.icon/>}
        </div>
      </header>
      {children}

    </>
  );
};

export default MainNavigation;
