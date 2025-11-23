import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-16 h-16 border-4 border-[var(--border-primary)] border-t-[var(--accent-secondary)] rounded-full animate-spin"></div>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;
