import React, { useMemo } from "react";
import { drawPose } from "../drawPose";
import { AugmentedKeypointMap } from "../KeypointMap";
import { Pose } from "../useEstimator";
import { adjustPoseToCanvas } from "../bodyMath";

const dimensions = { width: 100, height: 100 };
export function PixelEditor({ pose }: { pose: Pose }) {
  const imageData = useMemo(
    () =>
      drawPoseOnCanvas(
        adjustPoseToCanvas(pose, dimensions.width, dimensions.height),
        dimensions,
      ),
    [pose],
  );
  const colorGrid = useMemo<string[][]>(
    () => createColorGrid(imageData),
    [imageData],
  );
  return (
    <div>
      {colorGrid.map((row, i) => (
        <div key={i} className={`flex`}>
          {row.map((color, j) => (
            <div
              key={j}
              className={`w-2 h-2 flex-shrink-0 border`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function drawPoseOnCanvas(
  adjustedKeypointMap: AugmentedKeypointMap,
  dimensions: { width: number; height: number },
) {
  const offscreenCanvas = new OffscreenCanvas(
    dimensions.width,
    dimensions.height,
  );
  const offCtx = offscreenCanvas.getContext("2d")!;
  offCtx.fillStyle = "white";
  offCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  offCtx.imageSmoothingEnabled = true;
  offCtx.imageSmoothingQuality = "high";

  drawPose(offCtx, adjustedKeypointMap, 4, "brown");
  return offCtx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );
}

function createColorGrid(imageData: ImageData): string[][] {
  const colorGrid: string[][] = [];
  for (let i = 0; i < imageData.height; i++) {
    const row: string[] = [];
    for (let j = 0; j < imageData.width; j++) {
      const index = i * imageData.width * 4 + j * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];
      row.push(`rgba(${r},${g},${b},${a})`);
    }
    colorGrid.push(row);
  }
  return colorGrid;
}
