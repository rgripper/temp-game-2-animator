import React from 'react';

export function Ping({ size = 'md' }: { size: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-2 h-2' : 'w-4 h-4';

  return (
    <span className={`h-full w-full absolute top-0 right-0 grid place-items-center`}>
      <span className={`animate-ping ${sizeClasses} inline-flex rounded-full bg-yellow-500`}></span>
    </span>
  );
}
