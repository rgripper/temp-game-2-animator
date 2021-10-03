import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Recorder, RecorderResult } from './Recorder';
import type { Pose } from './useEstimator';
import { Dresser } from './Dresser';
import { FrameEstimationDisplayList } from './FrameEstimationDisplayList';

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
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', flexDirection: 'column' }}>
      {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={10} />
      )}
      {recorderResult && (
        <div style={{ width: '800px' }}>
          <FrameEstimationDisplayList frames={recorderResult.frames} onComplete={setPoses} />
        </div>
      )}
      {pose && <Dresser pose={pose} />}
    </div>
  );
}

export default App;
