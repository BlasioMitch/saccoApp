import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-light-bg-tertiary dark:border-dark-bg-tertiary rounded-lg"
        >
          <button
            onClick={() => toggleItem(index)}
            className="flex items-center justify-between w-full p-4 text-left bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors rounded-lg"
          >
            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              {item.title}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="p-4 bg-light-bg-primary dark:bg-dark-bg-primary rounded-b-lg">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion