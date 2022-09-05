import { PlayAudio } from './PlayAudio';

export const PlayAudioExample = (): JSX.Element => (
  <div className="example">

    <p>Default controls</p>
    <PlayAudio
      source= "https://file-examples.com/storage/fe63a55b7d630545e96d964/2017/11/file_example_MP3_700KB.mp3"
      type='default'
    />

    <p>Single button</p>
    <PlayAudio
      source= "https://www.w3schools.com/html/horse.mp3"
      type='single-button'
    />

  </div>
);
