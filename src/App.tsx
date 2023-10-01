import { useState } from "react";
import "./App.css";
import { Recorder, RecorderResult } from "./recorder/Recorder";
import { FrameFileDownloader } from "./FrameFileDownloader";
import { DownloadForm } from "./DownloadForm";
import { FrameFileLoader } from "./FrameFileLoader";
import { FrameBatchStorage } from "./FrameBatchStorage";

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
      {!recorderResult && (
        <Recorder
          onComplete={setRecorderResult}
          countdownSeconds={3}
          durationSeconds={2}
          framesPerSec={20}
        />
      )}
      <div>
        <FileStorage
          recorderResult={recorderResult}
          setRecorderResult={setRecorderResult}
        />
      </div>
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
          new FrameBatchStorage().save(recorderResult.frames);
        }}
      >
        Save
      </button>
      <button
        className="btn btn-outline"
        onClick={async () => {
          const data = await new FrameBatchStorage().load();
          if (!data) return;
          setRecorderResult({ frames: data, resolution: data[0] });
        }}
      >
        Load
      </button>
      <button
        className="btn btn-outline"
        onClick={async () => {
          await new FrameBatchStorage().clear();
          setRecorderResult(null);
        }}
      >
        Clear
      </button>
      <FrameFileDownloader />
    </>
  );
}

export default App;
