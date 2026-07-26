import React from 'react';
import classNames from 'classnames';

const Input = React.forwardRef(function Input({ label, error, id, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={classNames(
          'rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-red-400' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
