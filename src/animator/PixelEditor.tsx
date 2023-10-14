import type { Pose } from "../useEstimator";
import React, { useEffect, useState } from "react";
import metalSrc from "../assets/metal.jpg";
import swordSrc from "../assets/sword3.png";
import helmetSrc from "../assets/helmet.png";
import { drawPose } from "../drawPose";
import { adjustPoseToCanvas } from "../bodyMath";
import { AugmentedKeypointMap } from "../KeypointMap";

export function Dresser({ pose }: { pose: Pose }) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const metalImage = useImage(metalSrc);
  const swordImage = useImage(swordSrc);
  const helmetImage = useImage(helmetSrc);

  useEffect(() => {
    if (canvas && metalImage && swordImage && helmetImage) {
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      const adjustedKeypointMap = adjustPoseToCanvas(pose, 32, 32);

      const data = drawPoseOnCanvas(adjustedKeypointMap);
      console.log(data);
      ctx.putImageData(data, 0, 0, 0, 0, 32, 32);
      ctx.save();
      // renderPose(
      //   canvas,
      //   adjustedKeypointMap,
      //   metalImage,
      //   swordImage,
      //   helmetImage,
      // );
    }
  }, [canvas, pose, metalImage, swordImage, helmetImage]);

  return (
    <canvas
      className={`w-[32px] h-[32px]`}
      style={{ imageRendering: "pixelated" }}
      ref={setCanvas}
    />
  );
}

function drawPoseOnCanvas(adjustedKeypointMap: AugmentedKeypointMap) {
  const offscreenCanvas = new OffscreenCanvas(32, 32);
  const offCtx = offscreenCanvas.getContext("2d")!;
  offCtx.fillStyle = "red";
  offCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offCtx.imageSmoothingEnabled = true;
  offCtx.imageSmoothingQuality = "high";

  drawPose(offCtx, adjustedKeypointMap, 4, "brown");
  return offCtx.getImageData(0, 0, 32, 32);
}

function useImage(src: string) {
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = src;
    imageElement.decode().then(() => setImage(imageElement));
  }, [src]);
  return image;
}
