import { Component } from '@angular/core';
import { START_OF_WEEK, FISCAL_YEAR_PRESETS, getAvailableLocales } from 'fiscal-year-calendar';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Fiscal Year Calendar - Angular Example</h1>
      
      <div class="controls">
        <div class="form-group">
          <label for="preset">Fiscal Year Preset:</label>
          <select id="preset" class="form-control" [(ngModel)]="selectedPreset">
            <option *ngFor="let preset of presetKeys" [value]="preset">
              {{ fiscalYearPresets[preset].name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="fiscal-year">Fiscal Year:</label>
          <input 
            type="number" 
            id="fiscal-year" 
            class="form-control" 
            [(ngModel)]="fiscalYear" 
            min="2000" 
            max="2100"
          />
        </div>
        
        <div class="form-group">
          <label for="start-of-week">Start of Week:</label>
          <select id="start-of-week" class="form-control" [(ngModel)]="startOfWeek">
            <option [value]="startOfWeekOptions.monday.value">Monday</option>
            <option [value]="startOfWeekOptions.sunday.value">Sunday</option>
            <option [value]="startOfWeekOptions.saturday.value">Saturday</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="locale">Locale:</label>
          <select id="locale" class="form-control" [(ngModel)]="locale">
            <option *ngFor="let loc of availableLocales" [value]="loc">
              {{ loc }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Use the fiscal calendar component -->
      <app-fiscal-calendar
        [presetKey]="selectedPreset"
        [fiscalYear]="fiscalYear"
        [startOfWeek]="startOfWeek"
        [locale]="locale"
        (calendarGenerated)="onCalendarGenerated($event)"
        (exportClicked)="onExportClicked($event)"
      ></app-fiscal-calendar>
      
      <!-- Display export notification -->
      <div *ngIf="exportNotification" class="alert alert-success alert-dismissible fade show mt-3">
        {{ exportNotification }}
        <button type="button" class="close" (click)="exportNotification = ''">
          <span>&times;</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-group {
      flex: 1;
      min-width: 200px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-control {
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .alert {
      position: relative;
      padding: 0.75rem 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
    }
    
    .alert-success {
      color: #155724;
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    
    .alert-dismissible .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.75rem 1.25rem;
      color: inherit;
      background: transparent;
      border: 0;
      cursor: pointer;
    }
  `]
})
export class AppComponent {
  // Component properties
  selectedPreset: string = 'us-federal';
  fiscalYear: number = new Date().getFullYear();
  startOfWeek: string = START_OF_WEEK.monday.value;
  locale: string = 'en';
  exportNotification: string = '';
  
  // Constants
  fiscalYearPresets = FISCAL_YEAR_PRESETS;
  startOfWeekOptions = START_OF_WEEK;
  availableLocales: string[] = [];
  presetKeys: string[] = [];
  
  constructor() {
    // Get available locales
    this.availableLocales = getAvailableLocales();
    
    // Get preset keys
    this.presetKeys = Object.keys(FISCAL_YEAR_PRESETS);
  }
  
  // Event handlers
  onCalendarGenerated(calendarData: any): void {
    console.log('Calendar generated:', calendarData);
  }
  
  onExportClicked(exportData: {type: string, data: string}): void {
    this.exportNotification = `Calendar data exported to ${exportData.type.toUpperCase()} format successfully!`;
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      this.exportNotification = '';
    }, 3000);
  }
}
