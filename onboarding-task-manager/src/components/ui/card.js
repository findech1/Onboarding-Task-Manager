import React from 'react';

export function Card({ children, className }) {
  return (
    <div
      className={className}
      style={{
        border: '1px solid #ccc',
        borderRadius: '0.25rem',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}