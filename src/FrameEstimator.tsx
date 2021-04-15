import React from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { useEffect, useState } from 'react';
import type { RecorderResult } from './Recorder';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
// import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

export function FrameEstimator({
  resolution,
  frames,
  onComplete,
}: {
  frames: ImageData[];
  resolution: {
    width: number;
    height: number;
  };
  onComplete: (poses: posenet.Pose[]) => void;
}) {
  const [poses, setPoses] = useState<(posenet.Pose | null)[]>(frames.map(() => null));

  useEffect(() => {
    if (poses.every((p): p is posenet.Pose => p != null)) {
      console.log(JSON.stringify(poses));
      onComplete(poses);
    }
  }, [poses]);

  useEffect(() => {
    posenet
      .load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: resolution,
        quantBytes: 2,
      })
      .then((net) => {
        setPoses(frames.map(() => null));

        frames.map((frame, frameIndex) => {
          net
            .estimateSinglePose(frame, {
              flipHorizontal: false,
            })
            .then((currentPose) => {
              setPoses((poses) => poses.map((pose, poseIndex) => (poseIndex === frameIndex ? currentPose : pose)));
            });
        });
      });
  }, [frames]);

  const divSize = {
    width: resolution.width + 'px',
    height: resolution.height + 'px',
  };

  return (
    <>
      <div>
        Estimated {poses.filter((x) => x).length}/{poses.length}
      </div>
      {poses.map(
        (pose) =>
          pose && (
            <div
              style={{
                position: 'relative',
                background: '#ccc',
                ...divSize,
              }}
            >
              {pose.keypoints.map((keypoint) => {
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
          ),
      )}
    </>
  );
}
