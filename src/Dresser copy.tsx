import type { Pose } from './FrameEstimator';
import React, { useEffect, useState } from 'react';
import { getKeypointMap } from './bodyMath';

export function Dresser({ pose }: { pose: Pose }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas) {
      renderPose(canvas, pose);
    }
  }, [canvas, pose]);

  return <canvas ref={setCanvas} width={800} height={600} />;
}

function renderPose(canvas: HTMLCanvasElement, pose: Pose) {
  const ctx = canvas.getContext('2d')!;
  const keypointMap = getKeypointMap(pose);

  const isLeft = (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 > keypointMap.nose.x;

  // single-hand weapon

  const angleRad = Math.atan2(
    keypointMap.right_elbow.y - keypointMap.right_wrist.y,
    keypointMap.right_elbow.x - keypointMap.right_wrist.x,
  );
  const { x, y } = keypointMap.right_wrist;

  ctx.fillStyle = 'red';

  ctx.translate(x, y);
  ctx.rotate(angleRad);

  ctx.fillRect(10, 20, -20, -160);

  ctx.resetTransform();

  ctx.fillStyle = 'blue';
  ctx.fillRect(x - 2, y - 2, 4, 4);

  ctx.fillStyle = '#770000aa';
  // head

  ctx.fillRect(
    (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2 - 15,
    (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2 - 15,
    30,
    30,
  );

  // arms and feet

  ctx.fillRect(keypointMap.left_wrist.x + (isLeft ? -10 : 10), keypointMap.left_wrist.y - 10, 20, 20);
  ctx.fillRect(keypointMap.right_wrist.x + (isLeft ? -10 : 10), keypointMap.right_wrist.y - 10, 20, 20);

  ctx.fillRect(keypointMap.left_ankle.x + (isLeft ? -50 : 0) + 10, keypointMap.left_ankle.y, 50, 20);
  ctx.fillRect(keypointMap.right_ankle.x + (isLeft ? -50 : 0) + 10, keypointMap.right_ankle.y, 50, 20);

  // limbs

  ctx.beginPath();
  ctx.moveTo(
    keypointMap.left_shoulder.x + (keypointMap.right_shoulder.x - keypointMap.left_shoulder.x) / 2,
    (keypointMap.left_shoulder.y + keypointMap.right_shoulder.y) / 2,
  );
  ctx.lineTo(
    (keypointMap.left_ear.x + keypointMap.right_ear.x) / 2,
    (keypointMap.left_ear.y + keypointMap.right_ear.y) / 2,
  );

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);

  // shoulders and arms

  ctx.moveTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);
  ctx.lineTo(keypointMap.left_wrist.x, keypointMap.left_wrist.y);

  ctx.moveTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);
  ctx.lineTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);

  ctx.moveTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);
  ctx.lineTo(keypointMap.right_wrist.x, keypointMap.right_wrist.y);

  // torso
  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.left_hip.x, keypointMap.left_hip.y);

  ctx.moveTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);
  ctx.lineTo(keypointMap.right_hip.x, keypointMap.right_hip.y);

  // lower body
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

  ctx.strokeStyle = 'red';
  ctx.stroke();
}
