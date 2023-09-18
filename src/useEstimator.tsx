import React from "react";
import type * as poseDetection from "@tensorflow-models/pose-detection";
import { useEffect, useState } from "react";
import * as Comlink from "comlink";

export type Pose = poseDetection.Pose;
export type Keypoint = poseDetection.Keypoint;
export type Point = { x: number; y: number; z?: number };
export type EstimationState = { pose: Pose | null; isEstimating: boolean };

const defaultEstimationState = { pose: null, isEstimating: false };

const worker = new Worker(new URL("./detector", import.meta.url), {
  type: "module",
});
const detector = Comlink.wrap<{
  estimateFrame: (frame: ImageData) => poseDetection.Pose;
}>(worker);

export function useEstimator(frames: ImageData[]) {
  const [estimationStates, setEstimationStates] = useState<EstimationState[]>(
    frames.map(() => defaultEstimationState),
  );

  useEffect(() => {
    async function detect() {
      setEstimationStates(frames.map(() => defaultEstimationState));

      await Promise.all(
        frames.map(async (frame, frameIndex) => {
          setEstimationStates((estimationStates) =>
            estimationStates.map((es, index) =>
              index === frameIndex && !es.pose
                ? { pose: null, isEstimating: true }
                : es,
            ),
          );
          console.log("Sending frame", frameIndex, frame);
          const currentPose = await detector.estimateFrame(frame);
          console.log("Received a pose", currentPose);

          setEstimationStates((estimationStates) =>
            estimationStates.map((es, index) =>
              index === frameIndex
                ? { pose: currentPose, isEstimating: false }
                : es,
            ),
          );
        }),
      );
    }
    detect().then();
  }, [frames]);
  return estimationStates;
}
