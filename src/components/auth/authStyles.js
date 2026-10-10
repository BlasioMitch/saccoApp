// Shared look of the sign-in card and its fields (matches LoginForm)
export const cardClass = 'w-full max-w-md p-8 space-y-6 bg-custom-bg-secondary rounded-xl shadow-lg'
export const labelClass = 'block text-sm font-medium text-custom-text-primary'
export const fieldClass = 'mt-2 block w-full h-10 px-4 text-sm bg-custom-bg-tertiary border border-custom-brand-light dark:border-custom-brand-dark rounded-lg text-custom-text-primary placeholder-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-brand-primary transition-colors'
export const submitClass = 'w-full px-4 h-10 text-sm font-medium text-custom-interactive-active-text bg-custom-brand-primary hover:bg-custom-brand-dark focus:bg-custom-brand-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-brand-primary disabled:opacity-60'
export const linkClass = 'text-sm text-custom-brand-primary hover:text-custom-brand-dark transition-colors'

// Same rules the server applies to every new password
export const passwordProblem = (password) => {
  if (password.length < 8) return 'At least 8 characters'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Use letters and numbers'
  return null
}
