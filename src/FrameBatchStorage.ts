export class FrameBatchStorage {
  async download() {
    const fileNames = this.getNames();
    if (!fileNames) return;
    const rootDir = await navigator.storage.getDirectory();

    await Promise.all(
      fileNames.map((x) =>
        rootDir
          .getFileHandle(x)
          .then((x) => x.getFile())
          .then(downloadFile),
      ),
    );
  }

  async clear() {
    const fileNames = this.getNames();
    if (!fileNames) return;
    const rootDir = await navigator.storage.getDirectory();

    await Promise.all(fileNames.map((x) => rootDir.removeEntry(x)));
  }

  // convertFilesToImageData(files: File[]): Promise<ImageData[]> {
  //     return Promise.resolve([]);
  // }

  async save(images: ImageData[]): Promise<void> {
    await this.clear();
    const rootDir = await navigator.storage.getDirectory();

    const fileNames = await Promise.all(
      images.map(async (image, i) => {
        const canvas = new OffscreenCanvas(image.width, image.height);
        canvas.getContext("2d")!.putImageData(image, 0, 0);
        const blob = await canvas.convertToBlob({ type: "image/webp" });
        const fileName = `frame_${i}.webp`;
        const draftHandle = await rootDir.getFileHandle(fileName, {
          create: true,
        });
        const writable = await draftHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return fileName;
      }),
    );

    window.localStorage.setItem("saveImages", JSON.stringify(fileNames));
  }

  async load(): Promise<ImageData[] | null> {
    const fileNames = this.getNames();
    if (!fileNames) return null;
    const rootDir = await navigator.storage.getDirectory();

    const images = await Promise.all(
      fileNames.map((x) =>
        rootDir
          .getFileHandle(x)
          .then((x) => x.getFile())
          .then(fileToImage),
      ),
    );

    const canvas = new OffscreenCanvas(images[0].width, images[0].height);
    const context = canvas.getContext("2d")!;
    const items = images.map((image) => {
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    });

    return items;
  }

  getNames(): string[] | null {
    const item = window.localStorage.getItem("saveImages");
    if (!item) return null;
    return JSON.parse(item) as string[];
  }
}

async function fileToImage(file: File) {
  const url = URL.createObjectURL(file); // create an Object URL
  const img = new Image(); // create a temp. image object
  img.src = url;
  try {
    await img.decode();
  } finally {
    URL.revokeObjectURL(img.src);
  }

  return img;
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}
