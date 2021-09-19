import type { Point, Pose } from './FrameEstimator';

export function getKeypointMap(pose: Pose): KeypointMap {
  return Object.fromEntries(
    pose.keypoints.map((keypoint) => [keypoint.name, { x: keypoint.x, y: keypoint.y, z: keypoint.z }]),
  ) as unknown as KeypointMap;
}

export function augmentKeypointMap(keypointMap: KeypointMap): AugmentedKeypointMap {
  function getHandPoint(wrist: Point, elbow: Point): Point {
    const handToLowerArmRatio = 0.17;
    return {
      x: wrist.x + (wrist.x - elbow.x) * handToLowerArmRatio,
      y: wrist.y + (wrist.y - elbow.y) * handToLowerArmRatio,
    };
  }

  return {
    ...keypointMap,
    left_hand: getHandPoint(keypointMap.left_wrist, keypointMap.left_elbow),
    right_hand: getHandPoint(keypointMap.right_wrist, keypointMap.right_elbow),
  };
}

export function normalizeMap(keypointMap: KeypointMap): KeypointMap {
  const midX =
    (keypointMap.left_shoulder.x + keypointMap.right_shoulder.x + keypointMap.left_hip.x + keypointMap.right_hip.x) / 4;
  const midY =
    (keypointMap.left_shoulder.y + keypointMap.right_shoulder.y + keypointMap.left_hip.y + keypointMap.right_hip.y) / 4;

  const width = 6;
  const height = 18;

  const horizontalDirection = keypointMap.left_shoulder.x < keypointMap.right_shoulder.x ? 1 : -1;

  const torsoRect = {
    x1: midX - (width / 2) * horizontalDirection,
    x2: midX + (width / 2) * horizontalDirection,
    y1: midY - height / 2,
    y2: midY + height / 2,
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

  return {
    // ...keypointMap, // TODO
    ...torsoParts,
    nose: {
      x: keypointMap.nose.x + upperShiftX,
      y: keypointMap.nose.y + upperShiftY,
    },
    left_eye: {
      x: keypointMap.left_eye.x + upperShiftX,
      y: keypointMap.left_eye.y + upperShiftY,
    },
    right_eye: {
      x: keypointMap.right_eye.x + upperShiftX,
      y: keypointMap.right_eye.y + upperShiftY,
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
    right_ear: {
      x: keypointMap.right_ear.x + upperShiftX,
      y: keypointMap.right_ear.y + upperShiftY,
    },
    left_ankle: {
      x: keypointMap.left_ankle.x + lowerShiftX,
      y: keypointMap.left_ankle.y + lowerShiftY,
    },
    right_knee: {
      x: keypointMap.right_knee.x + lowerShiftX,
      y: keypointMap.right_knee.y + lowerShiftY,
    },
    left_knee: {
      x: keypointMap.left_knee.x + lowerShiftX,
      y: keypointMap.left_knee.y + lowerShiftY,
    },
    right_ankle: {
      x: keypointMap.right_ankle.x + lowerShiftX,
      y: keypointMap.right_ankle.y + lowerShiftY,
    },
  };
}

export type KeypointMap = Record<
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

export type AugmentedKeypointMap = KeypointMap & {
  left_hand: Point;
  right_hand: Point;
};
