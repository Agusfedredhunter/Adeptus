import React from 'react';
import classNames from 'classnames';

const VARIANTES = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTES[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
