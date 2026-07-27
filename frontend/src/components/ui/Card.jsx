import React from 'react';
import classNames from 'classnames';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={classNames('rounded-xl border border-gray-200 bg-white p-5 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
