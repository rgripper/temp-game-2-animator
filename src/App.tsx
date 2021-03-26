import React, { useCallback, useState } from 'react';
import './App.css';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

type AppProps = {};

function App({}: AppProps) {
  // const videoRef = useRef<HTMLVideoElement | null>(null)
  const [keypoints, setKeypoints] = useState<posenet.Keypoint[]>([]);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const setVideo = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
    });
  }, []);

  const startEstimation = useCallback(
    async (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const video = event.currentTarget;
      const inputResolution = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      video.width = inputResolution.width;
      video.height = inputResolution.height;
      console.log('resolution', inputResolution);
      const net = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution,
        quantBytes: 2,
      });

      setResolution(inputResolution);

      setInterval(async () => {
        const pose = await net.estimateSinglePose(video, {
          flipHorizontal: false,
        });

        setKeypoints(pose.keypoints);
      }, 1000);
    },
    [],
  );

  const divSize = resolution && {
    width: resolution.width + 'px',
    height: resolution.height + 'px',
  };

  return (
    <div className="App" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          ...(divSize || {}),
        }}
      >
        {resolution &&
          keypoints.map((keypoint) => {
            const hasPosition = !!(keypoint.position.x && keypoint.position.y);
            //hasPosition &&
            //console.log(resolution, keypoint.part, keypoint.position);
            return (
              hasPosition && (
                <div
                  key={keypoint.part}
                  title={keypoint.part}
                  style={{
                    position: 'absolute',
                    left: Math.ceil(keypoint.position.x) + 'px',
                    top: Math.ceil(keypoint.position.y) + 'px',
                    width: '10px',
                    height: '10px',
                    background: 'green',
                  }}
                />
              )
            );
          })}
      </div>
      <video
        id="vid"
        ref={setVideo}
        onLoadedData={startEstimation}
        autoPlay
      ></video>
    </div>
  );
}

export default App;
