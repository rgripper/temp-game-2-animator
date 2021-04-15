import React, { useCallback, useEffect, useState } from 'react';

export function FrameListPreview({
  frames,
  onSelect,
}: {
  frames: ImageData[];
  onSelect: (frames: ImageData[]) => void;
}) {
  const [selectedFrameIndices, setSelectedFrameIndices] = useState<number[]>([]);

  return (
    <div>
      <ul style={{ display: 'flex' }}>
        {frames.map((frame, i) => (
          <li
            key={i}
            onClick={() =>
              setSelectedFrameIndices((items) =>
                items.includes(i) ? items.filter((x) => x !== i) : [...items, i].sort(),
              )
            }
            style={{
              width: 200,
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ccc',
              position: 'relative',
            }}
          >
            <Thumbnail frame={frame} />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: '#777',
                zIndex: 1,
                opacity: selectedFrameIndices.length && !selectedFrameIndices.includes(i) ? '0.3' : '0',
              }}
            ></div>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => onSelect(selectedFrameIndices.map((i) => frames[i]))}>Process</button>
      </div>
    </div>
  );
}

function Thumbnail({ frame }: { frame: ImageData }) {
  const setFrame = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return;
      }

      const offscreen = new OffscreenCanvas(frame.width, frame.height);
      const draftContext = offscreen.getContext('2d')!;
      draftContext.putImageData(frame, 0, 0);

      const context = canvas.getContext('2d')!;

      const scaleFactor = 200 / Math.max(frame.height, frame.width);
      canvas.width = Math.round(frame.width * scaleFactor);
      canvas.height = Math.round(frame.height * scaleFactor);
      context.scale(scaleFactor, scaleFactor);
      context.drawImage(offscreen, 0, 0);
    },
    [frame],
  );
  return <canvas ref={setFrame} />;
}
