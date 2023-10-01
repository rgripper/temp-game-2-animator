import { FrameBatchStorage } from "./FrameBatchStorage";

export function FrameFileDownloader() {
  return (
    <button
      className="btn btn-outline"
      onClick={() => new FrameBatchStorage().download()}
    >
      Download
    </button>
  );
}
