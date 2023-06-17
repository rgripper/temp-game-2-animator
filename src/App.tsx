import { useState } from 'react';
import './App.css';
import { Recorder, RecorderResult } from './recorder/Recorder';
import type { Pose } from './useEstimator';
import { FrameEstimationDisplayList } from './FrameEstimationDisplayList';
import { Button } from './base/buttons';
import { Input } from './base/inputs';
import { Animator } from './animator/Animator';

function App() {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);

  const save = (values: { poses: Pose[]; name: string }) => {
    const a = document.createElement('a');
    a.download = `${values.name}.json`;
    a.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(JSON.stringify(values))}`;
    a.click();
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center" style={{ height: '100vh' }}>
      {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={10} />
      )}
      {recorderResult && <DownloadForm frames={recorderResult.frames} onSubmit={save} />}
    </div>
  );
}

function DownloadForm(props: { frames: ImageData[]; onSubmit: (values: { poses: Pose[]; name: string }) => void }) {
  const [poses, setPoses] = useState<Pose[] | null>(null);
  const [name, setName] = useState('');
  const canSubmit = !!name && !!poses;
  return (
    <form
      className={`m-8 flex flex-col items-center`}
      onSubmit={() => canSubmit && props.onSubmit({ name, poses })}
    >
      <div className={`mt-8`}>
        <FrameEstimationDisplayList frames={props.frames} onComplete={setPoses} />
      </div>
      <div className={`mt-8`}>
        <Animator poses={poses} />
      </div>
      <div className={`mt-8`}>
        <Input type="text" value={name} onChange={(ev) => setName(ev.currentTarget.value)} />
      </div>
      <Button className={`mt-8`} type="submit" disabled={!canSubmit}>
        Save
      </Button>
    </form>
  );
}

export default App;
