import { useState, useRef, useEffect } from 'react';

export function Countdown({ seconds, onCompleted }: any) {
  const countdown = useCountdown(seconds);
  useEffect(() => {
    if (countdown === 0) {
      onCompleted();
    }
  }, [countdown, onCompleted]);

  return (
    <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center bg-transparent gap-8`}>
      {new Array(countdown).fill(null).map((x, i) => (
        <span key={i} className={`w-8 h-8 rounded-full bg-yellow-500`}></span>
      ))}
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
