// async function estimatePoseOnImage(imageElement: HTMLImageElement) {
//   // load the posenet model from a checkpoint
//   //  const net = await posenet.load();
//   const net = await posenet.load({
//     architecture: 'ResNet50',
//     outputStride: 32,
//     inputResolution: { width: 257, height: 200 },
//     quantBytes: 2,
//   });

//   const pose = await net.estimateSinglePose(imageElement, {
//     flipHorizontal: false,
//   });
//   return pose;
// }

// const imageElement = document.getElementById('cat');

// const pose = estimatePoseOnImage(imageElement!);

// console.log(pose);
