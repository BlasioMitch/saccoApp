import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

// Modal heading "<label>: <identifier>". `mono` is for machine IDs (UUIDs): monospace, wraps, copyable.
const DetailsTitle = ({ label, value, mono = false }) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy')
    }
  }

  if (!value) return <>{label}</>

  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{label}:</span>
      {mono ? (
        <span className="inline-flex min-w-0 items-center gap-1">
          <span className="break-all font-mono text-sm font-medium text-custom-text-secondary">{value}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${label.replace(/ Details$/, '')} ID`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-custom-text-secondary transition-colors hover:bg-custom-interactive-hover hover:text-custom-text-primary"
          >
            {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </span>
      ) : (
        <span className="text-custom-brand-primary">{value}</span>
      )}
    </span>
  )
}

export default DetailsTitle
