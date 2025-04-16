import React from 'react';

export function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}