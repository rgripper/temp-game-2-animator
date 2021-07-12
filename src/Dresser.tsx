import type { Pose } from './FrameEstimator';
import React from 'react';

export function Dresser({ pose }: { pose: Pose }) {
  const range = (count: number) => new Array(count).fill(null);

  return (
    <div>
      {range(16).map((y, yi) => (
        <div key={yi}>
          {range(16).map((x, xi) => (
            <span key={xi} style={{ width: '24px', height: '24px', display: 'inline-block' }}>
              {x},{y}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
