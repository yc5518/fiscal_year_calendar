<template>
  <div class="fiscal-year-vue-app">
    <h1>Fiscal Year Calendar - Vue.js Example</h1>
    
    <div class="controls">
      <div class="control-group">
        <label for="fiscal-preset">Fiscal Year Preset:</label>
        <select id="fiscal-preset" v-model="selectedPreset">
          <option v-for="(preset, key) in FISCAL_YEAR_PRESETS" :key="key" :value="key">
            {{ preset.name }}
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="fiscal-year">Fiscal Year:</label>
        <input 
          type="number" 
          id="fiscal-year" 
          v-model.number="fiscalYear" 
          min="2000" 
          max="2100"
        />
      </div>
      
      <div class="control-group">
        <label for="start-of-week">Start of Week:</label>
        <select id="start-of-week" v-model="startOfWeek">
          <option :value="START_OF_WEEK.monday.value">Monday</option>
          <option :value="START_OF_WEEK.sunday.value">Sunday</option>
          <option :value="START_OF_WEEK.saturday.value">Saturday</option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="locale">Locale:</label>
        <select id="locale" v-model="locale">
          <option v-for="loc in availableLocales" :key="loc" :value="loc">
            {{ loc }}
          </option>
        </select>
      </div>
      
      <button @click="generateCalendar" class="generate-btn">Generate Calendar</button>
    </div>
    
    <div v-if="calendarData" class="calendar-info">
      <div class="info-panel">
        <h2>{{ calendarData.preset.name }} Fiscal Year {{ calendarData.fiscalYear }}</h2>
        <p>
          <strong>Start Date:</strong> {{ formatDate(calendarData.startDate) }} | 
          <strong>End Date:</strong> {{ formatDate(calendarData.endDate) }}
        </p>
        <div class="export-buttons">
          <button @click="exportToCSV" class="export-btn">Export to CSV</button>
          <button @click="exportToJSON" class="export-btn">Export to JSON</button>
        </div>
      </div>
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
      
      <div class="tab-content">
        <!-- Quarters Tab -->
        <div v-if="activeTab === 'quarters'" class="quarters-tab">
          <h3>Quarters</h3>
          <table>
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration (Days)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quarter in calendarData.quarters" :key="'q-' + quarter.quarter">
                <td>Q{{ quarter.quarter }}</td>
                <td>{{ formatDate(quarter.startTime) }}</td>
                <td>{{ formatDate(quarter.endTime) }}</td>
                <td>{{ calculateDays(quarter.startTime, quarter.endTime) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Months Tab -->
        <div v-if="activeTab === 'months'" class="months-tab">
          <h3>Months</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration (Days)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="month in localizedMonths" :key="'m-' + month.month">
                <td>{{ month.month }}</td>
                <td>{{ month.name }}</td>
                <td>{{ formatDate(month.startTime) }}</td>
                <td>{{ formatDate(month.endTime) }}</td>
                <td>{{ calculateDays(month.startTime, month.endTime) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Weeks Tab -->
        <div v-if="activeTab === 'weeks'" class="weeks-tab">
          <h3>Weeks</h3>
          <div class="weeks-container">
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="week in calendarData.weeks" :key="'w-' + week.week">
                  <td>{{ week.week }}</td>
                  <td>{{ formatDate(week.startTime) }}</td>
                  <td>{{ formatDate(week.endTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Calendar View Tab -->
        <div v-if="activeTab === 'calendar'" class="calendar-tab">
          <h3>Calendar View</h3>
          <div class="calendar-grid">
            <div v-for="(month, index) in localizedMonths" :key="'cal-' + month.month" class="month-calendar">
              <div class="month-header">{{ month.name }}</div>
              <div class="weekdays">
                <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
              </div>
              <div class="days">
                <template v-for="day in renderMonthCalendar(month)">
                  <div 
                    :key="'day-' + month.month + '-' + day.date" 
                    :class="['day', { 
                      'current-month': day.currentMonth,
                      'weekend': day.weekend,
                      'today': day.today
                    }]"
                  >
                    {{ day.date > 0 ? day.date : '' }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!calendarData" class="loading">
      Please generate a calendar using the controls above.
    </div>
  </div>
</template>

<script>
import {
  getFiscalYearWithPreset,
  START_OF_WEEK,
  FISCAL_YEAR_PRESETS,
  exportToCSV,
  exportToJSON,
  setLocale,
  getLocale,
  getAvailableLocales,
  localizeMonthOptions
} from 'fiscal-year-calendar';

export default {
  name: 'FiscalYearVueApp',
  data() {
    return {
      // Constants
      START_OF_WEEK,
      FISCAL_YEAR_PRESETS,
      
      // User selections
      selectedPreset: 'us-federal',
      fiscalYear: new Date().getFullYear(),
      startOfWeek: START_OF_WEEK.monday.value,
      locale: 'en',
      
      // Calendar data
      calendarData: null,
      localizedMonths: [],
      
      // UI state
      activeTab: 'quarters',
      tabs: [
        { id: 'quarters', name: 'Quarters' },
        { id: 'months', name: 'Months' },
        { id: 'weeks', name: 'Weeks' },
        { id: 'calendar', name: 'Calendar View' }
      ],
      
      // Localization
      availableLocales: []
    };
  },
  computed: {
    weekDays() {
      // Get localized week day names based on start of week
      const days = [];
      let firstDay = this.startOfWeek === START_OF_WEEK.monday.value ? 1 :
                    this.startOfWeek === START_OF_WEEK.sunday.value ? 0 : 6;
      
      for (let i = 0; i < 7; i++) {
        const dayIndex = (firstDay + i) % 7;
        const date = new Date(2023, 0, dayIndex + 2); // Jan 2, 2023 is a Monday
        days.push(date.toLocaleDateString(this.locale, { weekday: 'short' }));
      }
      
      return days;
    }
  },
  mounted() {
    // Get available locales
    this.availableLocales = getAvailableLocales();
    
    // Generate calendar on mount
    this.generateCalendar();
  },
  methods: {
    generateCalendar() {
      // Set locale for localization
      setLocale(this.locale);
      
      // Get fiscal year data using the selected preset
      this.calendarData = getFiscalYearWithPreset(
        this.selectedPreset,
        null,
        this.fiscalYear,
        this.startOfWeek
      );
      
      // Localize month names
      this.localizedMonths = localizeMonthOptions(this.calendarData.months, this.locale);
    },
    formatDate(date) {
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
    },
    calculateDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    },
    exportToCSV() {
      if (!this.calendarData) return;
      
      // Export months to CSV
      const csv = exportToCSV(this.localizedMonths);
      
      // Create a download link
      this.downloadFile(csv, `fiscal-year-${this.fiscalYear}-${this.selectedPreset}.csv`, 'text/csv');
    },
    exportToJSON() {
      if (!this.calendarData) return;
      
      // Export months to JSON
      const json = exportToJSON(this.localizedMonths, { pretty: true });
      
      // Create a download link
      this.downloadFile(json, `fiscal-year-${this.fiscalYear}-${this.selectedPreset}.json`, 'application/json');
    },
    downloadFile(content, fileName, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    renderMonthCalendar(month) {
      const days = [];
      const monthStart = new Date(month.startTime);
      const monthEnd = new Date(month.endTime);
      const today = new Date();
      
      // Get the day of week for the first day of the month
      let firstDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday, ...
      
      // Adjust based on start of week
      if (this.startOfWeek === START_OF_WEEK.monday.value) {
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      } else if (this.startOfWeek === START_OF_WEEK.saturday.value) {
        firstDayOfWeek = (firstDayOfWeek + 1) % 7;
      }
      
      // Add empty days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({
          date: 0,
          currentMonth: false,
          weekend: false,
          today: false
        });
      }
      
      // Add days of the month
      for (let date = 1; date <= monthEnd.getDate(); date++) {
        const dayDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), date);
        const dayOfWeek = dayDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = dayDate.getDate() === today.getDate() &&
                        dayDate.getMonth() === today.getMonth() &&
                        dayDate.getFullYear() === today.getFullYear();
        
        days.push({
          date,
          currentMonth: true,
          weekend: isWeekend,
          today: isToday
        });
      }
      
      return days;
    }
  }
};
</script>

<style scoped>
.fiscal-year-vue-app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

h1, h2, h3 {
  color: #2c3e50;
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

.control-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

select, input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #2980b9;
}

.generate-btn {
  align-self: flex-end;
  margin-top: 20px;
}

.calendar-info {
  margin-top: 20px;
}

.info-panel {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.export-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  padding: 10px 20px;
  background-color: transparent;
  color: #333;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab-btn.active {
  border-bottom: 2px solid #3498db;
  color: #3498db;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.weeks-container {
  max-height: 400px;
  overflow-y: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.month-calendar {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.month-header {
  background-color: #3498db;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f2f2f2;
  border-bottom: 1px solid #ddd;
}

.weekday {
  padding: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
}

.day.current-month {
  background-color: #e3f2fd;
}

.day.weekend {
  background-color: #f5f5f5;
}

.day.today {
  background-color: #bbdefb;
  font-weight: bold;
  border: 2px solid #2196f3;
}

.loading {
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>
