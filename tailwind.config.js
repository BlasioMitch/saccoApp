/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-background',
    'text-foreground',
    'border-border',
    'bg-card',
    'text-card-foreground',
    'bg-popover',
    'text-popover-foreground',
  ],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'custom-bg-primary': 'var(--custom-bg-primary)',
  			'custom-bg-secondary': 'var(--custom-bg-secondary)',
  			'custom-bg-tertiary': 'var(--custom-bg-tertiary)',
  			'custom-text-primary': 'var(--custom-text-primary)',
  			'custom-text-secondary': 'var(--custom-text-secondary)',
  			'custom-text-muted': 'var(--custom-text-muted)',
  			'custom-brand-primary': 'var(--custom-brand-primary)',
  			'custom-brand-green': 'var(--custom-brand-green)',
  			'custom-brand-light': 'var(--custom-brand-light)',
  			'custom-brand-dark': 'var(--custom-brand-dark)',
  			'custom-interactive-hover': 'var(--custom-interactive-hover)',
  			'custom-interactive-focus': 'var(--custom-interactive-focus)',
  			'custom-interactive-active-bg': 'var(--custom-interactive-active-bg)',
  			'custom-interactive-active-text': 'var(--custom-interactive-active-text)',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

