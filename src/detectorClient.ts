import * as Comlink from "comlink";
import * as poseDetection from "@tensorflow-models/pose-detection";

const worker = new Worker(new URL("./estimateFrame", import.meta.url), {
  type: "module",
});
export const detectorClient = Comlink.wrap<{
  estimateFrame: (frame: ImageData) => poseDetection.Pose;
}>(worker);
