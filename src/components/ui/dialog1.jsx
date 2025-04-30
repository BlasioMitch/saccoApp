import React from 'react'
import { X } from 'lucide-react'

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onOpenChange} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto bg-custom-bg-secondary dark:bg-custom-bg-secondary rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

const DialogHeader = ({ children }) => {
  return (
    <div className="space-y-1.5 text-center sm:text-left">
      {children}
    </div>
  )
}

const DialogTitle = ({ children }) => {
  return (
    <h3 className="text-lg font-semibold text-custom-text-primary">
      {children}
    </h3>
  )
}

const DialogFooter = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }