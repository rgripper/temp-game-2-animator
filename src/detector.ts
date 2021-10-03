import './worker-tf-fix';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-cpu';
import * as Comlink from 'comlink';

await tf.ready();

let detector: poseDetection.PoseDetector | undefined;
async function estimateFrame(frame: ImageData) {
  detector ??= await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    enableSmoothing: true,
  });
  const [currentPose] = await detector.estimatePoses(frame, {
    flipHorizontal: false,
    maxPoses: 1,
  });

  return currentPose;
}

Comlink.expose({ estimateFrame });
