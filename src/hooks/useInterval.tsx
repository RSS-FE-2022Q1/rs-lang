import  { useEffect, useRef } from 'react';

export function useInterval (callback: ()=>void, delay: number | null) {
  const savedCallback = useRef<()=>void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick () {
      if (savedCallback.current) savedCallback.current();
    }

    let interval : NodeJS.Timer;
    if (delay !== null) {
      interval = setInterval(tick, delay);
    }

    return () => clearInterval(interval);

  }, [delay]);
}
