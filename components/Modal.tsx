import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ show, onClose, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative mt-10">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
            aria-label="Fermer"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
