import React from 'react'
import { cn } from '../../lib/utils'

// Page root: fills <main> exactly so the page never scrolls; children use flex-1 min-h-0 to take the rest
export const PageShell = ({ children, className }) => (
  <div className={cn('flex h-full min-h-0 flex-col gap-6', className)}>
    {children}
  </div>
)

// Card surface that fills the remaining page height (tables, charts, panels)
export const Panel = ({ children, className }) => (
  <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary', className)}>
    {children}
  </div>
)

export default PageShell
