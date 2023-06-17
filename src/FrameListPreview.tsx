import { useCallback, useState } from 'react';

export function FrameListPreview({
  frames,
  onSelect,
}: {
  frames: ImageData[];
  onSelect: (frames: ImageData[]) => void;
}) {
  const [selectedFrameIndices, setSelectedFrameIndices] = useState<number[]>(frames.map((_, i) => i));

  return (
    <div>
      <ul style={{ display: 'flex', width: '800px', flexWrap: 'wrap' }}>
        {frames.map((frame, i) => (
          <li
            key={i}
            onClick={() =>
              setSelectedFrameIndices((items) =>
                items.includes(i) ? items.filter((x) => x !== i) : [...items, i].sort(),
              )
            }
            style={{
              listStyleType: 'none',
              border: selectedFrameIndices.includes(i) ? '3px solid #33f' : '3px solid #ccc',
              position: 'relative',
            }}
          >
            <Thumbnail frame={frame} size={100} />
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: '#333',
                zIndex: 1,
                opacity: selectedFrameIndices.length && !selectedFrameIndices.includes(i) ? '0.5' : '0',
              }}
            ></div>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => {
            const selectedFrames = selectedFrameIndices.map((i) => frames[i]);
            console.log(selectedFrames);
            onSelect(selectedFrames);
          }}
        >
          Process
        </button>
      </div>
    </div>
  );
}

function Thumbnail({ frame, size }: { frame: ImageData; size: number }) {
  const setFrame = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return;
      }

      const offscreen = new OffscreenCanvas(frame.width, frame.height);
      const draftContext = offscreen.getContext('2d')!;
      draftContext.putImageData(frame, 0, 0);

      const context = canvas.getContext('2d')!;

      const scaleFactor = size / Math.max(frame.height, frame.width);
      canvas.width = Math.round(frame.width * scaleFactor);
      canvas.height = Math.round(frame.height * scaleFactor);
      context.scale(scaleFactor, scaleFactor);
      context.drawImage(offscreen, 0, 0);
    },
    [frame],
  );
  return <canvas ref={setFrame} />;
}
