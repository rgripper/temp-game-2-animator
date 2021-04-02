import { useRef, useEffect } from 'react';

function useInterval(callback: (intervalId: any) => void, delay: number | null) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    // Don't schedule if no delay is specified.

    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current(id)
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
