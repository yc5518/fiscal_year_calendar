# Fiscal Year Calendar - Visualization Components

This directory contains visualization components for displaying fiscal calendars in web applications. These components provide visual representations of fiscal year data and can be easily integrated into any web project.

## Available Components

### Calendar Grid

The `calendar-grid.html` file provides a responsive grid layout for displaying fiscal year calendars. It includes:

- Interactive controls for selecting fiscal year parameters
- Quarter-based layout with months organized by fiscal quarters
- Color-coded days for weekends, holidays, and current day
- Responsive design that works on desktop and mobile devices

#### Features

- **Fiscal Year Selection**: Choose any fiscal year
- **Start Month/Day Selection**: Configure the start of the fiscal year
- **Start of Week Selection**: Choose whether weeks start on Monday, Sunday, or Saturday
- **Preset Selection**: Quickly apply common fiscal year presets (US Federal, UK Standard, etc.)
- **Information Panel**: Displays key fiscal year information
- **Quarter View**: Organizes months by fiscal quarters

#### Usage

Simply open the `calendar-grid.html` file in a web browser to use the component. You can also integrate it into your web application by copying the HTML, CSS, and JavaScript code.

### Timeline Chart

The `timeline-chart.html` file provides a horizontal timeline visualization of fiscal periods. It includes:

- Interactive timeline showing quarters, months, and weeks
- Ability to filter the view to show only quarters, months, or weeks
- Tooltips with detailed information about each period
- Today marker showing the current date in the fiscal timeline

#### Features

- **Fiscal Year Selection**: Choose any fiscal year
- **Preset Selection**: Quickly apply common fiscal year presets
- **View Filtering**: Toggle between showing all periods or only quarters, months, or weeks
- **Interactive Timeline**: Hover over periods to see detailed information
- **Today Marker**: Visual indicator of the current date in the fiscal timeline
- **Information Panel**: Displays key fiscal year information

#### Usage

Simply open the `timeline-chart.html` file in a web browser to use the component. You can also integrate it into your web application by copying the HTML, CSS, and JavaScript code.

## Integration Guide

### Basic Integration

1. Copy the HTML, CSS, and JavaScript code from the desired component file.
2. Include the necessary dependencies (Moment.js and the fiscal-year-calendar library).
3. Add the component to your web page.

### Using with the Fiscal Year Calendar Library

These components are designed to work with the fiscal-year-calendar library. Make sure to include the library in your project:

```html
<script src="path/to/fiscal-year-calendar/dist/cjs/index.js"></script>
```

If the library is not available, the components will fall back to mock data for demonstration purposes.

### Customization

You can customize these components by modifying the CSS styles or JavaScript code:

- Change colors and styling by editing the CSS
- Modify the behavior by editing the JavaScript functions
- Add additional features by extending the existing code

## Browser Compatibility

These components are compatible with modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- [Moment.js](https://momentjs.com/) - For date manipulation and formatting
- [Fiscal Year Calendar Library](../../README.md) - For fiscal year calculations

## Examples

### Calendar Grid Example

![Calendar Grid Example](https://via.placeholder.com/800x400?text=Calendar+Grid+Example)

### Timeline Chart Example

![Timeline Chart Example](https://via.placeholder.com/800x400?text=Timeline+Chart+Example)

## Additional Resources

- [Fiscal Year Calendar Documentation](../../README.md)
- [Web Components Documentation](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
