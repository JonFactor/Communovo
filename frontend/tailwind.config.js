/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./app/(tabs)/**/*.{js,jsx,ts,tsx}", 
  "./app/components/**/*.{js,jsx,ts,tsx}",
  "./app/(tabs)/home/index.tsx",
  "./app/(tabs)/login/index.tsx",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./app/(tabs)/events/[id].tsx",
  "./app/(tabs)/register/index.tsx",
  "./app/(tabs)/profile/index.tsx",
  "./app/(tabs)/events/index.tsx",
  "./app/(tabs)/discover/index.tsx",
  "./app/(tabs)/createGroup/index.tsx",
  './app/(tabs)/discover/[name].tsx',
  "./app/(tabs)/accountRecovery/index.tsx"
],
  theme: {
    extend: {
      colors: {
        'light-blue': '#BBD0FF',
        'md-blue': '#B8C0FF',
        'md-purple': '#C8B6FF',
        'light-purple': '#E7C6FF',
        'light-pink': '#FFD6FF',
        'dark-blue': '#8794FF'
      }
    },
  },
  plugins: [],
}

