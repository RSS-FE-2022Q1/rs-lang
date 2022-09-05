import { useEffect, useRef, useState } from 'react';

import failSound from '@/assets/sound/error-3.mp3';
import okSound from '@/assets/sound/success-1.mp3';
import { PlaySoundItem } from '@/model/games-types';

export interface PlaySoundProps {
  playEvent: PlaySoundItem;
}

const sources = [okSound, failSound];

export const PlaySoundEffect = ({ playEvent }: PlaySoundProps): JSX.Element => {
  const [playingItem, setPlayItem ]= useState(playEvent);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPlayItem(playEvent);
  }, [playEvent]);

  useEffect(() => {

    const setPlayer = async (playState: PlaySoundItem) => {
      if (audioRef && audioRef.current) {
        if (playState.isPlaying) {
          audioRef.current.src = sources[playState.sourceId];
          await audioRef.current.play();
        }
      }
    };

    setPlayer(playingItem)
      .catch(() => { })
      .then(() => { })
      .finally(() => { });

  }, [playingItem]);

  const onEnded = () => {};

  return (
    <div className="sound">
      <audio
        onEnded={onEnded}
        ref={audioRef}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
};
