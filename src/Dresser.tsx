import type { Point, Pose } from './FrameEstimator';
import React, { useEffect, useState } from 'react';
import { getKeypointMap, KeypointMap } from './Animator';
import metalSrc from './metal.jpg';
import swordSrc from './sword3.png';
import helmetSrc from './helmet.png';

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

  return <canvas style={{ imageRendering: 'crisp-edges' }} ref={setCanvas} width={800} height={600} />;
}

function scaleDown(pose: Pose): Pose {
  return {
    ...pose,
    keypoints: pose.keypoints.map((kp) => ({ ...kp, x: kp.x * 0.3, y: kp.y * 0.1 })),
  };
}

function renderPose(
  canvas: HTMLCanvasElement,
  pose: Pose,
  metalImage: HTMLImageElement,
  swordImage: HTMLImageElement,
  helmetImage: HTMLImageElement,
) {
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = false;
  const keypointMap = getKeypointMap(scaleDown(pose));

  const isLeft = (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 > keypointMap.nose.x;

  drawSword(keypointMap, ctx, swordImage, isLeft);

  ctx.fillStyle = '#770000aa';
  // head

  // ctx.fillRect(
  //   (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 - 2,
  //   (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2 - 2,
  //   4,
  //   4,
  // );

  drawNeck(ctx, keypointMap);

  drawHead(helmetImage, ctx, keypointMap, isLeft);

  // shoulders and arms

  drawTorso(ctx, keypointMap, metalImage);
  ctx.beginPath();
  // lower body

  drawLimb(keypointMap.left_hip, keypointMap.left_knee, ctx, metalImage, 3);
  drawLimb(keypointMap.right_hip, keypointMap.right_knee, ctx, metalImage, 3);

  ctx.strokeStyle = 'orange';
  ctx.moveTo(keypointMap.left_knee.x, keypointMap.left_knee.y);
  ctx.lineTo(keypointMap.left_ankle.x, keypointMap.left_ankle.y);

  ctx.moveTo(keypointMap.right_knee.x, keypointMap.right_knee.y);
  ctx.lineTo(keypointMap.right_ankle.x, keypointMap.right_ankle.y);

  ctx.stroke();
}

function drawNeck(ctx: CanvasRenderingContext2D, keypointMap: KeypointMap) {
  ctx.strokeStyle = 'orange';
  ctx.beginPath();
  ctx.moveTo(
    keypointMap.left_shoulder.x + (keypointMap.right_shoulder.x - keypointMap.left_shoulder.x) / 2,
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
  isLeft: boolean,
) {
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

  ctx.fillStyle = 'orange';
  ctx.fillRect(-headWidth / 4, 0, headWidth / 2, headHeight / 2);
  //ctx.fillRect(-headWidth / 2, -headHeight / 2, headWidth, headHeight);
  ctx.drawImage(helmetImage, -headWidth / 2, -headHeight / 2, headWidth, headHeight);
  ctx.resetTransform();
}

function drawSword(
  keypointMap: KeypointMap,
  ctx: CanvasRenderingContext2D,
  weaponImage: HTMLImageElement,
  isLeft: boolean,
) {
  const angleRad = getPerpendicularAngleRad(keypointMap.right_elbow, keypointMap.right_wrist);
  const { x, y } = keypointMap.right_wrist;
  const handHorizontalOffset = isLeft ? -2 : 2; // todo depends on whether the character is on the right or left

  const handSize = 2;
  const handPosition = { x: x + handHorizontalOffset, y };
  ctx.fillStyle = 'orange';
  ctx.fillRect(handPosition.x + handSize / 2, handPosition.y - handSize / 2, handSize, handSize);

  const width = 8;
  const height = (weaponImage.height * width) / weaponImage.width;
  const holdingPoint = { x: width * 0.5, y: height * 0.8 };

  ctx.fillStyle = 'red';

  ctx.translate(handPosition.x, handPosition.y);
  ctx.rotate(angleRad);

  // ctx.fillRect(-holdingPoint.x, -holdingPoint.y, width, height);
  ctx.drawImage(weaponImage, -holdingPoint.x, -holdingPoint.y, width, height);

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

function drawTorso(ctx: CanvasRenderingContext2D, keypointMap: KeypointMap, metalImage: HTMLImageElement) {
  drawLimb(keypointMap.right_elbow, keypointMap.right_wrist, ctx, metalImage, 2);
  drawLimb(keypointMap.left_elbow, keypointMap.left_wrist, ctx, metalImage, 2);
  drawLimb(keypointMap.right_shoulder, keypointMap.right_elbow, ctx, metalImage, 3);
  drawLimb(keypointMap.left_shoulder, keypointMap.left_elbow, ctx, metalImage, 3);

  drawLimb(keypointMap.left_hip, keypointMap.right_hip, ctx, metalImage, 3);

  // torso
  ctx.beginPath();

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);
  ctx.lineTo(keypointMap.right_hip.x, keypointMap.right_hip.y);
  ctx.lineTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  // ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.closePath();

  // ctx.clip();

  // ctx.drawImage(metalImage, keypointMap.right_shoulder.x, keypointMap.right_shoulder.y, 100, 100);
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
    Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)),
  );
  ctx.resetTransform();
}

function useImage(src: string) {
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = src;
    imageElement.onload = () => setImage(imageElement);
  }, []);
  return image;
}
