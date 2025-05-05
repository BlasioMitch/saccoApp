import React from 'react'

const Content = ({ children, className = '' }) => {
  return (
    <main className={`flex-1 p-6 overflow-auto bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary ${className}`}>
      <div className="container mx-auto">
        {children}
      </div>
    </main>
  )
}

export default Content
