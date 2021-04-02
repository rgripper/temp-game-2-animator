import React from 'react';
import type { Pose } from '@tensorflow-models/posenet';

export function Animator({ poses }: { poses: Pose[] }) {
  return <div>{poses.map((x) => x).length}</div>;
}
