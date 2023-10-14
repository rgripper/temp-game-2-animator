import { KeypointMap } from "./KeypointMap";

export function drawPose(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  keypointMap: KeypointMap,
  lineWidth: number,
  color: string,
) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);

  ctx.moveTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);
  ctx.lineTo(keypointMap.left_wrist.x, keypointMap.left_wrist.y);

  ctx.moveTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);
  ctx.lineTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);

  ctx.moveTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);
  ctx.lineTo(keypointMap.right_wrist.x, keypointMap.right_wrist.y);

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);

  ctx.moveTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  ctx.lineTo(keypointMap.right_hip.x, keypointMap.right_hip.y);

  ctx.moveTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  ctx.lineTo(keypointMap.left_knee.x, keypointMap.left_knee.y);

  ctx.moveTo(keypointMap.left_knee.x, keypointMap.left_knee.y);
  ctx.lineTo(keypointMap.left_ankle.x, keypointMap.left_ankle.y);

  ctx.moveTo(keypointMap.right_hip.x, keypointMap.right_hip.y);
  ctx.lineTo(keypointMap.right_knee.x, keypointMap.right_knee.y);

  ctx.moveTo(keypointMap.right_knee.x, keypointMap.right_knee.y);
  ctx.lineTo(keypointMap.right_ankle.x, keypointMap.right_ankle.y);

  ctx.stroke();
}
