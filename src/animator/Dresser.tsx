import type { Pose } from "../useEstimator";
import React, { useEffect, useState } from "react";
import metalSrc from "../assets/metal.jpg";
import swordSrc from "../assets/sword3.png";
import helmetSrc from "../assets/helmet.png";
import { adjustPoseToCanvas } from "../bodyMath";
import { renderPose } from "./renderPose";

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

      const adjustedKeypointMap = adjustPoseToCanvas(
        pose,
        canvas.width,
        canvas.height,
      );
      ctx.save();
      renderPose(
        canvas,
        adjustedKeypointMap,
        metalImage,
        swordImage,
        helmetImage,
      );
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

function useImage(src: string) {
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = src;
    imageElement.decode().then(() => setImage(imageElement));
  }, [src]);
  return image;
}
