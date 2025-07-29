import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  getFiscalYearWithPreset,
  getMonthOptions,
  getQuarterOptions,
  getWeekOptions,
  START_OF_WEEK,
  FISCAL_YEAR_PRESETS,
  exportToCSV,
  exportToJSON,
  setLocale,
  getAvailableLocales,
  localizeMonthOptions
} from 'fiscal-year-calendar';

@Component({
  selector: 'app-fiscal-calendar',
  templateUrl: './fiscal-calendar.component.html',
  styleUrls: ['./fiscal-calendar.component.scss']
})
export class FiscalCalendarComponent implements OnInit {
  // Inputs with default values
  @Input() presetKey: string = 'us-federal';
  @Input() fiscalYear: number = new Date().getFullYear();
  @Input() startOfWeek: string = START_OF_WEEK.monday.value;
  @Input() locale: string = 'en';
  
  // Outputs
  @Output() calendarGenerated = new EventEmitter<any>();
  @Output() exportClicked = new EventEmitter<{type: string, data: string}>();
  
  // Component properties
  calendarData: any = null;
  localizedMonths: any[] = [];
  availableLocales: string[] = [];
  fiscalYearPresets = FISCAL_YEAR_PRESETS;
  startOfWeekOptions = START_OF_WEEK;
  
  // UI state
  activeTab: string = 'quarters';
  tabs = [
    { id: 'quarters', name: 'Quarters' },
    { id: 'months', name: 'Months' },
    { id: 'weeks', name: 'Weeks' }
  ];
  
  constructor() { }

  ngOnInit(): void {
    // Get available locales
    this.availableLocales = getAvailableLocales();
    
    // Generate calendar on init
    this.generateCalendar();
  }
  
  // When inputs change, regenerate the calendar
  ngOnChanges(): void {
    this.generateCalendar();
  }
  
  // Generate fiscal calendar data
  generateCalendar(): void {
    // Set locale for localization
    setLocale(this.locale);
    
    // Get fiscal year data using the selected preset
    this.calendarData = getFiscalYearWithPreset(
      this.presetKey,
      null,
      this.fiscalYear,
      this.startOfWeek
    );
    
    // Localize month names
    this.localizedMonths = localizeMonthOptions(this.calendarData.months, this.locale);
    
    // Emit the generated calendar data
    this.calendarGenerated.emit(this.calendarData);
  }
  
  // Format date for display
  formatDate(date: any): string {
    if (!date) return '';
    
    // If it's a moment object, format it
    if (typeof date.format === 'function') {
      return date.format('MMM D, YYYY');
    }
    
    // Otherwise, format as a regular date
    return new Date(date).toLocaleDateString(this.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Calculate days between two dates
  calculateDays(startDate: any, endDate: any): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  
  // Export to CSV
  exportToCSV(): void {
    if (!this.calendarData) return;
    
    // Export months to CSV
    const csv = exportToCSV(this.localizedMonths);
    
    // Emit the CSV data
    this.exportClicked.emit({ type: 'csv', data: csv });
    
    // Create a download link
    this.downloadFile(csv, `fiscal-year-${this.fiscalYear}-${this.presetKey}.csv`, 'text/csv');
  }
  
  // Export to JSON
  exportToJSON(): void {
    if (!this.calendarData) return;
    
    // Export months to JSON
    const json = exportToJSON(this.localizedMonths, { pretty: true });
    
    // Emit the JSON data
    this.exportClicked.emit({ type: 'json', data: json });
    
    // Create a download link
    this.downloadFile(json, `fiscal-year-${this.fiscalYear}-${this.presetKey}.json`, 'application/json');
  }
  
  // Helper method to download a file
  private downloadFile(content: string, fileName: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Set active tab
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
  
  // Check if a tab is active
  isTabActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
