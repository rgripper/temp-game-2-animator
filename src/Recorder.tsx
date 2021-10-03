import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import useInterval from './useInterval';

export type RecorderResult = { frames: ImageData[]; resolution: { width: number; height: number } };

type AppProps = {
  onComplete: (result: RecorderResult) => void;
  countdownSeconds: number;
  durationSeconds: number;
  framesPerSec: number;
};

function useCountdown(seconds: number): number {
  const [countdown, setCountdown] = useState(seconds);
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;

  useEffect(() => {
    let isCancelled = false;
    function runCountdown() {
      setTimeout(() => {
        if (isCancelled || countdownRef.current === 0) {
          return;
        }
        setCountdown((x) => x - 1);
        runCountdown();
      }, 1000);
    }
    runCountdown();
    return () => {
      isCancelled = true;
    };
  }, [seconds]);

  return countdown;
}

type RecordingParams = {
  context: OffscreenCanvasRenderingContext2D;
  video: HTMLVideoElement;
  resolution: {
    width: number;
    height: number;
  };
};

export function Recorder({ onComplete, countdownSeconds, durationSeconds, framesPerSec }: AppProps) {
  // const videoRef = useRef<HTMLVideoElement | null>(null)
  const countdown = useCountdown(countdownSeconds);

  const [frames, setFrames] = useState<ImageData[]>([]);

  const [isRecordingComplete, setIsRecordingComplete] = useState(false);

  const [recordingParams, setRecordingParams] = useState<RecordingParams | null>(null);

  useEffect(() => {
    if (recordingParams && isRecordingComplete) {
      onComplete({ frames, resolution: recordingParams.resolution });
    }
  }, [recordingParams, isRecordingComplete, frames]);

  const setVideoAndCanvas = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

    const constraints = {
      video: { facingMode: "environment" },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
    });
  }, []);

  useInterval(async (intervalId) => {
    if (!recordingParams || countdown > 0) return;
    const { resolution, context, video } = recordingParams;
    context.clearRect(0, 0, resolution.width, resolution.height);
    context.drawImage(video, 0, 0, resolution.width, resolution.height);
    const frame = context.getImageData(0, 0, resolution.width, resolution.height);

    setFrames((frames) => {
      if (frames.length === durationSeconds * framesPerSec) {
        clearInterval(intervalId);
        setIsRecordingComplete(true);
        return frames;
      } else {
        return [...frames, frame];
      }
    });
  }, 1000 / framesPerSec);

  const prepareRecording = useCallback(async (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.currentTarget;
    const resolution = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    if (!('OffscreenCanvas' in globalThis)) {
      throw new Error('Set gfx.offscreencanvas.enabled=true in about:config');
    }

    const offscreen = new OffscreenCanvas(resolution.width, resolution.height);
    const context = offscreen.getContext('2d');
    if (!context) {
      throw new Error('context is null');
    }

    video.width = resolution.width;
    video.height = resolution.height;

    setRecordingParams({
      resolution,
      context,
      video,
    });
  }, []);

  return (
    <div
      className="App"
      style={{
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video id="vid" ref={setVideoAndCanvas} onLoadedData={prepareRecording} autoPlay></video>
      {countdown > 0 && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            fontSize: 500,
            top: 0,
            left: 0,
            textAlign: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {countdown}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          top: 0,
          left: 0,
          textAlign: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {isRecordingComplete ? 'Done' : `Recording ${frames.length}/${durationSeconds * framesPerSec}`}
      </div>
    </div>
  );
}
