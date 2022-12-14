import { useNavigate } from '@tanstack/react-location';
import { useDispatch } from 'react-redux';

import { FormEvent, useRef, useState } from 'react';

import './AuthForm.pcss';

import * as api from '../../model/api-users';

import type { User } from '@/model/app-types';
import { authActions } from '@/store/authSlice';

const errorMessage = (status: number) =>
  status === 403 ? 'Incorrect e-mail or password' : 'Authentication Failed!';

const AuthForm = (): JSX.Element => {
  // TODO validation
  const [formIsLogin, setFormIsLogin] = useState({ login:true, fisrtLogin:false });
  const [authError, setAuthError] = useState(false);
  const [userExisted, setUserExisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const switchAuthModeHandler = () => {
    setFormIsLogin(prevState => ({ fisrtLogin:false, login: !prevState.login }));
    setAuthError(false);
    setUserExisted(false);
  };

  const showMessageToNewUser = () => {
    setFormIsLogin(prevState => ({ ...prevState, fisrtLogin: true }));
  };

  const removeMessageToNewUser = () => {
    setFormIsLogin(prevState => ({ ...prevState, fisrtLogin: false }));
  };

  const submitHandler = (e: FormEvent) => {
    // console.log('submitHandler');
    e.preventDefault();
    const enteredEmail = emailInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;

    if (!formIsLogin.login) {
      // SIGN UP
      const enteredName = nameInputRef.current!.value;
      const newUser: User = {
        name: enteredName,
        email: enteredEmail,
        password: enteredPassword,
      };
      setIsLoading(true);
      api
        .registerUser(newUser)
        .then(res => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          }
          if(res.status === 417){
            setUserExisted(true);
            throw new Error();
          }
          throw new Error();
        })
        .then((res: User) => {
          // console.log('registerUser', res);
          dispatch(authActions.create({ name:res.name ? res.name : '', email:res.email ? res.email : '' }));
          // switch to Login Form to sign in
          switchAuthModeHandler();
          showMessageToNewUser();
          setUserExisted(false);
        })
        .catch(err => console.error(err));
    } else {
      // SIGN IN
      const user = {
        email: enteredEmail,
        password: enteredPassword,
      };
      setIsLoading(true);
      api
        .signInUser(user)
        .then(res => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          }
          throw new Error(errorMessage(res.status));
        })
        .then((res: User) => {
          const message = res.message ? res.message : '';
          const token = res.token ? res.token : '';
          const refreshToken = res.refreshToken ? res.refreshToken : '';
          const userId = res.userId ? res.userId : '';
          // console.log('signInUser:', res);
          const authState = {
            message,
            token,
            refreshToken,
            userId,
            isLoggedIn:!!token,
            user:{ name:res.name ? res.name : '' },
            authDate: new Date().toISOString(),
          };
          removeMessageToNewUser();
          setAuthError(false);
          dispatch(authActions.login(authState));
          navigate({ to: '/profile' });
          window.location.reload(); // bad
        })
        .catch(err => {
          console.log(err);
          setAuthError(true);
        });
    }
  };

  return (
    <section className="auth">
      {formIsLogin.fisrtLogin && <h2 className='text-green-600'><i>??????????????! ???????????? ???????????? ??????????, ?????????????????? ?????????????????? ????????????</i></h2>}
      <h1>{formIsLogin.login ? '????????' : '??????????????????????'}</h1>
      <form onSubmit={submitHandler}>
        {!formIsLogin.login && (
          <div className="control">
            <label htmlFor="name">
              ???????? ??????
              <input ref={nameInputRef} type="text" id="name" required  placeholder='??????'/>
            </label>
          </div>
        )}
        <div className="control">
          <label htmlFor="email">
            ?????????????????????? ??????????
            <input ref={emailInputRef} type="email" id="email" required placeholder='youremail@service.smth'/>
          </label>
        </div>
        <div className="control">
          <label htmlFor="password">
            ????????????
            <input ref={passwordInputRef} type="password" id="password" required minLength={8} placeholder='?????????????? 8 ????????????????'/>
          </label>
          {authError && (<p className='text-red-400'><b><i>???????????????? ?????????? ?????? ????????????</i></b></p>)}
          {userExisted && (<p className='text-red-400'><b><i>???????????????????????? ?? ???????????? ?????????????? ?????? ??????????????????????????????</i></b></p>)}
        </div>
        <div className="actions">
          {isLoading ? (
            <p>???????????????? ?????????????? ...</p>
          ) : (
            <button type="submit">{formIsLogin.login ? '??????????' : '????????????????????????????????????'}</button>
          )}
          <button type="button" className="toggle" onClick={switchAuthModeHandler}>
            {formIsLogin.login ? '?????????????? ?????????? ??????????????' : '??????????'}
          </button>
        </div>
      </form>
    </section>
  );
};
export default AuthForm;
