/**
 * Theming utilities for fiscal-year-calendar
 * Provides functions to customize the appearance of calendar components
 */

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  todayColor?: string;
  quarterColors?: string[];
  fontFamily?: string;
  borderRadius?: string;
  fontSize?: string;
}

/**
 * Predefined themes
 */
export const PREDEFINED_THEMES: Record<string, ThemeConfig> = {
  'light': {
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    backgroundColor: '#f8f9fa',
    textColor: '#2c3e50',
    borderColor: '#ddd',
    hoverColor: '#ecf0f1',
    todayColor: '#e74c3c',
    quarterColors: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    borderRadius: '4px',
    fontSize: '14px'
  },
  'dark': {
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    backgroundColor: '#2c3e50',
    textColor: '#ecf0f1',
    borderColor: '#34495e',
    hoverColor: '#34495e',
    todayColor: '#e74c3c',
    quarterColors: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    borderRadius: '4px',
    fontSize: '14px'
  },
  'high-contrast': {
    primaryColor: '#ffff00',
    secondaryColor: '#00ffff',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    hoverColor: '#333333',
    todayColor: '#ff0000',
    quarterColors: ['#ffff00', '#00ffff', '#ff00ff', '#ffffff'],
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    borderRadius: '0',
    fontSize: '16px'
  },
  'pastel': {
    primaryColor: '#a8d8ea',
    secondaryColor: '#aa96da',
    backgroundColor: '#fcfcfc',
    textColor: '#3d3d3d',
    borderColor: '#e6e6e6',
    hoverColor: '#f5f5f5',
    todayColor: '#ff9a8b',
    quarterColors: ['#a8d8ea', '#aa96da', '#c7ceea', '#fcbad3'],
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    borderRadius: '8px',
    fontSize: '14px'
  },
  'corporate': {
    primaryColor: '#1a73e8',
    secondaryColor: '#34a853',
    backgroundColor: '#ffffff',
    textColor: '#202124',
    borderColor: '#dadce0',
    hoverColor: '#f1f3f4',
    todayColor: '#ea4335',
    quarterColors: ['#1a73e8', '#34a853', '#fbbc04', '#ea4335'],
    fontFamily: 'Roboto, Arial, sans-serif',
    borderRadius: '4px',
    fontSize: '14px'
  }
};

/**
 * Apply a theme to the fiscal calendar components
 * @param theme - Theme name or custom theme configuration
 * @param targetElement - Target element to apply the theme to (defaults to document.documentElement)
 * @returns The applied theme configuration
 */
export function applyTheme(
  theme: string | ThemeConfig,
  targetElement: HTMLElement = document.documentElement
): ThemeConfig {
  let themeConfig: ThemeConfig;
  
  if (typeof theme === 'string') {
    // Use predefined theme
    themeConfig = PREDEFINED_THEMES[theme] || PREDEFINED_THEMES['light'];
  } else {
    // Merge custom theme with light theme defaults
    themeConfig = { ...PREDEFINED_THEMES['light'], ...theme };
  }
  
  // Apply theme variables to the target element
  if (themeConfig.primaryColor) {
    targetElement.style.setProperty('--primary-color', themeConfig.primaryColor);
  }
  
  if (themeConfig.secondaryColor) {
    targetElement.style.setProperty('--secondary-color', themeConfig.secondaryColor);
  }
  
  if (themeConfig.backgroundColor) {
    targetElement.style.setProperty('--background-color', themeConfig.backgroundColor);
  }
  
  if (themeConfig.textColor) {
    targetElement.style.setProperty('--text-color', themeConfig.textColor);
  }
  
  if (themeConfig.borderColor) {
    targetElement.style.setProperty('--border-color', themeConfig.borderColor);
  }
  
  if (themeConfig.hoverColor) {
    targetElement.style.setProperty('--hover-color', themeConfig.hoverColor);
  }
  
  if (themeConfig.todayColor) {
    targetElement.style.setProperty('--today-color', themeConfig.todayColor);
  }
  
  if (themeConfig.quarterColors && themeConfig.quarterColors.length >= 4) {
    targetElement.style.setProperty('--quarter-colors', themeConfig.quarterColors.join(', '));
  }
  
  if (themeConfig.fontFamily) {
    targetElement.style.setProperty('--font-family', themeConfig.fontFamily);
  }
  
  if (themeConfig.borderRadius) {
    targetElement.style.setProperty('--border-radius', themeConfig.borderRadius);
  }
  
  if (themeConfig.fontSize) {
    targetElement.style.setProperty('--font-size', themeConfig.fontSize);
  }
  
  return themeConfig;
}

/**
 * Get the current theme configuration
 * @param targetElement - Target element to get the theme from (defaults to document.documentElement)
 * @returns The current theme configuration
 */
export function getCurrentTheme(targetElement: HTMLElement = document.documentElement): ThemeConfig {
  const computedStyle = getComputedStyle(targetElement);
  
  return {
    primaryColor: computedStyle.getPropertyValue('--primary-color').trim(),
    secondaryColor: computedStyle.getPropertyValue('--secondary-color').trim(),
    backgroundColor: computedStyle.getPropertyValue('--background-color').trim(),
    textColor: computedStyle.getPropertyValue('--text-color').trim(),
    borderColor: computedStyle.getPropertyValue('--border-color').trim(),
    hoverColor: computedStyle.getPropertyValue('--hover-color').trim(),
    todayColor: computedStyle.getPropertyValue('--today-color').trim(),
    quarterColors: computedStyle.getPropertyValue('--quarter-colors')
      .split(',')
      .map(color => color.trim()),
    fontFamily: computedStyle.getPropertyValue('--font-family').trim(),
    borderRadius: computedStyle.getPropertyValue('--border-radius').trim(),
    fontSize: computedStyle.getPropertyValue('--font-size').trim()
  };
}

/**
 * Generate CSS for a theme
 * @param theme - Theme name or custom theme configuration
 * @returns CSS string for the theme
 */
export function generateThemeCSS(theme: string | ThemeConfig): string {
  let themeConfig: ThemeConfig;
  
  if (typeof theme === 'string') {
    // Use predefined theme
    themeConfig = PREDEFINED_THEMES[theme] || PREDEFINED_THEMES['light'];
  } else {
    // Merge custom theme with light theme defaults
    themeConfig = { ...PREDEFINED_THEMES['light'], ...theme };
  }
  
  return `
:root {
  --primary-color: ${themeConfig.primaryColor};
  --secondary-color: ${themeConfig.secondaryColor};
  --background-color: ${themeConfig.backgroundColor};
  --text-color: ${themeConfig.textColor};
  --border-color: ${themeConfig.borderColor};
  --hover-color: ${themeConfig.hoverColor};
  --today-color: ${themeConfig.todayColor};
  --quarter-colors: ${themeConfig.quarterColors?.join(', ')};
  --font-family: ${themeConfig.fontFamily};
  --border-radius: ${themeConfig.borderRadius};
  --font-size: ${themeConfig.fontSize};
}
  `;
}

/**
 * Create a style element with theme CSS
 * @param theme - Theme name or custom theme configuration
 * @param id - ID for the style element (defaults to 'fiscal-calendar-theme')
 * @returns The created style element
 */
export function createThemeStyleElement(
  theme: string | ThemeConfig,
  id: string = 'fiscal-calendar-theme'
): HTMLStyleElement {
  // Remove existing theme style element if it exists
  const existingStyle = document.getElementById(id);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  const styleElement = document.createElement('style');
  styleElement.id = id;
  styleElement.textContent = generateThemeCSS(theme);
  
  // Add to document head
  document.head.appendChild(styleElement);
  
  return styleElement;
}
