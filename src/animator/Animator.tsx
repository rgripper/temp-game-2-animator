import React, { useRef, useState, useEffect } from "react";
import { Ping } from "../base/Ping";
import { Dresser } from "./Dresser";
import type { Pose } from "../useEstimator";
import { PixelEditor } from "./PixelEditor";

export function Animator({ poses }: { poses: Pose[] }) {
  const posesRef = useRef<Pose[]>(poses);
  posesRef.current = poses;

  const [poseIndex, setPoseIndex] = useState(0);
  const pose = poses[poseIndex];
  useEffect(() => {
    if (poses) {
      window.localStorage.setItem("poses", JSON.stringify(poses));
    }
  }, [poses]);

  useEffect(() => {
    setInterval(() => {
      setPoseIndex((p) =>
        posesRef.current ? (p > posesRef.current.length - 2 ? 0 : p + 1) : 0,
      );
    }, 250);
  }, []);

  return (
    <div
      className={`relative w-32 h-32 grid place-items-center border-2 border-gray-600 bg-gray-400`}
    >
      {pose && <Dresser pose={pose} />}

      {/* {pose && <PixelEditor pose={pose} />} */}

      {!poses && <Ping size="md" />}
    </div>
  );
}
