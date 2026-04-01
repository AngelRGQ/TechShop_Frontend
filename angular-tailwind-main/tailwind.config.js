// const colors = require('tailwindcss/colors');

module.exports = {
  prefix: '',
  mode: 'jit',
  important: false,
  content: ['./src/**/*.{html,ts}', // Incluye todos los archivos HTML y TypeScript
    './node_modules/flyonui/dist/js/*.js', // Incluye los archivos JS del plugin FlyOnUI
  
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-out-down': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-out-up': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        'fade-out-down': 'fade-out-down 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'fade-out-up': 'fade-out-up 0.3s ease-out',
      },
      boxShadow: {
        custom: '0px 0px 50px 0px rgb(82 63 105 / 15%)',
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'system-ui', 'sans-serif'],
      nunito: ['Nunito Sans', 'sans-serif'],
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  variants: {
    extend: {},
    scrollbar: ['dark', 'rounded'],
  },
  flyonui: {
    themes: [ {
      mytheme: {
        primary: "#053E85",
        secondary: "#EDEDF1",
        accent: "#37cdbe",
        neutral: "#3d4451",
          "input":{
            "border-color": 'hsl(var(--border))',
             "font-size":"0.875rem"
          },
          "input:hover":{
            "border-color": 'none',
          },

          ".input-group":{
            "border-color": 'hsl(var(--border))',
             "font-size":"0.875rem"
          },
          ".input-group:hover":{
            "border-color": 'none',
          },


          "select":{
            "border-color": 'hsl(var(--border))',
             "font-size":"0.875rem",
             "height": "auto",
               "padding": "8px 12px"
          },
          "select:hover":{
            "border-color": 'none',
          },

          "textarea":{
            "border-color": 'hsl(var(--border))',
             "font-size":"0.875rem"
          },
          "textarea:hover":{
            "border-color": 'none',
          },

        
      }}]
  },
  
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
    require('flyonui')
  ],
};