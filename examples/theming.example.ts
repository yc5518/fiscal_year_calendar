/**
 * Example demonstrating the theming capabilities of fiscal-year-calendar (TypeScript version)
 */
import { 
  applyTheme, 
  PREDEFINED_THEMES, 
  ThemeConfig, 
  getCurrentTheme,
  createThemeStyleElement 
} from '../src/ui/theming';

// Example 1: Using a predefined theme
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the fiscal calendar with default theme
  const calendar = new FiscalYearTimeline({
    fiscalYear: 2025,
    presetKey: 'us-federal',
    showToday: true
  });
  
  // Create theme selector
  const themeSelector = document.createElement('select');
  themeSelector.id = 'theme-selector';
  
  // Add theme options
  Object.keys(PREDEFINED_THEMES).forEach(themeName => {
    const option = document.createElement('option');
    option.value = themeName;
    option.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    themeSelector.appendChild(option);
  });
  
  // Add custom theme option
  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = 'Custom';
  themeSelector.appendChild(customOption);
  
  // Add theme selector to controls
  const controls = document.querySelector('.controls');
  if (controls) {
    controls.appendChild(themeSelector);
  }
  
  // Add event listener to change theme
  themeSelector.addEventListener('change', () => {
    const selectedTheme = themeSelector.value;
    
    if (selectedTheme === 'custom') {
      // Example of custom theme
      const customTheme: ThemeConfig = {
        primaryColor: '#9b59b6',
        secondaryColor: '#f1c40f',
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        borderColor: '#cccccc',
        hoverColor: '#e0e0e0',
        todayColor: '#e74c3c',
        quarterColors: ['#9b59b6', '#f1c40f', '#3498db', '#2ecc71']
      };
      
      applyTheme(customTheme);
    } else {
      // Apply predefined theme
      applyTheme(selectedTheme);
    }
    
    // Re-render calendar with new theme
    calendar.render();
  });
});

// Example 2: Creating a theme toggle button
function createThemeToggle(themes: string[] = ['light', 'dark']): HTMLButtonElement {
  let currentThemeIndex = 0;
  
  const toggleButton = document.createElement('button');
  toggleButton.textContent = '🌙';
  toggleButton.className = 'theme-toggle';
  
  toggleButton.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    applyTheme(newTheme);
    
    // Update button icon
    toggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
  
  return toggleButton;
}

// Example 3: Applying theme to a specific container
function applyThemeToContainer(containerId: string, theme: string | ThemeConfig): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Apply theme only to this container
  applyTheme(theme, container);
  
  // Add a class to scope CSS variables
  container.classList.add('themed-container');
  
  // Add scoped styles
  const style = document.createElement('style');
  style.textContent = `
    .themed-container {
      background-color: var(--background-color);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .themed-container h2 {
      color: var(--primary-color);
    }
    
    .themed-container .calendar-header {
      background-color: var(--primary-color);
    }
  `;
  
  document.head.appendChild(style);
}

// Example 4: Creating a theme customizer UI
function createThemeCustomizer(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const customizer = document.createElement('div');
  customizer.className = 'theme-customizer';
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = 'Theme Customizer';
  customizer.appendChild(title);
  
  // Create color pickers for main theme colors
  interface ColorOption {
    name: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor' | 'borderColor' | 'hoverColor' | 'todayColor' | 'fontFamily' | 'borderRadius' | 'fontSize';
    label: string;
    default: string;
  }
  
  const colorOptions: ColorOption[] = [
    { name: 'primaryColor', label: 'Primary Color', default: '#3498db' },
    { name: 'secondaryColor', label: 'Secondary Color', default: '#2ecc71' },
    { name: 'backgroundColor', label: 'Background Color', default: '#f8f9fa' },
    { name: 'textColor', label: 'Text Color', default: '#2c3e50' },
    { name: 'todayColor', label: 'Today Marker', default: '#e74c3c' }
  ];
  
  const themeConfig: ThemeConfig = {};
  
  colorOptions.forEach(option => {
    const group = document.createElement('div');
    group.className = 'customizer-group';
    
    const label = document.createElement('label');
    label.textContent = option.label;
    label.htmlFor = `color-${option.name}`;
    
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = `color-${option.name}`;
    colorPicker.value = option.default;
    
    themeConfig[option.name] = option.default;
    
    colorPicker.addEventListener('change', () => {
      themeConfig[option.name] = colorPicker.value as string;
      applyTheme(themeConfig);
    });
    
    group.appendChild(label);
    group.appendChild(colorPicker);
    customizer.appendChild(group);
  });
  
  // Add reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset to Default';
  resetButton.addEventListener('click', () => {
    colorOptions.forEach(option => {
      const colorPicker = document.getElementById(`color-${option.name}`) as HTMLInputElement;
      if (colorPicker) {
        colorPicker.value = option.default;
        themeConfig[option.name] = option.default as string;
      }
    });
    
    applyTheme(themeConfig);
  });
  
  customizer.appendChild(resetButton);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .theme-customizer {
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 20px;
      margin-top: 20px;
    }
    
    .customizer-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .theme-customizer button {
      margin-top: 10px;
      padding: 8px 16px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
    }
    
    .theme-customizer button:hover {
      opacity: 0.9;
    }
  `;
  
  document.head.appendChild(style);
  container.appendChild(customizer);
}

// Example 5: Exporting theme to CSS
function exportThemeToCSS(theme: string | ThemeConfig): string {
  return createThemeStyleElement(theme).textContent || '';
}

// Example 6: Saving and loading themes
function saveTheme(name: string): void {
  const currentTheme = getCurrentTheme();
  const savedThemes = JSON.parse(localStorage.getItem('fiscal-calendar-themes') || '{}');
  
  savedThemes[name] = currentTheme;
  localStorage.setItem('fiscal-calendar-themes', JSON.stringify(savedThemes));
}

function loadTheme(name: string): ThemeConfig | null {
  const savedThemes = JSON.parse(localStorage.getItem('fiscal-calendar-themes') || '{}');
  const theme = savedThemes[name];
  
  if (theme) {
    applyTheme(theme);
    return theme;
  }
  
  return null;
}

// Usage examples
document.addEventListener('DOMContentLoaded', () => {
  // Example 3: Apply different themes to different containers
  applyThemeToContainer('calendar-container-1', 'light');
  applyThemeToContainer('calendar-container-2', 'dark');
  applyThemeToContainer('calendar-container-3', 'high-contrast');
  
  // Example 4: Create theme customizer
  createThemeCustomizer('theme-customizer-container');
  
  // Example 5: Export theme to CSS
  const exportButton = document.getElementById('export-theme-button');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      const css = exportThemeToCSS(getCurrentTheme());
      
      // Create a download link
      const blob = new Blob([css], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fiscal-calendar-theme.css';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  
  // Example 6: Save and load themes
  const saveThemeButton = document.getElementById('save-theme-button');
  if (saveThemeButton) {
    saveThemeButton.addEventListener('click', () => {
      const themeName = prompt('Enter a name for this theme:');
      if (themeName) {
        saveTheme(themeName);
        alert(`Theme "${themeName}" saved!`);
      }
    });
  }
  
  const loadThemeButton = document.getElementById('load-theme-button');
  if (loadThemeButton) {
    loadThemeButton.addEventListener('click', () => {
      const savedThemes = JSON.parse(localStorage.getItem('fiscal-calendar-themes') || '{}');
      const themeNames = Object.keys(savedThemes);
      
      if (themeNames.length === 0) {
        alert('No saved themes found.');
        return;
      }
      
      const themeName = prompt(`Choose a theme to load: ${themeNames.join(', ')}`);
      if (themeName) {
        const theme = loadTheme(themeName);
        if (theme) {
          alert(`Theme "${themeName}" loaded!`);
        } else {
          alert(`Theme "${themeName}" not found.`);
        }
      }
    });
  }
});

// For demonstration purposes, declare the FiscalYearTimeline class
// In a real application, this would be imported from the library
declare class FiscalYearTimeline {
  constructor(options: {
    fiscalYear: number;
    presetKey: string;
    showToday: boolean;
  });
  
  render(): void;
}
