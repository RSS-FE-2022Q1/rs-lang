import { useState } from 'react';

import { useInterval } from '@/hooks/useInterval';
import './Timer.pcss';

export interface IconPack {
  first: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  second: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export interface TimerProps  {
  seconds : number;
  onTimeUp :() =>void;
}

const svgSize = 80;
const svgSizeR = 35;

export const Timer = (
  { seconds, onTimeUp }: TimerProps): JSX.Element =>
{
  const [secondsLeft, setSecondsLeft ] =  useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    if (secondsLeft > 0) {
      setSecondsLeft(secondsLeft - 1);
    } else {
      setIsRunning(false);
      onTimeUp();
    }
  },  isRunning ?  1000 : null);

  return (
    <div className="timer">
      <svg
        className="timer_svg"
        height={svgSize}
        width={svgSize}
        style={{
          animationDuration: `${seconds}s`,
          strokeDasharray: svgSizeR * 2 * Math.PI,
          strokeDashoffset: svgSizeR * 2 * Math.PI,
        }}>
        <circle
          cx={svgSize/2}
          cy={svgSize/2}
          r={svgSizeR}
          stroke="#428bca"
          strokeWidth="6"
          fill="transparent"
        />
        <text
          x= {svgSize * 0.25}
          y= {svgSize * - 0.35}
          className="timer_svg_text"
        >
          {secondsLeft}
        </text>
      </svg>
    </div>

  );};
