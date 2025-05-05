import React from 'react'

const Switch = ({ checked = false, onCheckedChange, label, className = "" }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-brand-primary focus-visible:ring-offset-2 ${
          checked 
            ? 'bg-custom-brand-primary' 
            : 'bg-custom-bg-tertiary'
        }`}
      >
        <span className="sr-only">{label || "Toggle theme"}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-custom-interactive-active-text transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm text-custom-text-secondary">
          {label}
        </span>
      )}
    </label>
  )
}

export default Switch