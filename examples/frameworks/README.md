# Fiscal Year Calendar - Framework Integration Examples

This directory contains examples of how to integrate the Fiscal Year Calendar library with popular JavaScript frameworks.

## Available Examples

### React

The `react-example.jsx` file demonstrates how to use the Fiscal Year Calendar library with React. It includes several components:

- `FiscalYearSelector`: A component for selecting fiscal year presets
- `FiscalCalendarTable`: A component for displaying fiscal calendar data
- `FiscalDateInfo`: A component for displaying fiscal information about a date
- `FiscalYearDashboard`: A complete dashboard component

#### Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FiscalYearDashboard } from './FiscalYearComponents';
import './styles.css';

ReactDOM.render(
  <FiscalYearDashboard />,
  document.getElementById('root')
);
```

### Vue.js

The `vue-example.vue` file demonstrates how to use the Fiscal Year Calendar library with Vue.js. It's a single-file component that includes:

- Template with responsive UI
- Script with component logic
- Scoped CSS styles

#### Usage

```javascript
import Vue from 'vue';
import FiscalYearVueApp from './vue-example.vue';

new Vue({
  render: h => h(FiscalYearVueApp)
}).$mount('#app');
```

### Angular

The `angular-example` directory contains files demonstrating how to use the Fiscal Year Calendar library with Angular:

- `fiscal-calendar.component.ts`: Component class
- `fiscal-calendar.component.html`: Component template
- `fiscal-calendar.component.scss`: Component styles
- `fiscal-calendar.module.ts`: Angular module
- `app.component.ts`: Example usage in an Angular application

#### Usage

1. Import the module in your application:

```typescript
import { FiscalCalendarModule } from './path/to/fiscal-calendar.module';

@NgModule({
  imports: [
    // ... other imports
    FiscalCalendarModule
  ],
  // ... other module properties
})
export class AppModule { }
```

2. Use the component in your templates:

```html
<app-fiscal-calendar
  [presetKey]="'us-federal'"
  [fiscalYear]="2025"
  [startOfWeek]="'monday'"
  [locale]="'en'"
  (calendarGenerated)="onCalendarGenerated($event)"
  (exportClicked)="onExportClicked($event)"
></app-fiscal-calendar>
```

## Features Demonstrated

All framework examples demonstrate the following features:

1. **Fiscal Year Presets**: Using predefined fiscal year configurations
2. **Localization**: Changing language and date formats
3. **Export Functionality**: Exporting calendar data to CSV and JSON
4. **Visualization**: Displaying fiscal calendar data in various formats
5. **Interactive UI**: User controls for customizing the fiscal calendar

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The respective framework installed (React, Vue.js, or Angular)

### Installation

1. Install the fiscal-year-calendar library:

```bash
npm install fiscal-year-calendar --save
```

2. Copy the example files to your project.

3. Install any additional dependencies required by the framework.

4. Import and use the components as shown in the examples.

## Customization

These examples are designed to be starting points. You can customize them to fit your specific needs:

- Modify the UI to match your application's design
- Add additional features like holiday support
- Integrate with state management libraries (Redux, Vuex, NgRx)
- Add routing for multi-page applications

## Additional Resources

- [Fiscal Year Calendar Documentation](../../README.md)
- [React Documentation](https://reactjs.org/docs)
- [Vue.js Documentation](https://vuejs.org/guide)
- [Angular Documentation](https://angular.io/docs)
