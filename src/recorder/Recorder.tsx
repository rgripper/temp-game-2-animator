import { useEffect, useState } from "react";
import { CameraDisplay } from "./CameraDisplay";
import useInterval from "../useInterval";
import { Countdown } from "./Countdown";

export type RecorderResult = {
  frames: ImageData[];
  resolution: { width: number; height: number };
};

const constraints = {
  video: { facingMode: "environment" },
};

export function Recorder({
  onComplete,
  countdownSeconds,
  durationSeconds,
  framesPerSec,
}: RecorderProps) {
  const camera = useCamera(constraints);
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [canRecord, setCanRecord] = useState(false);
  const { isComplete, progress, frames } = useRecorder({
    video: canRecord ? video : undefined,
    durationSeconds,
    framesPerSec,
  });

  useEffect(() => {
    if (camera && video && isComplete) {
      camera
        .getTracks()
        .filter((track) => track.readyState == "live")
        .forEach((track) => track.stop());
      onComplete({
        frames,
        resolution: { width: video.videoWidth, height: video.videoHeight },
      });
    }
  }, [video, isComplete, frames, camera, onComplete]);

  return (
    <div className={`h-full w-full flex flex-col justify-center items-center`}>
      {video && (
        <div className={`h-2 bg-gray-700`} style={{ width: video.width }}>
          <div
            className={`h-2 transition-width bg-yellow-500`}
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
      )}
      <div className={`relative grid place-items-center`}>
        {camera && <CameraDisplay source={camera} onReady={setVideo} />}
        {camera && !canRecord && (
          <Countdown
            seconds={countdownSeconds}
            onCompleted={() => setCanRecord(true)}
          />
        )}
      </div>
    </div>
  );
}

const useRecorder = ({
  video,
  durationSeconds,
  framesPerSec,
}: {
  video: HTMLVideoElement | undefined;
  durationSeconds: number;
  framesPerSec: number;
}) => {
  const [frames, setFrames] = useState<ImageData[]>([]);
  const maxFrameCount = durationSeconds * framesPerSec;

  useInterval(async (intervalId) => {
    if (!video || !durationSeconds || !framesPerSec) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!("OffscreenCanvas" in globalThis)) {
      throw new Error("Set gfx.offscreencanvas.enabled=true in about:config");
    }

    const offscreen = new OffscreenCanvas(width, height);
    const context = offscreen.getContext("2d");
    if (!context) {
      throw new Error("context is null");
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(video, 0, 0, width, height);
    const frame = context.getImageData(0, 0, width, height);

    setFrames((frames) => {
      const newFrames = [...frames, frame];
      if (newFrames.length === maxFrameCount) {
        clearInterval(intervalId);
      }

      return newFrames;
    });
  }, 1000 / framesPerSec);

  return {
    isComplete: maxFrameCount == frames.length,
    frames,
    progress: frames.length / maxFrameCount,
  };
};

const useCamera = (constraints: MediaStreamConstraints) => {
  const [stream, setStream] = useState<MediaStream>();
  useEffect(() => {
    let lastStream: MediaStream | undefined = undefined;
    navigator.mediaDevices.getUserMedia(constraints).then((x) => {
      lastStream = x;
      setStream(x);
    });
    () => {
      lastStream
        ?.getTracks()
        .filter((track) => track.readyState == "live")
        .forEach((track) => track.stop());
      setStream(undefined);
    };
  }, [constraints]);
  return stream;
};

type RecorderProps = {
  onComplete: (result: RecorderResult) => void;
  countdownSeconds: number;
  durationSeconds: number;
  framesPerSec: number;
};
