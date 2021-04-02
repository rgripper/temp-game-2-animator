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

type AppProps = {};

function App({}: AppProps) {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);
  const [poses, setPoses] = useState<Pose[] | null>(() => {
    const storedPosesJson = window.localStorage.getItem('poses');
    return storedPosesJson && JSON.parse(storedPosesJson);
  });

  useEffect(() => {
    if (poses) {
      window.localStorage.setItem('poses', JSON.stringify(poses));
    }
  }, [poses]);

  return (
    <>
      {!recorderResult && <Recorder onComplete={setRecorderResult} />}
      {recorderResult && !poses && <FrameEstimator recorderResult={recorderResult} onComplete={setPoses} />}
      {poses && <Animator poses={poses} />}
    </>
  );
}

export default App;
