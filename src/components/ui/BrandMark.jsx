import React from 'react'
import mark from '../../assets/brand/gs-mark.svg'
import sprout from '../../assets/brand/gs-sprout.svg'
import { cn } from '../../lib/utils'

// The Green Sprout mark (greensprout/assets/images/gs.svg), drawn in the current text colour via a CSS mask,
// so one SVG works at any size on light and dark backgrounds
const maskStyle = (image) => ({
  WebkitMaskImage: `url(${image})`,
  maskImage: `url(${image})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
})

// label="" marks a purely decorative copy (hidden from screen readers).
// variant="sprout": only the sprout in its circle (gs-sprout.svg), for small sizes or next to the name in type.
const BrandMark = ({ className, label = 'Green Sprout', variant = 'full' }) => (
  <span
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    className={cn('inline-block shrink-0 bg-current', className)}
    style={maskStyle(variant === 'sprout' ? sprout : mark)}
  />
)

export default BrandMark
