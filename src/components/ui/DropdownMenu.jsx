import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { buttonVariants } from './Button'

const ITEM_HEIGHT = 40
const MENU_PADDING = 16

// Menu rendered in a portal with fixed positioning so it is never clipped by a scrolling table
const DropdownMenu = ({ label, ariaLabel, items, width = 192, variant = 'ghost', size = 'icon', keepOpen = false, triggerClassName }) => {
  const [position, setPosition] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const visibleItems = items.filter(item => !item.hidden)

  const close = () => setPosition(null)

  const toggle = (event) => {
    event.stopPropagation()
    if (position) return close()
    const rect = triggerRef.current.getBoundingClientRect()
    const menuHeight = visibleItems.length * ITEM_HEIGHT + MENU_PADDING
    const openUp = rect.bottom + menuHeight + 8 > window.innerHeight
    setPosition({
      top: openUp ? Math.max(8, rect.top - menuHeight - 4) : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
    })
  }

  useEffect(() => {
    if (!position) return
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) close()
    }
    const onKeyDown = (event) => event.key === 'Escape' && close()
    // Close when anything scrolls (except the menu itself), so the menu never detaches from its trigger
    const onScroll = (event) => !menuRef.current?.contains(event.target) && close()
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [position])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={Boolean(position)}
        className={cn(buttonVariants({ variant, size }), triggerClassName)}
      >
        {label}
      </button>
      {position && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ top: position.top, left: position.left, width }}
          className="fixed z-50 max-h-[calc(100vh-16px)] overflow-y-auto rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary py-2 shadow-lg"
        >
          {visibleItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.key || item.label}
                type="button"
                role="menuitem"
                onClick={(event) => {
                  event.stopPropagation()
                  if (!keepOpen) close()
                  item.onClick()
                }}
                className={cn(
                  'flex h-10 w-full items-center gap-2 px-4 text-left text-sm transition-colors hover:bg-custom-interactive-hover',
                  item.danger ? 'text-red-600 dark:text-red-400' : 'text-custom-text-primary'
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}

export default DropdownMenu
