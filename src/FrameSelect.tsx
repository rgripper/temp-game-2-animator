import { css } from '@emotion/css';
import React from 'react';
import { getKeypointMap, KeypointMap, normalizeMap } from './bodyMath';
import type { Pose } from './FrameEstimator';
import helmetUrl from './helmet.png';
import { NormalizedFramePose } from './NormalizedFramePose';

export function FrameSelect({ poses }: { poses: Pose[] }) {
  return (
    <>
      {poses.map((x) => (
        <NormalizedFramePose pose={x} />
      ))}
    </>
  );
}

const bodyStyles = css`
  line {
    stroke: black;
    stroke-width: 5;
  }

  * {
    opacity: 0.5;
  }
`;

type CharacterDirection = 'right' | 'left' | 'front' | 'back';

function FramePose({ pose }: { pose: Pose }) {
  const originalKeypointMap = getKeypointMap(pose);
  const keypointMap = normalizeMap(originalKeypointMap);
  const srcTorsoRect = {
    x1: (keypointMap.left_shoulder.x + keypointMap.left_hip.x) / 2,
    x2: (keypointMap.right_shoulder.x + keypointMap.right_hip.x) / 2,
    y1: (keypointMap.left_shoulder.y + keypointMap.right_shoulder.y) / 2,
    y2: (keypointMap.left_hip.y + keypointMap.right_hip.y) / 2,
  };

  const torsoRect = {
    ...srcTorsoRect,
    x2: srcTorsoRect.x1 - 40,
  };

  const torsoTopMidX = (torsoRect.x1 + torsoRect.x2) / 2;
  const characterDirection = keypointMap.nose.x < torsoTopMidX ? 'left' : 'right';

  return (
    <svg className={bodyStyles} viewBox="0 0 800 800" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
      <Head keypointMap={keypointMap} />
      <Neck keypointMap={keypointMap} torsoRect={torsoRect} />
      {/** Neck */}
      <line
        x1={keypointMap.left_shoulder.x}
        y1={keypointMap.left_shoulder.y}
        x2={keypointMap.right_shoulder.x}
        y2={keypointMap.right_shoulder.y}
      />
      {/** Left arm */}
      <Limb
        x1={keypointMap.left_shoulder.x}
        y1={keypointMap.left_shoulder.y}
        x2={keypointMap.left_elbow.x}
        y2={keypointMap.left_elbow.y}
      />
      <line
        x1={keypointMap.left_shoulder.x}
        y1={keypointMap.left_shoulder.y}
        x2={keypointMap.left_elbow.x}
        y2={keypointMap.left_elbow.y}
      />
      <line
        x1={keypointMap.left_elbow.x}
        y1={keypointMap.left_elbow.y}
        x2={keypointMap.left_wrist.x}
        y2={keypointMap.left_wrist.y}
      />
      {/** Right arm */}
      <Limb
        x1={keypointMap.right_shoulder.x}
        y1={keypointMap.right_shoulder.y}
        x2={keypointMap.right_elbow.x}
        y2={keypointMap.right_elbow.y}
      />
      <line
        x1={keypointMap.right_shoulder.x}
        y1={keypointMap.right_shoulder.y}
        x2={keypointMap.right_elbow.x}
        y2={keypointMap.right_elbow.y}
      />
      <line
        x1={keypointMap.right_elbow.x}
        y1={keypointMap.right_elbow.y}
        x2={keypointMap.right_wrist.x}
        y2={keypointMap.right_wrist.y}
      />
      <Torso torsoRect={torsoRect} />
      {/** Pelvis */}
      <line
        x1={keypointMap.left_hip.x}
        y1={keypointMap.left_hip.y}
        x2={keypointMap.right_hip.x}
        y2={keypointMap.right_hip.y}
      />
      {/** Left leg */}
      <Limb
        x1={keypointMap.left_hip.x}
        y1={keypointMap.left_hip.y}
        x2={keypointMap.left_knee.x}
        y2={keypointMap.left_knee.y}
      />
      <line
        x1={keypointMap.left_hip.x}
        y1={keypointMap.left_hip.y}
        x2={keypointMap.left_knee.x}
        y2={keypointMap.left_knee.y}
      />
      <line
        x1={keypointMap.left_knee.x}
        y1={keypointMap.left_knee.y}
        x2={keypointMap.left_ankle.x}
        y2={keypointMap.left_ankle.y}
      />
      {/** Left leg */}
      <Limb
        x1={keypointMap.right_hip.x}
        y1={keypointMap.right_hip.y}
        x2={keypointMap.right_knee.x}
        y2={keypointMap.right_knee.y}
      />
      <line
        x1={keypointMap.right_hip.x}
        y1={keypointMap.right_hip.y}
        x2={keypointMap.right_knee.x}
        y2={keypointMap.right_knee.y}
      />
      <line
        x1={keypointMap.right_knee.x}
        y1={keypointMap.right_knee.y}
        x2={keypointMap.right_ankle.x}
        y2={keypointMap.right_ankle.y}
      />
    </svg>
  );
}

function Head({ keypointMap }: { keypointMap: KeypointMap }) {
  const width = 40; // Math.abs(keypointMap.right_ear.x - keypointMap.left_ear.x) + 5;
  const midX = (keypointMap.right_ear.x + keypointMap.left_ear.x) / 2;
  return (
    // <rect x={midX - width / 2} y={keypointMap.nose.y - width / 2} width={width} height={width} fill="blue">
    // </rect>
    <image
      x={midX - width / 2}
      y={keypointMap.nose.y - width / 2}
      width={width}
      height={width}
      href={helmetUrl}
    ></image>
  );
}

function Neck({ keypointMap, torsoRect }: { keypointMap: KeypointMap; torsoRect: Rectangle }) {
  return (
    <line x1={(torsoRect.x1 + torsoRect.x2) / 2} y1={torsoRect.y1} x2={keypointMap.nose.x} y2={keypointMap.nose.y} />
  );
}

type Rectangle = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function Torso({ torsoRect }: { torsoRect: Rectangle }) {
  const width = Math.abs(torsoRect.x1 - torsoRect.x2);
  const height = Math.abs(torsoRect.y1 - torsoRect.y2);

  return (
    <rect
      x={(torsoRect.x1 + torsoRect.x2) / 2}
      y={(torsoRect.y1 + torsoRect.y2) / 2}
      width={width}
      height={height}
      transform={`translate(-${width / 2} -${height / 2})`}
      fill="pink"
    ></rect>
  );
}

function Limb({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angleDeg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI - 90;
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${angleDeg})`}>
      <rect width={20} height={length} fill="red" transform={`translate(-10 0)`}></rect>
    </g>
  );
}
