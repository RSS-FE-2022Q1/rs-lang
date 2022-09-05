import { BadgeCheckIcon } from '@heroicons/react/outline';

import './StreakCounter.pcss';

export interface StreakCounterProps {
  currentStreak: number;
}

export const StreakCounter = ({ currentStreak }: StreakCounterProps): JSX.Element => {

  const checkMarks = Array(3).fill('').map((el, i) => i);

  return (
    <div className="streak_line">
      {checkMarks.map((el: number, index) => (
        <div key={el} className="streak_item">
          {(index < currentStreak)
            ? <BadgeCheckIcon className="streak_done" aria-hidden="true" />
            : <BadgeCheckIcon className="streak_await" aria-hidden="true" />}
        </div>
      ))}
    </div>

  );
};
