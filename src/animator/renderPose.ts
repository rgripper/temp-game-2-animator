import type { Point } from "../useEstimator";
import { AugmentedKeypointMap, KeypointMap } from "../KeypointMap";

const limbWidth = 4;
export function renderPose(
  canvas: HTMLCanvasElement,
  keypointMap: AugmentedKeypointMap,
  metalImage: HTMLImageElement,
  swordImage: HTMLImageElement,
  helmetImage: HTMLImageElement,
) {
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  ctx.save();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    keypointMap.right_hand.x - 2,
    keypointMap.right_hand.y - 2,
    4,
    4,
  );
  ctx.fillRect(keypointMap.left_hand.x - 2, keypointMap.left_hand.y - 2, 4, 4);
  ctx.restore();

  const angleRad = getPerpendicularAngleRad(
    keypointMap.right_elbow,
    keypointMap.right_wrist,
  );
  drawSword(keypointMap.right_hand, angleRad, ctx, swordImage);

  ctx.fillStyle = "#770000aa";
  // head
  // ctx.fillRect(
  //   (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 - 2,
  //   (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2 - 2,
  //   4,
  //   4,
  // );
  drawNeck(ctx, keypointMap);

  drawHead(helmetImage, ctx, keypointMap);

  // shoulders and arms
  drawTorso(ctx, keypointMap, metalImage);
  ctx.beginPath();
  // lower body
  drawLimb(
    keypointMap.left_hip,
    keypointMap.left_knee,
    ctx,
    metalImage,
    limbWidth * 2.5,
  );
  drawLimb(
    keypointMap.right_hip,
    keypointMap.right_knee,
    ctx,
    metalImage,
    limbWidth * 2.5,
  );

  ctx.strokeStyle = "orange";
  ctx.lineWidth = limbWidth * 1.5;
  ctx.moveTo(keypointMap.left_knee.x, keypointMap.left_knee.y);
  ctx.lineTo(keypointMap.left_ankle.x, keypointMap.left_ankle.y);

  ctx.moveTo(keypointMap.right_knee.x, keypointMap.right_knee.y);
  ctx.lineTo(keypointMap.right_ankle.x, keypointMap.right_ankle.y);

  ctx.stroke();
}

function drawNeck(ctx: CanvasRenderingContext2D, keypointMap: KeypointMap) {
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(
    keypointMap.left_shoulder.x +
      (keypointMap.right_shoulder.x - keypointMap.left_shoulder.x) / 2,
    (keypointMap.left_shoulder.y + keypointMap.right_shoulder.y) / 2,
  );
  ctx.lineTo(
    (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2,
    (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2,
  );
  ctx.stroke();
}
function drawHead(
  helmetImage: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  keypointMap: KeypointMap,
) {
  const isLeft =
    (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 > keypointMap.nose.x;

  const headWidth = 7;
  const headHeight = helmetImage.height * (headWidth / helmetImage.width);
  ctx.translate(
    (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2,
    (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2,
  );

  if (!isLeft) {
    ctx.translate(0, 0);
    ctx.scale(-1, 1);
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(-headWidth / 4, 0, headWidth / 2, headHeight / 2);
  //ctx.fillRect(-headWidth / 2, -headHeight / 2, headWidth, headHeight);
  ctx.drawImage(
    helmetImage,
    -headWidth / 2,
    -headHeight / 2,
    headWidth,
    headHeight,
  );
  ctx.resetTransform();
}
function drawSword(
  hand: Point,
  angleRad: number,
  ctx: CanvasRenderingContext2D,
  weaponImage: HTMLImageElement,
) {
  const width = 8;
  const height = (weaponImage.height * width) / weaponImage.width;

  const weaponHoldingPoint = { x: width * 0.5, y: height * 0.82 };

  ctx.fillStyle = "red";

  ctx.translate(hand.x, hand.y);
  ctx.rotate(angleRad);

  // ctx.fillRect(-weaponHoldingPoint.x, -weaponHoldingPoint.y, width, height);
  ctx.drawImage(
    weaponImage,
    -weaponHoldingPoint.x,
    -weaponHoldingPoint.y,
    width,
    height,
  );

  ctx.resetTransform();

  // ctx.fillStyle = 'blue';
  // ctx.fillRect(x - 1, y - 1, 2, 1);
}
function getPerpendicularAngleRad(point1: Point, point2: Point) {
  return Math.atan2(point1.y - point2.y, point1.x - point2.x);
}
function getAngleRad(point1: Point, point2: Point) {
  return Math.atan2(point1.y - point2.y, point1.x - point2.x) - Math.PI / 2;
}
function drawTorso(
  ctx: CanvasRenderingContext2D,
  keypointMap: KeypointMap,
  metalImage: HTMLImageElement,
) {
  drawLimb(
    keypointMap.right_elbow,
    keypointMap.right_wrist,
    ctx,
    metalImage,
    limbWidth,
  );
  drawLimb(
    keypointMap.left_elbow,
    keypointMap.left_wrist,
    ctx,
    metalImage,
    limbWidth,
  );
  drawLimb(
    keypointMap.right_shoulder,
    keypointMap.right_elbow,
    ctx,
    metalImage,
    limbWidth * 1.5,
  );
  drawLimb(
    keypointMap.left_shoulder,
    keypointMap.left_elbow,
    ctx,
    metalImage,
    limbWidth * 1.5,
  );

  drawLimb(keypointMap.left_hip, keypointMap.right_hip, ctx, metalImage, 6);

  // torso
  ctx.save();
  ctx.beginPath();

  ctx.moveTo(
    keypointMap.left_shoulder.x,
    keypointMap.left_shoulder.y - limbWidth + 1,
  );
  ctx.lineTo(
    keypointMap.right_shoulder.x - limbWidth,
    keypointMap.right_shoulder.y - limbWidth + 1,
  );
  ctx.lineTo(keypointMap.right_hip.x - limbWidth, keypointMap.right_hip.y);
  ctx.lineTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  // ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  // ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    metalImage,
    keypointMap.right_shoulder.x - 10,
    keypointMap.right_shoulder.y - 10,
    120,
    120,
  );
  ctx.restore();
}
function drawLimb(
  point1: Point,
  point2: Point,
  ctx: CanvasRenderingContext2D,
  metalImage: HTMLImageElement,
  width: number,
) {
  const angleRad = getAngleRad(point1, point2);
  ctx.translate(point2.x, point2.y);
  ctx.rotate(angleRad);

  ctx.drawImage(
    metalImage,
    -Math.floor(width / 2),
    0,
    width,
    Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2),
    ),
  );
  ctx.resetTransform();
}
