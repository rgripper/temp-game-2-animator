import React, { useState, useRef, useEffect } from 'react';

export function Countdown({ seconds, onCompleted }: any) {
  const countdown = useCountdown(seconds);
  useEffect(() => {
    if (countdown === 0) {
      onCompleted();
    }
  }, [countdown]);

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'transparent',
        fontSize: 400,
        top: 0,
        left: 0,
        textAlign: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {countdown}
    </div>
  );
}

function useCountdown(seconds: number): number {
  const [countdown, setCountdown] = useState(seconds);
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;

  useEffect(() => {
    let isCancelled = false;
    function runCountdown() {
      setTimeout(() => {
        if (isCancelled || countdownRef.current === 0) {
          return;
        }
        setCountdown((x) => x - 1);
        runCountdown();
      }, 1000);
    }
    runCountdown();
    return () => {
      isCancelled = true;
    };
  }, [seconds]);

  return countdown;
}
