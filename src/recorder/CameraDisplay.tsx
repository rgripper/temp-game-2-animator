import React, { useCallback } from 'react';

export const CameraDisplay = ({
  source,
  onReady,
}: {
  source: MediaStream;
  onReady: (video: HTMLVideoElement) => void;
}) => {
  const setVideoAndCanvas = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

    video.srcObject = source;
  }, []);

  const prepareRecording = useCallback(async (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.currentTarget;
    video.width = video.videoWidth;
    video.height = video.videoHeight;
    video.play();
    onReady(video);
  }, []);
  return <video id="vid" ref={setVideoAndCanvas} onLoadedData={prepareRecording}></video>;
};
