import { AugmentedKeypointMap, KeypointMap } from "./KeypointMap";
import type { Point, Pose } from "./useEstimator";

export function getKeypointMap(pose: Pose): KeypointMap {
  return Object.fromEntries(
    pose.keypoints.map((keypoint) => [
      keypoint.name,
      { x: keypoint.x, y: keypoint.y, z: keypoint.z },
    ]),
  ) as unknown as KeypointMap;
}

export function augmentKeypointMap(
  keypointMap: KeypointMap,
): AugmentedKeypointMap {
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

export function adjustPoseToCanvas(pose: Pose, width: number, height: number) {
  const _keypointMap = getKeypointMap(scaleDown(pose, width, height));

  const centeredKeypointMap = centerBody(
    width,
    height,
    _keypointMap,
    getCenterBetweenFeet,
  );

  const augKeypointMap = augmentKeypointMap(centeredKeypointMap);
  return augKeypointMap;
}

function scaleDown(pose: Pose, width: number, height: number): Pose {
  const scalingFactor = 450;
  return {
    ...pose,
    keypoints: pose.keypoints.map((kp) => ({
      ...kp,
      x: (kp.x * width) / scalingFactor,
      y: (kp.y * height) / scalingFactor,
    })),
  };
}

// function getOffset(keypointMap: KeypointMap, referencePoint: Point) {
//   const currentCenter = {
//     x: (keypointMap.left_hip.x + keypointMap.right_hip.x) / 2,
//     y: (keypointMap.left_hip.y + keypointMap.right_hip.y) / 2,
//   };

//   return {
//     x: referencePoint.x - currentCenter.x,
//     y: referencePoint.y - currentCenter.y,
//   };
// }

export function getCenterBetweenFeet(keypointMap: KeypointMap): Point {
  return {
    x: (keypointMap.left_ankle.x + keypointMap.right_ankle.x) / 2,
    y: (keypointMap.left_ankle.y + keypointMap.right_ankle.y) * 0.3,
  };
}

export function centerBody(
  imageWidth: number,
  imageHeight: number,
  keypointMap: KeypointMap,
  getBodyCenter: (keypointMap: KeypointMap) => Point,
): KeypointMap {
  const bodyCenter = getBodyCenter(keypointMap);
  const imageCenter = { x: imageWidth / 2, y: imageHeight / 2 };
  console.log("imageCenter", imageCenter);
  const offset = {
    x: imageCenter.x - bodyCenter.x,
    y: imageCenter.y - bodyCenter.y,
  };

  return Object.fromEntries(
    Object.entries(keypointMap).map(([key, point]) => [
      key as keyof KeypointMap,
      {
        x: point.x + offset.x,
        y: point.y + offset.y,
      },
    ]),
  ) as KeypointMap;
}

// export function stabilizeBody(
//   keypointMap: KeypointMap,
//   referencePoint: Point,
// ): KeypointMap {
//   const offset = getOffset(keypointMap, referencePoint);
//   // console.log(offset);
//   return (Object.keys(keypointMap) as (keyof KeypointMap)[]).reduce(
//     (acc, key) => ({
//       ...acc,
//       [key]: {
//         x: keypointMap[key].x + offset.x,
//         y: keypointMap[key].y + offset.y,
//       },
//     }),
//     {} as Partial<KeypointMap>,
//   ) as KeypointMap;
// }
