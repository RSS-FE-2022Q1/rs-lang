import { MutableRefObject, useEffect } from 'react';

export function useOnClickOutside (ref: MutableRefObject<Element | null>, handler: ()=>void) {
  useEffect(
    () => {
      const listener = (event: MouseEvent) => {
        if (event.target instanceof Element){
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler();
        }
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    [ref, handler],
  );
}
