import React from 'react';
import type { Pose } from '@tensorflow-models/posenet';
import type { Vector2D } from '@tensorflow-models/posenet/dist/types';

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
  | 'leftEye'
  | 'rightEye'
  | 'leftEar'
  | 'rightEar'
  | 'leftShoulder'
  | 'rightShoulder'
  | 'leftElbow'
  | 'rightElbow'
  | 'leftWrist'
  | 'rightWrist'
  | 'leftHip'
  | 'rightHip'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftAnkle'
  | 'rightAnkle',
  Vector2D
>;

function FramePose({ pose }: { pose: Pose }) {
  const keypointMap = (Object.fromEntries(pose.keypoints.map((x) => [x.part, x.position])) as unknown) as KeypointMap;

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      {/** Neck */}
      <line
        x1={keypointMap.leftShoulder.x + (keypointMap.rightShoulder.x + keypointMap.leftShoulder.x) / 2}
        y1={(keypointMap.leftShoulder.y + keypointMap.rightShoulder.y) / 2}
        x2={keypointMap.nose.x}
        y2={keypointMap.nose.y}
        stroke="black"
      />
      <line
        x1={keypointMap.leftShoulder.x}
        y1={keypointMap.leftShoulder.y}
        x2={keypointMap.rightShoulder.x}
        y2={keypointMap.rightShoulder.y}
        stroke="black"
      />
      {/** Left arm */}
      <line
        x1={keypointMap.leftShoulder.x}
        y1={keypointMap.leftShoulder.y}
        x2={keypointMap.leftElbow.x}
        y2={keypointMap.leftElbow.y}
        stroke="black"
      />
      <line
        x1={keypointMap.leftElbow.x}
        y1={keypointMap.leftElbow.y}
        x2={keypointMap.leftWrist.x}
        y2={keypointMap.leftWrist.y}
        stroke="black"
      />
      {/** Right arm */}
      <line
        x1={keypointMap.rightShoulder.x}
        y1={keypointMap.rightShoulder.y}
        x2={keypointMap.rightElbow.x}
        y2={keypointMap.rightElbow.y}
        stroke="black"
      />
      <line
        x1={keypointMap.rightElbow.x}
        y1={keypointMap.rightElbow.y}
        x2={keypointMap.rightWrist.x}
        y2={keypointMap.rightWrist.y}
        stroke="black"
      />
      {/** Left leg */}
      <line
        x1={keypointMap.leftHip.x}
        y1={keypointMap.leftHip.y}
        x2={keypointMap.leftKnee.x}
        y2={keypointMap.leftKnee.y}
        stroke="black"
      />
      <line
        x1={keypointMap.leftKnee.x}
        y1={keypointMap.leftKnee.y}
        x2={keypointMap.leftAnkle.x}
        y2={keypointMap.leftAnkle.y}
        stroke="black"
      />
      {/** Left leg */}
      <line
        x1={keypointMap.rightHip.x}
        y1={keypointMap.rightHip.y}
        x2={keypointMap.rightKnee.x}
        y2={keypointMap.rightKnee.y}
        stroke="black"
      />
      <line
        x1={keypointMap.rightKnee.x}
        y1={keypointMap.rightKnee.y}
        x2={keypointMap.rightAnkle.x}
        y2={keypointMap.rightAnkle.y}
        stroke="black"
      />
    </svg>
  );
}
