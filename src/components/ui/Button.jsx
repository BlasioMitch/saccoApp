import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// 8pt grid: md = 40px, sm = 32px, icon = 32px square
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-brand-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-custom-brand-primary text-custom-interactive-active-text hover:bg-custom-brand-dark',
        secondary: 'border border-custom-bg-tertiary bg-custom-bg-secondary text-custom-text-primary hover:bg-custom-interactive-hover',
        ghost: 'text-custom-text-secondary hover:bg-custom-interactive-hover hover:text-custom-text-primary',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        md: 'h-10 px-4',
        sm: 'h-8 px-4',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

const Button = React.forwardRef(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'

export default Button
