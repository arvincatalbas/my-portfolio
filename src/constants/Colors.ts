const tintColorLight = '#00bcd4'; // Clean cyan for light mode
const tintColorDark = '#00eeff';  // Glowing neon cyan for dark mode

export default {
  light: {
    text: '#1F2937',
    background: '#F9FAFB',
    card: '#FFFFFF',
    tint: tintColorLight,
    accent: '#00838F',
    secondaryText: '#4B5563',
    border: '#E5E7EB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1f242d', // Deep slate-dark background
    card: '#323946',       // Lighter card container background
    tint: tintColorDark,   // Neon cyan accent tint
    accent: tintColorDark,
    secondaryText: '#cbd5e1', // Light slate grey for text
    border: '#3e4553',        // Dark border color
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
  },
};
