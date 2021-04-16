import React, { useEffect, useState } from 'react';
import './App.css';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { Recorder, RecorderResult } from './Recorder';
import { FrameEstimator } from './FrameEstimator';
import type { Pose } from '@tensorflow-models/posenet';
import { Animator } from './Animator';
import { FrameListPreview } from './FrameListPreview';
import posesJson from './poses.json';

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

  return (
    <>
      {/* {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={1} framesPerSec={10} />
      )}
      {recorderResult && !selectedFrames && (
        <FrameListPreview onSelect={setSelectedFrames} frames={recorderResult.frames} />
      )}
      {recorderResult && selectedFrames && !poses && (
        <FrameEstimator frames={selectedFrames} resolution={recorderResult.resolution} onComplete={setPoses} />
      )} */}
      {poses && <Animator poses={poses} />}
    </>
  );
}

export default App;
