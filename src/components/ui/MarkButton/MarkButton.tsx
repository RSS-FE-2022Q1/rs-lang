import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

import { useState } from 'react';

import { MButtonEvent } from '@/model/games-types';
import './MarkButton.pcss';

export interface IconPack {
  yes: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  no: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

interface MarkButtonProps {
  text: string;
  index: number;
  onClick?: ()=>void;
  event: MButtonEvent;
}

type ButtonType = 'yes' | 'no' ;

type ButtonIconMap = {
  [key in ButtonType]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const icons : ButtonIconMap = {
  'yes': CheckCircleIcon,
  'no': XCircleIcon,
};

export const MarkButton = ({ text, index, event,  onClick }: MarkButtonProps): JSX.Element => {
  const [buttonEvent ]= useState(event);

  return(
    <div className="markbutton_wrapper">

      <button
        type = 'button'
        className='markbutton_button markbutton_default'
        onClick = {onClick}
      >
        <div className='markbutton_content'>

          {buttonEvent.drawIcon &&
            (buttonEvent.correctValue === text) &&
              <icons.yes className='mark_yes markbutton_icon'/>
          }

          { buttonEvent.drawIcon &&
            (buttonEvent.pickedValue === text && buttonEvent.correctValue !== text) &&
              <icons.no className='mark_no markbutton_icon'/>
          }

          <span className="markbutton_text">
            {text}
          </span>
        </div>
      </button>
    </div>

  );};
