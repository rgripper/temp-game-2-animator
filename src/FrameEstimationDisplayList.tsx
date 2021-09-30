import React, { useEffect, useState } from 'react';
import { getKeypointMap, stabilizeBody } from './bodyMath';
import type { Pose } from './FrameEstimator';

export function FrameEstimationDisplayList({ poses, frames }: { poses: Pose[] | null; frames: ImageData[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {frames.map((x, i) => (
        <FrameEstimationDisplay pose={poses?.[i]} frame={frames[i]} />
      ))}
    </div>
  );
}

function FrameEstimationDisplay({ pose, frame }: { pose: Pose | undefined; frame: ImageData }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const offscreen = new OffscreenCanvas(frame.width, frame.height);
    const draftContext = offscreen.getContext('2d')!;
    draftContext.putImageData(frame, 0, 0);
    draftContext.putImageData(frame, 0, 0);

    const ctx = canvas.getContext('2d')!;
    scaleCanvas(canvas, ctx, 100, frame);
    ctx.drawImage(offscreen, 0, 0);

    if (pose) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'yellow';

      const keypointMap = getKeypointMap(pose);

      const stabilizedKeypointMap = stabilizeBody(keypointMap, { x: frame.width / 2, y: frame.height * 0.75 });

      ctx.moveTo(stabilizedKeypointMap.left_shoulder.x, stabilizedKeypointMap.left_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.left_elbow.x, stabilizedKeypointMap.left_elbow.y);

      ctx.moveTo(stabilizedKeypointMap.right_shoulder.x, stabilizedKeypointMap.right_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.right_elbow.x, stabilizedKeypointMap.right_elbow.y);

      ctx.moveTo(stabilizedKeypointMap.left_shoulder.x, stabilizedKeypointMap.left_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.right_shoulder.x, stabilizedKeypointMap.right_shoulder.y);

      ctx.moveTo(stabilizedKeypointMap.left_knee.x, stabilizedKeypointMap.left_knee.y);
      ctx.lineTo(stabilizedKeypointMap.left_ankle.x, stabilizedKeypointMap.left_ankle.y);

      ctx.moveTo(stabilizedKeypointMap.right_knee.x, stabilizedKeypointMap.right_knee.y);
      ctx.lineTo(stabilizedKeypointMap.right_ankle.x, stabilizedKeypointMap.right_ankle.y);

      ctx.stroke();
    }
  }, [canvas, pose, frame]);

  return <canvas ref={setCanvas} />;
}

function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  thumbnailSide: number,
  frameSize: { width: number; height: number },
) {
  const scaleFactor = thumbnailSide / Math.max(frameSize.height, frameSize.width);
  canvas.width = Math.round(frameSize.width * scaleFactor);
  canvas.height = Math.round(frameSize.height * scaleFactor);
  context.scale(scaleFactor, scaleFactor);
}
