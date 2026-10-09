import React from 'react'
import mark from '../../assets/brand/gs-mark.svg'
import { cn } from '../../lib/utils'

// The Green Sprout mark (greensprout/assets/images/gs.svg), drawn in the current text colour via a CSS mask,
// so one SVG works at any size on light and dark backgrounds
const maskStyle = {
  WebkitMaskImage: `url(${mark})`,
  maskImage: `url(${mark})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

const BrandMark = ({ className, label = 'Green Sprout' }) => (
  <span role="img" aria-label={label} className={cn('inline-block shrink-0 bg-current', className)} style={maskStyle} />
)

export default BrandMark
