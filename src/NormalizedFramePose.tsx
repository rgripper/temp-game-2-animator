import { css } from '@emotion/css';
import React from 'react';
import type { KeypointMap } from './bodyMath';
import type { Pose } from './FrameEstimator';
import helmetUrl from './helmet.png';
import swordUrl from './sword3.png';

const bodyStyles = css`
  line {
    stroke: black;
    stroke-width: 5;
  }

  * {
    opacity: 0.5;
  }
`;

export function NormalizedFramePose({ pose }: { pose: Pose }) {
  const keypointMap = getKeypointMap(pose);
  const { torsoRect } = normalizeMap(keypointMap);

  return (
    <svg className={bodyStyles} viewBox="0 0 800 800" width="500" height="500" xmlns="http://www.w3.org/2000/svg">
      <Head keypointMap={keypointMap} />
      <Neck keypointMap={keypointMap} torsoRect={torsoRect} />
      <Sword keypointMap={keypointMap} />
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
  const width = 50; // Math.abs(keypointMap.right_ear.x - keypointMap.left_ear.x) + 5;
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

function Sword({ keypointMap }: { keypointMap: KeypointMap }) {
  const angleDeg =
    (Math.atan2(
      keypointMap.right_elbow.y - keypointMap.right_wrist.y,
      keypointMap.right_elbow.x - keypointMap.right_wrist.x,
    ) *
      180) /
    Math.PI;
  const { x, y } = keypointMap.right_wrist;

  return (
    <g transform={`translate(${x} ${y}) rotate(${angleDeg})`}>
      <image width={40} height={200} transform={`translate(${-15} ${-160})`} href={swordUrl}></image>
    </g>
  );
}

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

function getKeypointMap(pose: Pose): KeypointMap {
  return Object.fromEntries(
    pose.keypoints.map((keypoint) => [keypoint.name, { x: keypoint.x, y: keypoint.y, z: keypoint.z }]),
  ) as unknown as KeypointMap;
}

function normalizeMap(keypointMap: KeypointMap): { keypointMap: KeypointMap; torsoRect: any } {
  const torsoRaw = {
    x1: keypointMap.left_shoulder.x,
    x2: keypointMap.right_shoulder.x,
    y1: keypointMap.left_shoulder.y,
    y2: keypointMap.right_shoulder.y,
  };

  const torsoAvgX = (torsoRaw.x1 + torsoRaw.x2) / 2;
  const torsoAvgY = (torsoRaw.y1 + torsoRaw.y2) / 2;

  const halfWidth = 20;
  const halfHeight = 60;

  const isLeft = keypointMap.left_shoulder.x < keypointMap.right_shoulder.x;

  const torsoRect = {
    x1: torsoAvgX + (isLeft ? -halfWidth : +halfWidth),
    x2: torsoAvgX + (isLeft ? +halfWidth : -halfWidth),
    y1: torsoAvgY - halfHeight,
    y2: torsoAvgY + halfHeight,
  };

  const torsoParts = {
    left_shoulder: {
      x: torsoRect.x1,
      y: torsoRect.y1,
    },
    right_shoulder: {
      x: torsoRect.x2,
      y: torsoRect.y1,
    },
    left_hip: {
      x: torsoRect.x1,
      y: torsoRect.y2,
    },
    right_hip: {
      x: torsoRect.x2,
      y: torsoRect.y2,
    },
  };

  const upperShiftX =
    (torsoParts.left_shoulder.x -
      keypointMap.left_shoulder.x +
      (torsoParts.right_shoulder.x - keypointMap.right_shoulder.x)) /
    2;
  const upperShiftY =
    (torsoParts.left_shoulder.y -
      keypointMap.left_shoulder.y +
      (torsoParts.right_shoulder.y - keypointMap.right_shoulder.y)) /
    2;

  const lowerShiftX =
    (torsoParts.left_hip.x - keypointMap.left_hip.x + (torsoParts.right_hip.x - keypointMap.right_hip.x)) / 2;
  const lowerShiftY =
    (torsoParts.left_hip.y - keypointMap.left_hip.y + (torsoParts.right_hip.y - keypointMap.right_hip.y)) / 2;

  const normalizedKeypointMap = {
    ...keypointMap, // TODO
    ...torsoParts,
    nose: {
      x: keypointMap.nose.x + upperShiftX,
      y: keypointMap.nose.y + upperShiftY,
    },
    left_elbow: {
      x: keypointMap.left_elbow.x + upperShiftX,
      y: keypointMap.left_elbow.y + upperShiftY,
    },
    right_elbow: {
      x: keypointMap.right_elbow.x + upperShiftX,
      y: keypointMap.right_elbow.y + upperShiftY,
    },
    left_wrist: {
      x: keypointMap.left_wrist.x + upperShiftX,
      y: keypointMap.left_wrist.y + upperShiftY,
    },
    right_wrist: {
      x: keypointMap.right_wrist.x + upperShiftX,
      y: keypointMap.right_wrist.y + upperShiftY,
    },
    left_ear: {
      x: keypointMap.left_ear.x + upperShiftX,
      y: keypointMap.left_ear.y + upperShiftY,
    },
    left_ankle: {
      x: keypointMap.left_ankle.x + lowerShiftX,
      y: keypointMap.left_ankle.y + lowerShiftY,
    },
    right_ankle: {
      x: keypointMap.right_ankle.x + lowerShiftX,
      y: keypointMap.right_ankle.y + lowerShiftY,
    },
  };

  return {
    keypointMap: normalizedKeypointMap,
    torsoRect,
  };
}
