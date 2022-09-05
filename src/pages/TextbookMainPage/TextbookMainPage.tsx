// import { useSelector } from 'react-redux';
import { Link, Outlet } from '@tanstack/react-location';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { AppDispatch, RootState } from '@/store/store';
import { fetchUsersStats } from '@/store/userStatsSlice';

import './TextbookMainPage.pcss';

const cities = ['SAR', 'NZ', 'AU', 'CA', 'US', 'UK'];

const TextbookMainPage = (): JSX.Element => {
  console.log('TextbookMainPage');

  const [activeGroup, setActiveGroup] = useState<number>();
  const authState = useSelector((state:RootState) => state.authentication);
  const dispatch = useDispatch<AppDispatch>();

  const START_PAGE = 0;
  const NUMBER_OF_GROUPS = 6;
  const groups = [...Array(NUMBER_OF_GROUPS).keys()];

  const handleGroupClick = (groupNumber:number) => {
    console.log('handleGroupClick');
    setActiveGroup(groupNumber);
  };

  useEffect(() => {

    const userData = { userId:authState.userId, token:authState.token };

    const getUserStatistic = async () => {
      await dispatch(fetchUsersStats(userData));
    };

    getUserStatistic().catch(() => {});

  }, [authState.token, authState.userId, dispatch]);

  return (
    <section className="textbook">
      <ul className="groups-list">
        {groups.map(gr => (
          <li key={gr} className={`group-${gr + 1} ${activeGroup === gr + 1 ? 'group-active' : ''}`} >
            <Link to={`/textbook/${gr}/${START_PAGE}`} onClick={()=>handleGroupClick(gr+1)}>
              <span className='group-badge' data-tip="What city is it?">{cities[gr]}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Outlet />
    </section>
  );
};

export default TextbookMainPage;
