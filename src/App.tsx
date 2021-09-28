import React, { useEffect, useState } from 'react';
import './App.css';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
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
  const [selectedFrames, setSelectedFrames] = useState<ImageData[] | null>(null);

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
      {!poses ? (
        <>
          {!recorderResult && (
            <Recorder onComplete={setRecorderResult} countdownSeconds={5} durationSeconds={3} framesPerSec={10} />
          )}
          {recorderResult && !selectedFrames && (
            <FrameListPreview onSelect={setSelectedFrames} frames={recorderResult.frames} />
          )}
          {recorderResult && selectedFrames && !poses && (
            <FrameEstimator frames={selectedFrames} resolution={recorderResult.resolution} onComplete={setPoses} />
          )}
        </>
      ) : (
        <>
          {poses && selectedFrames && (
            <div style={{ width: '800px' }}>
              <FrameEstimationDisplayList poses={poses} frames={selectedFrames} />
            </div>
          )}
          {pose && <Dresser pose={pose} />}
        </>
      )}
    </div>
  );
}

export default App;
