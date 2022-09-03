import './ProfilePage.pcss';

import { useSelector } from 'react-redux';

import Statistics from '../Statistics/Statistics';

import type { RootState } from '@/store/store';

const ProfilePage = (): JSX.Element => {
  const authState = useSelector((state: RootState) => state.authentication);

  return (
    <section className="profile">
      <h2 className="profile_heading">Привет, &nbsp; {authState.user.name}!</h2>
      <Statistics />
    </section>
  );
};

export default ProfilePage;
