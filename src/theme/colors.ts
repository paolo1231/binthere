// Bin There App Theme Colors

export const colors = {
    // Primary brand colors
    primary: '#4A6FA5', // Deep blue - main brand color
    secondary: '#47B881', // Green - for success/action states
    accent: '#FFB347', // Orange - for highlights and accents

    // UI colors
    background: '#FFFFFF',
    card: '#F8F9FA',
    cardBorder: '#E9ECEF',
    text: '#212529',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',

    // Status colors
    success: '#47B881',
    warning: '#FFB347',
    error: '#E53935',
    info: '#4A6FA5',

    // Gradients
    gradientStart: '#4A6FA5',
    gradientEnd: '#6889B9',
};

export const darkColors = {
    // Dark mode colors
    primary: '#5D82B3', // Lighter blue for dark mode
    secondary: '#56C893', // Brighter green for dark mode
    accent: '#FFBF61', // Brighter orange for dark mode

    background: '#121212',
    card: '#1E1E1E',
    cardBorder: '#333333',
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    textLight: '#6C757D',

    success: '#56C893',
    warning: '#FFBF61',
    error: '#FF5252',
    info: '#5D82B3',

    gradientStart: '#3A5A8C',
    gradientEnd: '#5D82B3',
};

export type ThemeColors = typeof colors;