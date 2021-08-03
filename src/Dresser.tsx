import type { Pose } from './FrameEstimator';
import React, { useEffect, useState } from 'react';
import { getKeypointMap } from './Animator';

export function Dresser({ pose }: { pose: Pose }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas) {
      renderPose(canvas, pose);
    }
  }, [canvas, pose]);

  return <canvas ref={setCanvas} />;
  // const range = (count: number) => new Array(count).fill(null);

  // return (
  //   <div>
  //     {range(16).map((y, yi) => (
  //       <div key={yi}>
  //         {range(16).map((x, xi) => (
  //           <span key={xi} style={{ width: '24px', height: '24px', display: 'inline-block' }}>
  //             {x},{y}
  //           </span>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  // );
}
function renderPose(canvas: HTMLCanvasElement, pose: Pose) {
  const ctx = canvas.getContext('2d')!;
  const keypointMap = getKeypointMap(pose);

  ctx.moveTo(
    keypointMap.left_shoulder.x + (keypointMap.right_shoulder.x - keypointMap.left_shoulder.x) / 2,
    (keypointMap.left_shoulder.y + keypointMap.right_shoulder.y) / 2,
  );
  ctx.lineTo(keypointMap.nose.x, keypointMap.nose.y);

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);

  ctx.moveTo(keypointMap.left_shoulder.x, keypointMap.left_shoulder.y);
  ctx.lineTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);

  ctx.moveTo(keypointMap.left_elbow.x, keypointMap.left_elbow.y);
  ctx.lineTo(keypointMap.left_wrist.x, keypointMap.left_wrist.y);

  ctx.moveTo(keypointMap.right_shoulder.x, keypointMap.right_shoulder.y);
  ctx.lineTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);

  ctx.moveTo(keypointMap.right_elbow.x, keypointMap.right_elbow.y);
  ctx.lineTo(keypointMap.right_wrist.x, keypointMap.right_wrist.y);

  ctx.moveTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  ctx.lineTo(keypointMap.right_hip.x, keypointMap.right_hip.y);

  ctx.moveTo(keypointMap.left_hip.x, keypointMap.left_hip.y);
  ctx.lineTo(keypointMap.right_hip.x, keypointMap.right_hip.y);
}
