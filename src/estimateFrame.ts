import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as Comlink from "comlink";
import { PixelInput } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";

await tf.setBackend("webgl"); // webgpu doesn't produce any output on my machine

let detector: poseDetection.PoseDetector | undefined;
export async function estimateFrame(frame: PixelInput) {
  console.log("Processing frame started", frame);
  detector ??= await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      enableSmoothing: true,
    },
  );
  const results = await detector.estimatePoses(frame, {
    flipHorizontal: false,
    maxPoses: 1,
  });

  console.log("Processing frame completed", results);
  const currentPose = results[0];

  return currentPose;
}

Comlink.expose({ estimateFrame });
