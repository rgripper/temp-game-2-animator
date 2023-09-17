import { RecorderResult } from "./recorder/Recorder";

export function FrameFileDownloader({ recorderResult}: { recorderResult: RecorderResult}) {
    return <button className='text-white' onClick={() => downloadAllFrames(recorderResult.frames)}>Download</button>
}

const downloadFrame = async (canvas: OffscreenCanvas, imageData: ImageData, name: string) => {
    // Create a temporary download link
    canvas.getContext('2d')!.putImageData(imageData, 0, 0);

    const a = document.createElement('a');
    a.href = await canvas.convertToBlob({ type: 'image/png' }).then((blob) => URL.createObjectURL(blob));
    a.download = name; // Set the filename
    a.click();
  }

  const downloadAllFrames = async (images: ImageData[]) => {
    const canvas = new OffscreenCanvas(images[0].width, images[0].height)
    await Promise.all(images.map(async (image, index) => downloadFrame(canvas, image, `image_${index.toString().padStart(3, '0')}.png`)))
  }
