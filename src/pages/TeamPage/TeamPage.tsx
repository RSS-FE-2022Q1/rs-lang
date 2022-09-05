import { ITeamMember, TeamCard } from './TeamCard/TeamCard';
import './TeamPage.pcss';

import teamPhoto2 from '@/assets/photos/AK.jpg';
import teamPhoto1 from '@/assets/photos/VM.jpg';
import teamPhoto3 from '@/assets/photos/team-member-3.jpg';

const members: ITeamMember[] = [
  { name : 'Василий Мишанин',
    role : 'Fullstack разработчик',
    description : 'Создание API, регистрация и авторизация, роутинг, учебник, карточки слов, раздел "Мои слова"',
    photo: teamPhoto1,
    links: {
      github: 'https://github.com/vasily-mishanin',
      linkedin: 'https://www.linkedin.com/in/vasilymishanin/',
    },
  },

  { name : 'Андрей Комиссаров',
    role : 'Тим лид',
    description : 'Мини игры "Спринт" и "Аудиовызов, статистика, компоненты UI, деплой приложения',
    photo: teamPhoto2,
    links: {
      github: 'https://github.com/m208',
      linkedin: 'https://linkedin.com/in/avkomissarov',
    },
  },

  { name : 'Артем Ромаскевич',
    role : 'Frontend разработчик',
    description : 'Часть корабля, часть команды',
    photo: teamPhoto3,
    links: {
      github: 'https://github.com/romaskevich',
    },
  },
];

export const TeamPage = (): JSX.Element => (

  <div className="team">
    <h2 className="team_heading">Знакомьтесь с нашей командой</h2>

    <div className="team_members">
      {members.map((member, i)=>(
        <TeamCard
          member={member}
          key={`${i*Math.random()}`}
        />))}
    </div>
  </div>

);
