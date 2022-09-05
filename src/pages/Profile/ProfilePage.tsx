import './ProfilePage.pcss';

import { useNavigate } from '@tanstack/react-location';
import { useSelector } from 'react-redux';

import { useEffect } from 'react';

import Statistics from '../Statistics/Statistics';

import type { RootState } from '@/store/store';

const ProfilePage = (): JSX.Element => {
  const authState = useSelector((state: RootState) => state.authentication);

  const navigate = useNavigate();

  useEffect(() => {
    if(!authState.isLoggedIn) {
      navigate({ to: '/auth' });
    }
  }, [authState.isLoggedIn, navigate]);

  return (
    <section className="profile">
      <h2 className="profile_heading">Привет, &nbsp; {authState.user.name}!</h2>
      <Statistics />
    </section>
  );
};

export default ProfilePage;
