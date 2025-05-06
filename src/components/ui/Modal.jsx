import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-lg p-6 m-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-full text-light-text-secondary dark:text-dark-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-light-text-primary dark:text-dark-text-primary">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal