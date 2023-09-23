export function FrameFileLoader({
  onLoaded,
}: {
  onLoaded: (images: ImageData[]) => void;
}) {
  return (
    <label className="btn btn-outline relative">
      Load images
      <input
        className="w-0 h-0 absolute"
        type="file"
        multiple
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return;

          const contents = await Promise.all(
            Array.from(files)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(async (file) => {
                const img = await fileToImage(file);
                return imageToImageData(img);
              }),
          );

          onLoaded(contents);
        }}
      />
    </label>
  );
}

function imageToImageData(img: HTMLImageElement) {
  const canvas = new OffscreenCanvas(img.width, img.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(img, 0, 0);
  return context.getImageData(0, 0, img.width, img.height);
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file); // create an Object URL
  const img = new Image(); // create a temp. image object
  try {
    img.src = url;
    await img.decode();
  } finally {
    URL.revokeObjectURL(url);
  }
  return img;
}
