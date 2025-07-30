/**
 * Example demonstrating the theming capabilities of fiscal-year-calendar
 */
const { applyTheme, PREDEFINED_THEMES } = require('../lib/ui/theming');

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
  controls.appendChild(themeSelector);
  
  // Add event listener to change theme
  themeSelector.addEventListener('change', () => {
    const selectedTheme = themeSelector.value;
    
    if (selectedTheme === 'custom') {
      // Example of custom theme
      applyTheme({
        primaryColor: '#9b59b6',
        secondaryColor: '#f1c40f',
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        borderColor: '#cccccc',
        hoverColor: '#e0e0e0',
        todayColor: '#e74c3c',
        quarterColors: ['#9b59b6', '#f1c40f', '#3498db', '#2ecc71']
      });
    } else {
      // Apply predefined theme
      applyTheme(selectedTheme);
    }
    
    // Re-render calendar with new theme
    calendar.render();
  });
});

// Example 2: Creating a theme toggle button
function createThemeToggle(themes = ['light', 'dark']) {
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
function applyThemeToContainer(containerId, theme) {
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
function createThemeCustomizer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const customizer = document.createElement('div');
  customizer.className = 'theme-customizer';
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = 'Theme Customizer';
  customizer.appendChild(title);
  
  // Create color pickers for main theme colors
  const colorOptions = [
    { name: 'primaryColor', label: 'Primary Color', default: '#3498db' },
    { name: 'secondaryColor', label: 'Secondary Color', default: '#2ecc71' },
    { name: 'backgroundColor', label: 'Background Color', default: '#f8f9fa' },
    { name: 'textColor', label: 'Text Color', default: '#2c3e50' },
    { name: 'todayColor', label: 'Today Marker', default: '#e74c3c' }
  ];
  
  const themeConfig = {};
  
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
      themeConfig[option.name] = colorPicker.value;
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
      const colorPicker = document.getElementById(`color-${option.name}`);
      colorPicker.value = option.default;
      themeConfig[option.name] = option.default;
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

// Usage examples
document.addEventListener('DOMContentLoaded', () => {
  // Example 3: Apply different themes to different containers
  applyThemeToContainer('calendar-container-1', 'light');
  applyThemeToContainer('calendar-container-2', 'dark');
  applyThemeToContainer('calendar-container-3', 'high-contrast');
  
  // Example 4: Create theme customizer
  createThemeCustomizer('theme-customizer-container');
});
