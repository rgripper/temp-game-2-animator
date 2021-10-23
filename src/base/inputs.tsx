import React from 'react';
import { tw } from 'twind';

export function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      className={tw`rounded-md text-gray-50 peer pl-12 pr-2 py-2 border-1 border-gray-600 focus:outline-none focus:ring focus:ring-gray-400 hover:border-gray-500 placeholder-gray-300 bg-transparent`}
      {...props}
    />
  );
}
