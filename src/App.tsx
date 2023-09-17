import { useState } from 'react';
import './App.css';
import { Recorder, RecorderResult } from './recorder/Recorder';
import type { Pose } from './useEstimator';
import poses from './poses.json';
import { FrameFileDownloader } from './FrameFileDownloader';
import { DownloadForm } from './DownloadForm';
import { FrameFileLoader } from './FrameFileLoader';
function App() {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(null);

  return  (
    // <Animator poses={poses} />
    <div className="bg-gray-900 flex flex-col items-center" style={{ height: '100vh' }}>
      {/* {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={20} />
      )}
      {recorderResult && <FrameFileDownloader recorderResult={recorderResult} />} */}
      <FrameFileLoader onLoaded={(frames) => setRecorderResult({ frames, resolution: frames[0] })} />
      {recorderResult && <DownloadForm frames={recorderResult.frames} />}
    </div>
  );
}

export default App;
