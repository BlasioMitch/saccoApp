import React from 'react'
import { formatUGX, parseUGX } from '../../utils/currency'

// Amount field shown as "UGX 20,000"; the value is always whole shillings (number) or '' when empty
const MoneyInput = ({ value, onChange, name, className, placeholder = 'UGX 0', ...props }) => (
  <input
    type="text"
    inputMode="numeric"
    autoComplete="off"
    name={name}
    value={value === '' || value === null || value === undefined ? '' : formatUGX(value)}
    onChange={(e) => {
      const digits = e.target.value.replace(/[^0-9]/g, '')
      onChange(digits === '' ? '' : parseUGX(digits), e)
    }}
    placeholder={placeholder}
    className={className}
    {...props}
  />
)

export default MoneyInput
