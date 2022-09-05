import { LightningBoltIcon, SpeakerphoneIcon } from '@heroicons/react/outline';
import {  Outlet } from '@tanstack/react-location';

import { NavButton } from '@/components/ui/NavButton/NavButton';
import './GamesPage.pcss';

const GamesPage = (): JSX.Element => (
  <section className="games">

    <div className="flex w-full justify-center my-8 games-mobile">
      <NavButton
        href='/games/sprint'
        icon={{ icon: LightningBoltIcon }}
        name='Спринт'
        description='Игра на время'
      />

      <NavButton
        href='/games/audio'
        icon={{ icon: SpeakerphoneIcon }}
        name='Аудиовызов'
        description='Игра на слух'
      />
    </div>

    <Outlet />
  </section>
);

export default GamesPage;
