import './Speaker.pcss';

import { VolumeUpIcon } from '@heroicons/react/outline';

import { useEffect, useRef, useState } from 'react';

import { PlaySoundItem } from '@/model/games-types';

export interface SpeakerProps {
  source: string;
  playEvent: PlaySoundItem;
}

export const Speaker = ({ source, playEvent }: SpeakerProps): JSX.Element => {
  const [playingItem, setPlayItem] = useState(playEvent);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setPlayer = async (playState: PlaySoundItem) => {
    if (audioRef && audioRef.current) {
      if (playState.isPlaying) {
        setIsPlaying(true);
        await audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    setPlayItem(playEvent);
  }, [playEvent]);

  useEffect(() => {

    setPlayer(playingItem)
      .catch(() => { })
      .then(() => { })
      .finally(() => { });

  }, [playingItem]);

  const onEnded = () => { setIsPlaying(false);};

  const replay = () => { setPlayer(playingItem).catch(()=>{}); };

  return (
    <div className="speaker">
      <audio
        ref={audioRef}
        src={source}
        onEnded={onEnded}
      >
        <track kind="captions" />
      </audio>

      <div className="speaker_container">
        <div className="speaker_image">
          <VolumeUpIcon
            className='speaker_icon'
            onClick={replay}/>
        </div>
        {isPlaying && <div className="speaker_circle" />}
      </div>

    </div>
  );
};
