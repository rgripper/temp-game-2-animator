import type { Point } from "./useEstimator";

export type KeypointMap = Record<
  | "nose"
  | "left_eye"
  | "right_eye"
  | "left_ear"
  | "right_ear"
  | "left_shoulder"
  | "right_shoulder"
  | "left_elbow"
  | "right_elbow"
  | "left_wrist"
  | "right_wrist"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle",
  Point
>;

export type AugmentedKeypointMap = KeypointMap & {
  left_hand: Point;
  right_hand: Point;
};
