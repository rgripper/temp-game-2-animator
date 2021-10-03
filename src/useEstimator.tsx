import React from 'react';
import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';
import * as Comlink from 'comlink';

export type Pose = poseDetection.Pose;
export type Keypoint = poseDetection.Keypoint;
export type Point = { x: number; y: number; z?: number };

const worker = new Worker(new URL('./detector.js', import.meta.url), { type: 'module' });
const detector = Comlink.wrap(worker);

export function useEstimator(frames: ImageData[]) {
  const [poses, setPoses] = useState<(poseDetection.Pose | null)[]>(frames.map(() => null));

  useEffect(() => {
    async function detect() {
      setPoses(frames.map(() => null));

      await Promise.all(
        frames.map(async (frame, frameIndex) => {
          const currentPose = await (detector as any).estimateFrame(frame, {
            flipHorizontal: false,
            maxPoses: 1,
          });

          setPoses((poses) => poses.map((pose, poseIndex) => (poseIndex === frameIndex ? currentPose : pose)));
        }),
      );
    }
    detect().then();
  }, [frames]);
  return poses;
}
