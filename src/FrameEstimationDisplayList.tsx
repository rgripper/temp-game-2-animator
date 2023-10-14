import React, { useEffect, useState } from "react";
import { Ping } from "./base/Ping";
import { Pose, useEstimator } from "./useEstimator";
import { drawPose } from "./drawPose";
import { getKeypointMap } from "./bodyMath";

export function FrameEstimationDisplayList({
  frames,
  onComplete,
}: {
  frames: ImageData[];
  onComplete: (poses: Pose[]) => void;
}) {
  const estimationStates = useEstimator(frames);
  useEffect(() => {
    if (
      estimationStates.every(
        (x): x is { pose: Pose; isEstimating: false } => !!x.pose,
      )
    ) {
      onComplete(estimationStates.map((x) => x.pose));
    }
  }, [onComplete, estimationStates]);
  return (
    <div className={`flex flex-wrap gap-4`}>
      {frames.map((x, i) => (
        <FrameEstimationDisplay
          key={i}
          {...estimationStates[i]}
          frame={frames[i]}
        />
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
    const draftContext = offscreen.getContext("2d")!;
    draftContext.putImageData(frame, 0, 0);

    if (pose) {
      draftContext.globalAlpha = 0.35;
      draftContext.fillStyle = "#000000";
      draftContext.fillRect(0, 0, frame.width, frame.height);
    }
    const ctx = canvas.getContext("2d")!;
    scaleCanvas(canvas, ctx, 64, frame);
    ctx.drawImage(offscreen, 0, 0);

    if (pose) {
      console.log("drawing a pose", pose);
      drawPose(ctx, getKeypointMap(pose), 15, "#F59E0B");
    }
  }, [canvas, pose, frame]);

  return (
    <div className={`relative`}>
      <canvas ref={setCanvas} />
      {isEstimating && <Ping size="sm" />}
    </div>
  );
}

function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  thumbnailSide: number,
  frameSize: { width: number; height: number },
) {
  const scaleFactor =
    thumbnailSide / Math.max(frameSize.height, frameSize.width);
  canvas.width = Math.round(frameSize.width * scaleFactor);
  canvas.height = Math.round(frameSize.height * scaleFactor);
  context.scale(scaleFactor, scaleFactor);
}
