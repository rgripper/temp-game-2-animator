import React from 'react';
import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import * as Comlink from 'comlink';

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
      const worker = new Worker(new URL('./detector.js', import.meta.url), { type: 'module' });
      const detector = Comlink.wrap(worker);

      try {
        setPoses(frames.map(() => null));

        let frameIndex = 0;
        for (const frame of frames) {
          const currentPose = await (detector as any).estimateFrame(frame, {
            flipHorizontal: false,
            maxPoses: 1,
          });

          let frameIndex_ = frameIndex;
          setPoses((poses) => poses.map((pose, poseIndex) => (poseIndex === frameIndex_ ? currentPose : pose)));
          frameIndex++;
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
