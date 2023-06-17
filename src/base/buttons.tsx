import classNames from 'classnames';
import React from 'react';

export function Button({
  size = 'md',
  ...props
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { size?: 'md' | 'sm' }) {
  switch (size) {
    case 'sm':
      return (
        <button
          {...props}
          className={classNames(
            `h-10 px-5 text-gray-100 transition-colors duration-150 bg-yellow-500 rounded-xl focus:outline-none focus:ring focus:ring-yellow-300 hover:bg-yellow-600`,
            props.className,
          )}
        />
      );
    case 'md':
    default:
      return (
        <button
          {...props}
          className={classNames(
            `h-12 px-6 text-lg text-gray-100 transition-colors duration-150 bg-yellow-500 rounded-xl focus:outline-none focus:ring focus:ring-yellow-300 hover:bg-yellow-600`,
            props.className,
          )}
        />
      );
  }
}
