import React from 'react';
import { tw } from 'twind';

export function Button({
  size = 'md',
  ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { size?: 'md' | 'sm' }) {
  switch (size) {
    case 'sm':
      return (
        <button
          className={tw`h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-yellow-500 rounded-xl focus:outline-none focus:ring focus:ring-yellow-300 hover:bg-yellow-600`}
          {...props}
        />
      );
    case 'md':
    default:
      return (
        <button
          className={tw`h-12 px-6 m-2 text-lg text-gray-100 transition-colors duration-150 bg-yellow-500 rounded-xl focus:outline-none focus:ring focus:ring-yellow-300 hover:bg-yellow-600`}
          {...props}
        />
      );
  }
}
