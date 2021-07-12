import React from 'react';
import type { Point, Pose } from './FrameEstimator';

export function Animator({ poses }: { poses: Pose[] }) {
  return (
    <>
      {poses.map((x) => (
        <FramePose pose={x} />
      ))}
    </>
  );
}

type KeypointMap = Record<
  | 'nose'
  | 'left_eye'
  | 'right_eye'
  | 'left_ear'
  | 'right_ear'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'left_elbow'
  | 'right_elbow'
  | 'left_wrist'
  | 'right_wrist'
  | 'left_hip'
  | 'right_hip'
  | 'left_knee'
  | 'right_knee'
  | 'left_ankle'
  | 'right_ankle',
  Point
>;

function FramePose({ pose }: { pose: Pose }) {
  const keypointMap = (Object.fromEntries(
    pose.keypoints.map((keypoint) => [keypoint.name, { x: keypoint.x, y: keypoint.y, z: keypoint.z }]),
  ) as unknown) as KeypointMap;

  return (
    <svg viewBox="0 0 500 500" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      {/** Neck */}
      <line
        x1={keypointMap.left_shoulder.x + (keypointMap.right_shoulder.x - keypointMap.left_shoulder.x) / 2}
        y1={(keypointMap.left_shoulder.y + keypointMap.right_shoulder.y) / 2}
        x2={keypointMap.nose.x}
        y2={keypointMap.nose.y}
        stroke="black"
      />
      <line
        x1={keypointMap.left_shoulder.x}
        y1={keypointMap.left_shoulder.y}
        x2={keypointMap.right_shoulder.x}
        y2={keypointMap.right_shoulder.y}
        stroke="black"
      />
      {/** Left arm */}
      <line
        x1={keypointMap.left_shoulder.x}
        y1={keypointMap.left_shoulder.y}
        x2={keypointMap.left_elbow.x}
        y2={keypointMap.left_elbow.y}
        stroke="black"
      />
      <line
        x1={keypointMap.left_elbow.x}
        y1={keypointMap.left_elbow.y}
        x2={keypointMap.left_wrist.x}
        y2={keypointMap.left_wrist.y}
        stroke="black"
      />
      {/** Right arm */}
      <line
        x1={keypointMap.right_shoulder.x}
        y1={keypointMap.right_shoulder.y}
        x2={keypointMap.right_elbow.x}
        y2={keypointMap.right_elbow.y}
        stroke="black"
      />
      <line
        x1={keypointMap.right_elbow.x}
        y1={keypointMap.right_elbow.y}
        x2={keypointMap.right_wrist.x}
        y2={keypointMap.right_wrist.y}
        stroke="black"
      />
      {/** Pelvis */}
      <line
        x1={keypointMap.left_hip.x}
        y1={keypointMap.left_hip.y}
        x2={keypointMap.right_hip.x}
        y2={keypointMap.right_hip.y}
        stroke="black"
      />
      {/** Left leg */}
      <line
        x1={keypointMap.left_hip.x}
        y1={keypointMap.left_hip.y}
        x2={keypointMap.left_knee.x}
        y2={keypointMap.left_knee.y}
        stroke="black"
      />
      <line
        x1={keypointMap.left_knee.x}
        y1={keypointMap.left_knee.y}
        x2={keypointMap.left_ankle.x}
        y2={keypointMap.left_ankle.y}
        stroke="black"
      />
      {/** Left leg */}
      <line
        x1={keypointMap.right_hip.x}
        y1={keypointMap.right_hip.y}
        x2={keypointMap.right_knee.x}
        y2={keypointMap.right_knee.y}
        stroke="black"
      />
      <line
        x1={keypointMap.right_knee.x}
        y1={keypointMap.right_knee.y}
        x2={keypointMap.right_ankle.x}
        y2={keypointMap.right_ankle.y}
        stroke="black"
      />
    </svg>
  );
}
