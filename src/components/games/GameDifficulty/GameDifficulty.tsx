import { Button } from '@/components/ui/Button/Button';
import { Dropdown, OptionsType } from '@/components/ui/DropDown/DropDown';
import { DEFAULT_GROUP_COUNT } from '@/model/constants';

import './GameDifficulty.pcss';

export interface GameDifficultyProps {
  onChangeDiff: (value: string)=>void;
  onStart: ()=>void;
}

export const GameDifficulty = ({ onChangeDiff, onStart }: GameDifficultyProps): JSX.Element => {
  const dropDownArray: OptionsType[] = Array(DEFAULT_GROUP_COUNT)
    .fill(1)
    .map((el, i) => ({ label: 'Уровень ', value: `${+i+1}` }));

  return(
    <div className="diff_picker">
      <div className="diff_picker_controls">
        <Dropdown
          options={dropDownArray}
          name="Сложность"
          initial="1"
          onChange={onChangeDiff}
        />
        <Button buttonType='primary' text='Начать' onClick={onStart} />
      </div>

    </div>

  );};
