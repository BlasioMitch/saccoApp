import React, { useState } from 'react'

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-custom-bg-secondary dark:bg-custom-bg-secondary rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-custom-text-primary dark:text-custom-text-primary">
        Welcome Back
      </h2>
      <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-custom-text-secondary dark:text-custom-text-secondary">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 bg-custom-bg-tertiary dark:bg-custom-bg-tertiary border border-custom-brand-light dark:border-custom-brand-dark rounded-md text-custom-text-primary dark:text-custom-text-primary placeholder-custom-text-muted dark:placeholder-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary transition-colors"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-custom-text-secondary dark:text-custom-text-secondary">
            Password
          </label>
          <input
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 bg-custom-bg-tertiary dark:bg-custom-bg-tertiary border border-custom-brand-light dark:border-custom-brand-dark rounded-md text-custom-text-primary dark:text-custom-text-primary placeholder-custom-text-muted dark:placeholder-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary transition-colors"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-custom-interactive-active-text bg-custom-brand-primary hover:bg-custom-brand-dark focus:bg-custom-brand-dark rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-brand-primary"
        >
          Sign In
        </button>
      </form>
      <p className="text-sm text-center text-custom-text-secondary dark:text-custom-text-secondary">
        Don't have an account?{' '}
        <a href="#" className="text-custom-brand-primary hover:text-custom-brand-dark transition-colors">
          Sign up
        </a>
      </p>
    </div>
  )
}

export default LoginForm