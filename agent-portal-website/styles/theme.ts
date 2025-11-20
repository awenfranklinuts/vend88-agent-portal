/**
 * Application Color Theme
 */
export const colors = {
  // Primary colors (deep blue + cyan gradient tech feel)
  primary: {
    main: '#1a237e',      // Deep blue
    light: '#00eaff',     // Cyan
    dark: '#0d1333',      // Darker blue
    gradient: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
  },
  
  // Secondary colors (purple + cyan gradient)
  secondary: {
    main: '#7c3aed',      // Purple
    light: '#00eaff',     // Cyan
    dark: '#4c1d95',      // Deep purple
    gradient: 'linear-gradient(90deg, #7c3aed 0%, #00eaff 100%)',
  },
  
  // Danger colors
  danger: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
  },
  
  // Text colors
  text: {
    primary: '#222831',
    secondary: '#5c6b7a',
    light: '#b0bec5',
    inverse: '#ffffff',
  },
  
  // Background colors
  background: {
    main: '#f7faff',
    light: 'rgba(255,255,255,0.7)',
    dark: '#232946',
    glass: 'rgba(255,255,255,0.25)',
    gradient: 'linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%)',
  },
  
  // Border colors
  border: {
    main: '#e0e7ef',
    light: '#f1f5f9',
    dark: '#b0bec5',
    gradient: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
  },
  
  // Success status
  success: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#047857',
  },
  
  // Error status
  error: {
    main: '#991b1b',
    light: '#fee2e2',
    dark: '#7f1d1d',
  },

  // Button colors
  button: {
    primary: 'linear-gradient(90deg, #1a237e 0%, #00eaff 100%)',
    secondary: '#e0e7ef',
    disabled: '#b0bec5',
    glass: 'rgba(255,255,255,0.15)',
  },
};

/**
 * Spacing theme
 */
export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  xxl: '4rem',
};

/**
 * Border radius theme
 */
export const radius = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  round: '9999px',
};

/**
 * Shadow theme
 */
export const shadows = {
  sm: '0 2px 8px rgba(30, 64, 175, 0.08)',
  md: '0 4px 16px rgba(30, 64, 175, 0.12)',
  lg: '0 8px 32px rgba(30, 64, 175, 0.16)',
  xl: '0 16px 48px rgba(30, 64, 175, 0.18)',
  glass: '0 8px 32px rgba(30, 64, 175, 0.10)',
};

/**
 * Font recommendations
 */
export const font = {
  family: `'Inter', 'Roboto', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif`,
  weight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  size: {
    base: '1rem',
    lg: '1.25rem',
    xl: '2rem',
    title: '2.5rem',
  },
};

// Export complete theme
const theme = {
  colors,
  spacing,
  radius,
  shadows,
  font,
};

export default theme;
