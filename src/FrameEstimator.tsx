import React from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import type { RecorderResult } from './Recorder';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';

export type Pose = poseDetection.Pose;
export type Keypoint = poseDetection.Keypoint;
export type Point = { x: number; y: number; z?: number };

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
  onComplete: (poses: poseDetection.Pose[]) => void;
}) {
  const [poses, setPoses] = useState<(poseDetection.Pose | null)[]>(frames.map(() => null));

  useEffect(() => {
    if (poses.every((p): p is poseDetection.Pose => p != null)) {
      console.log(JSON.stringify(poses));
      onComplete(poses);
    }
  }, [poses]);

  useEffect(() => {
    async function detect() {
      try {
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true,
        });
        setPoses(frames.map(() => null));

        const allPosesPromises = frames.map(async (frame, frameIndex) => {
          const [pose] = await detector.estimatePoses(frame, {
            flipHorizontal: false,
            maxPoses: 1,
          });

          return { pose, frameIndex };
        });

        for await (const { frameIndex, pose: currentPose } of allPosesPromises) {
          setPoses((poses) => poses.map((pose, poseIndex) => (poseIndex === frameIndex ? currentPose : pose)));
        }
      } catch (error) {
        console.error(error);
      }
    }
    detect().then();
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
                const hasPosition = keypoint.x !== undefined && keypoint.y !== undefined;
                //hasPosition &&
                //console.log(resolution, keypoint.part, keypoint.position);
                return (
                  hasPosition && (
                    <div
                      key={keypoint.name}
                      title={keypoint.name}
                      style={{
                        position: 'absolute',
                        left: Math.ceil(keypoint.x) + 'px',
                        top: Math.ceil(keypoint.y) + 'px',
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
