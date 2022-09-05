import './PlayAudio.pcss';

import { PlayIcon, PauseIcon } from '@heroicons/react/solid';

import { useEffect, useRef, useState } from 'react';

import { GameControlButton } from '@/components/ui/GameControlButton/GameControlButton';

export type AudioControlsType = 'default' | 'single-button';
export interface PlayAudioProps {
  source: string;
  additionalSources?: string [];
  type: AudioControlsType;
}

export const PlayAudio = ({ source, additionalSources, type }: PlayAudioProps): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  let sources:string[];

  if(additionalSources && additionalSources.length > 0 ){
    sources = [...additionalSources];
  }

  const setPlayer = async (playState: boolean) => {
    if (audioRef && audioRef.current) {
      if (playState) await audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  useEffect(() => {
    setPlayer(isPlaying)
      .catch(() => { })
      .then(() => { })
      .finally(() => { });

  }, [isPlaying]);

  const onPlaying = () => {};

  const onEnded = async () => {
    if(sources && sources.length > 0 ){
      if(audioRef && audioRef.current){
        audioRef.current.src = sources[0];
        await audioRef.current.play();
        sources = sources.filter(s => s!==sources[0]);
      }
    } else {
      if(audioRef && audioRef.current) {
        audioRef.current.src = source;
      }
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio">
      <audio
        ref={audioRef}
        src={source}
        controls={type === 'default'}
        onTimeUpdate={onPlaying}
        onEnded={() => { onEnded().catch(()=>{});}}
      >
        <track kind="captions" />s
      </audio>

      {type !== 'default' &&
        <GameControlButton
          changeStateOutside={!isPlaying}
          icons={{ 'first': PlayIcon, 'second': PauseIcon }}
          onChange={() => { setIsPlaying(prev => !prev); }}
        />
      }
    </div>
  );
};
