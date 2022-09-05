import { useEffect, useState } from 'react';
import './GameControlButton.pcss';

export interface IconPack {
  first: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  second: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export interface GameControlButtonProps  {
  initialState? : boolean;
  onChange :(value: boolean) =>void;
  icons:IconPack;
  color?: string;
  size?: string;

  changeStateOutside?: boolean;
}

export const GameControlButton = (
  { initialState=true,
    onChange,
    icons,
    color = '#707070',
    size = '2rem',
    changeStateOutside,
  }: GameControlButtonProps): JSX.Element =>
{
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (changeStateOutside) setState(changeStateOutside);
  }, [changeStateOutside]);

  const switchHandler = () => {
    onChange(!state);
    setState(prev=>!prev);
  };

  return (

    <div
      className="control_button"
      style = {
        { 'color': color,
          'width' : size,
          'height' : size,
        }
      }
      onClick = {switchHandler}
      onKeyPress={switchHandler}
      role="button"
      tabIndex={0}
    >
      <div className={`control_icon ${state ? '' : 'active'}`}>{state ? <icons.first/> : <icons.second />}</div>
    </div>

  );};
