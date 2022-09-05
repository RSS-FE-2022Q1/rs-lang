import './MainPage.pcss';
import { ChartPieIcon, PuzzleIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/outline';

import '@/styles/index.pcss';
import { CTABlock } from './CTABlock/CTABlock';
import { FeaturesBlock, IFeature } from './FeaturesBlock/FeaturesBlock';

const features: IFeature[] = [
  {
    name: 'Библиотека 4000 english words',
    description:
      'Коллекция содержит 4000 часто употребляемых английских слов. Вся коллекция разбита на шесть разделов',
    icon: BookOpenIcon,
  },
  {
    name: 'Самостоятельное изучение',
    description:
      'В приложении доступны наборы слов с разным уровнем сложности от elementary до upper intermediate',
    icon: AcademicCapIcon,
  },
  {
    name: 'Онлайн игры',
    description:
      'Игры помогут вам не просто приятно провести время, но и расширить и закрепить словарный запас. Вы готовы поиграть в английский?',
    icon: PuzzleIcon,
  },
  {
    name: 'Статистика',
    description:
      'Подробная статистика и прогресс изучения для зарегистрированных пользователей',
    icon: ChartPieIcon,
  },
];

export const MainPage = (): JSX.Element => (
  <div className="main">

    <div className="main_hero">
      <div className="main_header">
        <h1 className="main_heading">
          Отличный способ изучить английский язык
        </h1>
        <div className="main_subheading">
          <p>
            RS Lang — эффективный сервис для увлекательной практики языка.
            Обучайся играя. Присоединяйся!
          </p>
        </div>
      </div>

      <FeaturesBlock features={features} />

    </div>

    <CTABlock />

  </div>
);
