import { useEffect } from 'react';

export function useOnKeyUp (handler: (code: string) => void) {
  useEffect(
    () => {
      const listener = (event: KeyboardEvent) => {
        if (event.target instanceof Element) handler(event.code);
      };

      document.addEventListener('keyup', listener);
      return () => {
        document.removeEventListener('keyup', listener);
      };
    },
    [handler],
  );
}
