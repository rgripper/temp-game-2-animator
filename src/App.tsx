import { useEffect, useState } from "react";
import "./App.css";
import { Recorder, RecorderResult } from "./recorder/Recorder";
import type { Pose } from "./useEstimator";
import poses from "./poses.json";
import { FrameFileDownloader } from "./FrameFileDownloader";
import { DownloadForm } from "./DownloadForm";
import { FrameFileLoader } from "./FrameFileLoader";
import { FrameStorage } from "./ImageStorage";
import { detectorClient } from "./detectorClient";

function App() {
  const [recorderResult, setRecorderResult] = useState<RecorderResult | null>(
    null,
  );

  return (
    // <Animator poses={poses} />
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: "100vh" }}
    >
      {/* {!recorderResult && (
        <Recorder onComplete={setRecorderResult} countdownSeconds={3} durationSeconds={2} framesPerSec={20} />
      )}
      {recorderResult && <FrameFileDownloader recorderResult={recorderResult} />} */}
      <FileStorage
        recorderResult={recorderResult}
        setRecorderResult={setRecorderResult}
      />
      <FrameFileLoader
        onLoaded={(frames) =>
          setRecorderResult({ frames, resolution: frames[0] })
        }
      />
      {recorderResult && <DownloadForm frames={recorderResult.frames} />}
    </div>
  );
}

function FileStorage({
  setRecorderResult,
  recorderResult,
}: {
  setRecorderResult: (recorderResult: RecorderResult | null) => void;
  recorderResult: RecorderResult | null;
}) {
  return (
    <>
      <button
        className="btn btn-outline"
        onClick={() => {
          if (!recorderResult) return;
          new FrameStorage().save(recorderResult.frames);
        }}
      >
        Save
      </button>
      <button
        className="btn btn-outline"
        onClick={async () => {
          const data = await new FrameStorage().load();
          if (!data) return;
          setRecorderResult({ frames: data, resolution: data[0] });
        }}
      >
        Load
      </button>
    </>
  );
}

export default App;
