import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalCalendarComponent } from './fiscal-calendar.component';

/**
 * Fiscal Calendar Module
 * 
 * This module provides components for displaying and interacting with fiscal year calendars.
 * Import this module in your application to use the fiscal calendar components.
 * 
 * Example:
 * ```typescript
 * import { FiscalCalendarModule } from './fiscal-calendar/fiscal-calendar.module';
 * 
 * @NgModule({
 *   imports: [
 *     // ... other imports
 *     FiscalCalendarModule
 *   ],
 *   // ... other module properties
 * })
 * export class AppModule { }
 * ```
 */
@NgModule({
  declarations: [
    FiscalCalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FiscalCalendarComponent
  ]
})
export class FiscalCalendarModule { }

/**
 * Example App Module
 * 
 * This is an example of how to import and use the FiscalCalendarModule in your application.
 */
@NgModule({
  declarations: [
    // Your app components
  ],
  imports: [
    CommonModule,
    FormsModule,
    FiscalCalendarModule
  ],
  bootstrap: [
    // Your root component
  ]
})
export class ExampleAppModule { }

/**
 * Usage Instructions:
 * 
 * 1. Install the fiscal-year-calendar package:
 *    npm install fiscal-year-calendar --save
 * 
 * 2. Import the FiscalCalendarModule in your application module:
 *    import { FiscalCalendarModule } from './path/to/fiscal-calendar.module';
 * 
 * 3. Add it to your module imports:
 *    @NgModule({
 *      imports: [FiscalCalendarModule]
 *    })
 * 
 * 4. Use the component in your templates:
 *    <app-fiscal-calendar
 *      [presetKey]="'us-federal'"
 *      [fiscalYear]="2025"
 *      [startOfWeek]="'monday'"
 *      [locale]="'en'"
 *      (calendarGenerated)="onCalendarGenerated($event)"
 *      (exportClicked)="onExportClicked($event)"
 *    ></app-fiscal-calendar>
 * 
 * 5. Handle events in your component:
 *    onCalendarGenerated(calendarData: any): void {
 *      console.log('Calendar generated:', calendarData);
 *    }
 *    
 *    onExportClicked(exportData: {type: string, data: string}): void {
 *      console.log(`Calendar exported to ${exportData.type}:`, exportData.data);
 *    }
 */
