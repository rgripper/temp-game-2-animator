import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Recorder, RecorderResult } from './Recorder';
import type { Pose } from './useEstimator';
import { Dresser } from './Dresser';
import { FrameEstimationDisplayList } from './FrameEstimationDisplayList';
import { Button } from './base/buttons';
import { Input } from './base/inputs';
import { tw } from 'twind';

type AppProps = {};

function App({}: AppProps) {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);

  const [poses, setPoses] = useState<Pose[] | null>(null);
  const posesRef = useRef<Pose[] | null>();
  posesRef.current = poses;

  const [poseIndex, setPoseIndex] = useState(0);
  const pose = poses && poses[poseIndex];
  useEffect(() => {
    if (poses) {
      window.localStorage.setItem('poses', JSON.stringify(poses));
    }
  }, [poses]);

  useEffect(() => {
    setInterval(() => {
      setPoseIndex((p) => (posesRef.current ? (p > posesRef.current.length - 2 ? 0 : p + 1) : 0));
    }, 500);
  }, []);
  return (
    <div
      className={tw`bg-gray-900`}
      style={{ display: 'flex', height: '100vh', alignItems: 'center', flexDirection: 'column' }}
    >
      {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={10} />
      )}
      {recorderResult && (
        <div className={tw`w-2/3`}>
          <FrameEstimationDisplayList frames={recorderResult.frames} onComplete={setPoses} />
          {poses && <DownloadForm poses={poses} />}
        </div>
      )}
      {pose && <Dresser pose={pose} />}
    </div>
  );
}

function DownloadForm({ poses }: { poses: Pose[] }) {
  const [name, setName] = useState('');
  return (
    <div>
      <div>
        <Input type="text" value={name} onChange={(ev) => setName(ev.currentTarget.name)} />
      </div>
      <a
        download="poses.json"
        onClick={() => {
          setName('');
        }}
        href={
          'data:text/plain;charset=utf-8,' +
          encodeURIComponent(
            JSON.stringify({
              name,
              poses,
            }),
          )
        }
      >
        <Button>Download</Button>
      </a>
    </div>
  );
}

export default App;
