export function FrameFileLoader({ onLoaded }: { onLoaded: (images: ImageData[]) => void }) {
    return (
        <label className="btn btn-outline relative">
            Load images
            <input className="w-0 h-0 absolute" type="file" multiple onChange={async (e) => {
                const files = e.target.files;
                if (!files) return;
                let canvas: OffscreenCanvas | undefined = undefined;

                const contents = await Promise.all(Array.from(files).sort((a, b) => a.name.localeCompare(b.name)).map(async file => {
                    const img = await fileToImage(file);
                    if (!canvas)  {
                        canvas = new OffscreenCanvas(img.width, img.height)
                    }
                    const context = canvas.getContext("2d")!;
                    context.drawImage(img, 0, 0);
                    return context.getImageData(0, 0, img.width, img.height);    
                }))

                onLoaded(contents)
            }} />
        </label>
    )
}



function fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);         // create an Object URL
        const img = new Image();                         // create a temp. image object
      
        img.onload = function() {                    // handle async image loading
            URL.revokeObjectURL(img.src);
            resolve(img);
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        }
        img.src = url;   
    })
}