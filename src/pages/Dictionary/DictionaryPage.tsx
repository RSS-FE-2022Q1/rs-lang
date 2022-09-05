import { PuzzleIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/outline';
import { Outlet , useNavigate } from '@tanstack/react-location';
import { useSelector } from 'react-redux';

import { useEffect } from 'react';

import { NavButton } from '@/components/ui/NavButton/NavButton';
import './DictionaryPage.pcss';
import { RootState } from '@/store/store';

const DictionaryPage = (): JSX.Element => {
  const navigate = useNavigate();
  const authState = useSelector((state:RootState) => state.authentication);

  useEffect(() => {
    if(!authState.isLoggedIn) {
      navigate({ to: '/textbook' });
    }
  }, [authState.isLoggedIn, navigate]);

  return   <section className='dictionary'>

    <div className="flex w-full justify-center my-8 words-mobile">

      <NavButton
        href='difficult'
        icon={{ icon: PuzzleIcon }}
        name='Сложные слова'
        description='Которые Вы отметили'
      />

      <NavButton
        href='learned'
        icon={{ icon: AcademicCapIcon }}
        name='Изученные слова'
        description='Все которые изучены'
      />

      <NavButton
        href='progress'
        icon={{ icon: SparklesIcon }}
        name='Новые слова'
        description='Слова встреченные в играх'
      />

    </div>

    <Outlet />

  </section>;
};
export default DictionaryPage;
