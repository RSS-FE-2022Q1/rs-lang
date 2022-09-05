import classNames from 'classnames';

import { PlayAudio } from '@/components/PlayAudio/PlayAudio';
import { FILESTORAGE_URL } from '@/model/constants';
import './GameResultItem.pcss';
import { ISprintWord } from '@/model/games-types';

export interface GameResultItemProps {
  item: ISprintWord;
  isOdd: boolean;
}
export const GameResultItem = ({ item, isOdd }: GameResultItemProps): JSX.Element => (
  <div
    className={
      classNames('results_item', isOdd && 'result_odd')
    }
  >
    <div className="results_cell result_audio">
      <PlayAudio
        source={FILESTORAGE_URL + item.audio}
        type='single-button'
      />
    </div>
    <div
      className="results_cell results_name">
      <span>{item.word}</span>
    </div>
    <div className="results_cell results_name">
      <span>{item.wordTranslate}</span>
    </div>

  </div>

);
