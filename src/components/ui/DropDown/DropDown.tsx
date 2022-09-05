import './DropDown.pcss';
import classNames from 'classnames';

import { useRef, useState } from 'react';

import { Button } from '../Button/Button';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export interface OptionsType {
  label: string;
  value: string;
};

interface DropDownProps {
  name: string;
  options: OptionsType[];
  onChange: (val: string) => void;
  initial: string;
}

export const Dropdown = ({ name, options, onChange, initial }: DropDownProps) => {
  const [drawList, setDrawList] = useState(false);
  const [curValue, setCurValue] = useState(initial);

  const closeHandler = () => { setDrawList(prev => !prev); };
  const pickHandler = (val: string) => {
    setCurValue(val);
    closeHandler();
    onChange(val);
  };

  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => { if (drawList) closeHandler(); });

  return (
    <div ref={ref} className="dropdown">
      <div className="dropdown_button" >
        <Button text={`${name}: ${curValue}`} buttonType="secondary" onClick={closeHandler} />
      </div>

      <ul className={
        classNames(
          'dropdown_list',
          !drawList && 'dropdown_hide',
        )
      }>
        {options.map(option => (
          <li
            role="menuitem"
            className='dropdown_item'
            key={option.value}
            onClick = {()=>pickHandler(option.value)}
            onKeyPress={()=>pickHandler(option.value)}
          >
            {option.label} {option.value}
          </li>
        ))}

      </ul>
    </div>
  );
};
