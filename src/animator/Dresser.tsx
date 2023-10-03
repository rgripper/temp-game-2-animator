import type { Point, Pose } from "../useEstimator";
import React, { useEffect, useState } from "react";
import {
  augmentKeypointMap,
  getKeypointMap,
  KeypointMap,
  centerBody,
  getCenterBetweenFeet,
} from "../bodyMath";
import metalSrc from "../assets/metal.jpg";
import swordSrc from "../assets/sword3.png";
import helmetSrc from "../assets/helmet.png";

export function Dresser({ pose }: { pose: Pose }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const metalImage = useImage(metalSrc);
  const swordImage = useImage(swordSrc);
  const helmetImage = useImage(helmetSrc);

  useEffect(() => {
    if (canvas && metalImage && swordImage && helmetImage) {
      renderPose(canvas, pose, metalImage, swordImage, helmetImage);
    }
  }, [canvas, pose, metalImage, swordImage, helmetImage]);

  return (
    <canvas
      className={`w-full h-full`}
      style={{ imageRendering: "pixelated" }}
      ref={setCanvas}
    />
  );
}

function scaleDown(pose: Pose): Pose {
  return {
    ...pose,
    keypoints: pose.keypoints.map((kp) => ({
      ...kp,
      x: kp.x * 0.3,
      y: kp.y * 0.3,
    })),
  };
}

const limbWidth = 4;

function renderPose(
  canvas: HTMLCanvasElement,
  pose: Pose,
  metalImage: HTMLImageElement,
  swordImage: HTMLImageElement,
  helmetImage: HTMLImageElement,
) {
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  const _keypointMap = getKeypointMap(scaleDown(pose));

  const centeredKeypointMap = centerBody(
    canvas.width,
    canvas.height,
    _keypointMap,
    getCenterBetweenFeet,
  );

  const augKeypointMap = augmentKeypointMap(centeredKeypointMap);

  ctx.save();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    augKeypointMap.right_hand.x - 2,
    augKeypointMap.right_hand.y - 2,
    4,
    4,
  );
  ctx.fillRect(
    augKeypointMap.left_hand.x - 2,
    augKeypointMap.left_hand.y - 2,
    4,
    4,
  );
  ctx.restore();

  const angleRad = getPerpendicularAngleRad(
    augKeypointMap.right_elbow,
    augKeypointMap.right_wrist,
  );
  drawSword(augKeypointMap.right_hand, angleRad, ctx, swordImage);

  ctx.fillStyle = "#770000aa";
  // head

  // ctx.fillRect(
  //   (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 - 2,
  //   (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2 - 2,
  //   4,
  //   4,
  // );

  drawNeck(ctx, augKeypointMap);

  drawHead(helmetImage, ctx, augKeypointMap);

  // shoulders and arms

  drawTorso(ctx, augKeypointMap, metalImage);
  ctx.beginPath();
  // lower body

  drawLimb(
    augKeypointMap.left_hip,
    augKeypointMap.left_knee,
    ctx,
    metalImage,
    limbWidth * 2.5,
  );
  drawLimb(
    augKeypointMap.right_hip,
    augKeypointMap.right_knee,
    ctx,
    metalImage,
    limbWidth * 2.5,
  );

  ctx.strokeStyle = "orange";
  ctx.lineWidth = limbWidth * 1.5;
  ctx.moveTo(augKeypointMap.left_knee.x, augKeypointMap.left_knee.y);
  ctx.lineTo(augKeypointMap.left_ankle.x, augKeypointMap.left_ankle.y);

  ctx.moveTo(augKeypointMap.right_knee.x, augKeypointMap.right_knee.y);
  ctx.lineTo(augKeypointMap.right_ankle.x, augKeypointMap.right_ankle.y);

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

function useImage(src: string) {
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = src;
    imageElement.onload = () => setImage(imageElement);
  }, [src]);
  return image;
}
