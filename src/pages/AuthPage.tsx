import { useNavigate } from '@tanstack/react-location';
import { useSelector } from 'react-redux';

import { useEffect } from 'react';

import AuthForm from '@/components/auth/AuthForm';
import type { RootState } from '@/store/store';

const AuthPage = (): JSX.Element => {

  const navigate = useNavigate();
  const authState = useSelector((state:RootState) => state.authentication);

  useEffect(() => {
    if(authState.isLoggedIn) {
      navigate({ to: '/profile' });
    }
  }, [authState.isLoggedIn, navigate]);

  return  (
    <section>
      <AuthForm />
    </section>
  );
};
export default AuthPage;
