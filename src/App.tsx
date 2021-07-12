import React, { useEffect, useState } from 'react';
import './App.css';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { Recorder, RecorderResult } from './Recorder';
import { FrameEstimator, Pose } from './FrameEstimator';
import { Animator } from './Animator';
import { FrameListPreview } from './FrameListPreview';
import posesJson from './poses.json';
import { Dresser } from './Dresser';

type AppProps = {};

function App({}: AppProps) {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);
  const [selectedFrames, setSelectedFrames] = useState<ImageData[] | null>(null);

  const [poses, setPoses] = useState<Pose[] | null>(posesJson);

  useEffect(() => {
    if (poses) {
      window.localStorage.setItem('poses', JSON.stringify(poses));
    }
  }, [poses]);

  return !poses ? (
    <>
      {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={5} />
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
      {poses && <Animator poses={poses} />}
      {poses && <Dresser pose={poses[0]} />}
    </>
  );
}

export default App;
