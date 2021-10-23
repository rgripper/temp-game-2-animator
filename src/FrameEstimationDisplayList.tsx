import React, { useEffect, useState } from 'react';
import { tw } from 'twind';
import { getKeypointMap, stabilizeBody } from './bodyMath';
import { Pose, useEstimator } from './useEstimator';

export function FrameEstimationDisplayList({
  frames,
  onComplete,
}: {
  frames: ImageData[];
  onComplete: (poses: Pose[]) => void;
}) {
  const estimationStates = useEstimator(frames);
  useEffect(() => {
    if (estimationStates.every((x): x is { pose: Pose; isEstimating: false } => !!x.pose)) {
      onComplete(estimationStates.map((x) => x.pose));
    }
  }, [estimationStates]);
  return (
    <div className={tw`flex flex-wrap gap-6`}>
      {frames.map((x, i) => (
        <FrameEstimationDisplay key={i} {...estimationStates[i]} frame={frames[i]} />
      ))}
    </div>
  );
}

function FrameEstimationDisplay({
  pose,
  isEstimating,
  frame,
}: {
  pose: Pose | null;
  isEstimating: boolean;
  frame: ImageData;
}) {
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
    scaleCanvas(canvas, ctx, 64, frame);
    ctx.drawImage(offscreen, 0, 0);

    if (pose) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'blue';

      const keypointMap = getKeypointMap(pose);

      const stabilizedKeypointMap = keypointMap; // stabilizeBody(keypointMap, { x: frame.width / 2, y: frame.height * 0.65 });

      ctx.moveTo(stabilizedKeypointMap.left_shoulder.x, stabilizedKeypointMap.left_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.left_elbow.x, stabilizedKeypointMap.left_elbow.y);

      ctx.moveTo(stabilizedKeypointMap.left_elbow.x, stabilizedKeypointMap.left_elbow.y);
      ctx.lineTo(stabilizedKeypointMap.left_wrist.x, stabilizedKeypointMap.left_wrist.y);

      ctx.moveTo(stabilizedKeypointMap.right_shoulder.x, stabilizedKeypointMap.right_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.right_elbow.x, stabilizedKeypointMap.right_elbow.y);

      ctx.moveTo(stabilizedKeypointMap.right_elbow.x, stabilizedKeypointMap.right_elbow.y);
      ctx.lineTo(stabilizedKeypointMap.right_wrist.x, stabilizedKeypointMap.right_wrist.y);

      ctx.moveTo(stabilizedKeypointMap.left_shoulder.x, stabilizedKeypointMap.left_shoulder.y);
      ctx.lineTo(stabilizedKeypointMap.right_shoulder.x, stabilizedKeypointMap.right_shoulder.y);

      ctx.moveTo(stabilizedKeypointMap.left_hip.x, stabilizedKeypointMap.left_hip.y);
      ctx.lineTo(stabilizedKeypointMap.right_hip.x, stabilizedKeypointMap.right_hip.y);

      ctx.moveTo(stabilizedKeypointMap.left_hip.x, stabilizedKeypointMap.left_hip.y);
      ctx.lineTo(stabilizedKeypointMap.left_knee.x, stabilizedKeypointMap.left_knee.y);

      ctx.moveTo(stabilizedKeypointMap.left_knee.x, stabilizedKeypointMap.left_knee.y);
      ctx.lineTo(stabilizedKeypointMap.left_ankle.x, stabilizedKeypointMap.left_ankle.y);

      ctx.moveTo(stabilizedKeypointMap.right_hip.x, stabilizedKeypointMap.right_hip.y);
      ctx.lineTo(stabilizedKeypointMap.right_knee.x, stabilizedKeypointMap.right_knee.y);

      ctx.moveTo(stabilizedKeypointMap.right_knee.x, stabilizedKeypointMap.right_knee.y);
      ctx.lineTo(stabilizedKeypointMap.right_ankle.x, stabilizedKeypointMap.right_ankle.y);

      ctx.stroke();
    }
  }, [canvas, pose, frame]);

  return (
    <div className={tw`relative`}>
      <canvas
        className={tw`border-1 rounded-sm ${pose ? 'border-yellow-500' : 'border-gray-400'}`}
        ref={setCanvas}
        style={{ filter: pose ? undefined : 'grayscale(1)' }}
      />
      {isEstimating && (
        <span className={tw`h-full w-full absolute top-0 right-0 grid place-items-center`}>
          <span className={tw`animate-ping w-2 h-2 inline-flex rounded-full bg-yellow-500`}></span>
        </span>
      )}
    </div>
  );
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
