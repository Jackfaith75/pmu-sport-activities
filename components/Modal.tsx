import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ show, onClose, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="unstyled absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
          aria-label="Fermer"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
