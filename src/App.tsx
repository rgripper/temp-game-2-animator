import React, { useEffect, useState } from 'react';
import './App.css';
import { Recorder, RecorderResult } from './Recorder';
import { FrameEstimator, Pose } from './FrameEstimator';
import { FrameListPreview } from './FrameListPreview';
import posesJson from './poses.json';
import { Dresser } from './Dresser';
import { FrameSelect } from './FrameSelect';
import { FrameEstimationDisplayList } from './FrameEstimationDisplayList';

type AppProps = {};

function App({}: AppProps) {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);

  const [poses, setPoses] = useState<Pose[] | null>(null);

  const [poseIndex, setPoseIndex] = useState(0);
  const pose = poses && poses[poseIndex];
  useEffect(() => {
    if (poses) {
      window.localStorage.setItem('poses', JSON.stringify(poses));
    }
  }, [poses]);

  useEffect(() => {
    setInterval(() => {
      poses && setPoseIndex((p) => (p > poses!.length - 2 ? 0 : p + 1));
    }, 500);
  }, []);
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', flexDirection: 'column' }}>
      {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={1} durationSeconds={1} framesPerSec={10} />
      )}
      {recorderResult && (
        <div style={{ width: '800px' }}>
          <FrameEstimationDisplayList poses={poses} frames={recorderResult.frames} />
        </div>
      )}
      {recorderResult && !poses && (
        <FrameEstimator frames={recorderResult.frames} resolution={recorderResult.resolution} onComplete={setPoses} />
      )}
      {pose && <Dresser pose={pose} />}
    </div>
  );
}

export default App;
