import React, { useState, useEffect } from 'react';
import {
  getFiscalYearWithPreset,
  getMonthOptions,
  getQuarterOptions,
  getWeekOptions,
  START_OF_WEEK,
  FISCAL_YEAR_PRESETS,
  exportToCSV,
  setLocale,
  localizeMonthOptions
} from 'fiscal-year-calendar';

/**
 * FiscalYearSelector - A React component for selecting fiscal year presets
 */
export const FiscalYearSelector = ({ onChange, defaultPreset = 'us-federal' }) => {
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
  
  const handleChange = (e) => {
    const preset = e.target.value;
    setSelectedPreset(preset);
    if (onChange) {
      onChange(preset);
    }
  };
  
  return (
    <div className="fiscal-year-selector">
      <label htmlFor="fiscal-preset">Fiscal Year Preset:</label>
      <select 
        id="fiscal-preset" 
        value={selectedPreset} 
        onChange={handleChange}
      >
        {Object.keys(FISCAL_YEAR_PRESETS).map(key => (
          <option key={key} value={key}>
            {FISCAL_YEAR_PRESETS[key].name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * FiscalCalendarTable - A React component for displaying fiscal calendar data
 */
export const FiscalCalendarTable = ({ 
  presetKey = 'us-federal',
  year = new Date().getFullYear(),
  startOfWeek = START_OF_WEEK.monday.value,
  showQuarters = true,
  showMonths = true,
  showWeeks = false,
  locale = 'en'
}) => {
  const [calendarData, setCalendarData] = useState(null);
  
  useEffect(() => {
    // Set locale for localization
    setLocale(locale);
    
    // Get fiscal year data using the selected preset
    const fyData = getFiscalYearWithPreset(presetKey, null, year, startOfWeek);
    
    // Localize month names if needed
    if (locale !== 'en') {
      fyData.months = localizeMonthOptions(fyData.months, locale);
    }
    
    setCalendarData(fyData);
  }, [presetKey, year, startOfWeek, locale]);
  
  const handleExportCSV = () => {
    if (!calendarData) return;
    
    // Export months to CSV
    const csv = exportToCSV(calendarData.months);
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiscal-year-${year}-${presetKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (!calendarData) {
    return <div>Loading calendar data...</div>;
  }
  
  return (
    <div className="fiscal-calendar">
      <div className="fiscal-calendar-header">
        <h2>
          {calendarData.preset.name} Fiscal Year {calendarData.fiscalYear}
        </h2>
        <p>
          <strong>Start Date:</strong> {calendarData.startDate.format('MMMM D, YYYY')} | 
          <strong>End Date:</strong> {calendarData.endDate.format('MMMM D, YYYY')}
        </p>
        <button onClick={handleExportCSV}>Export to CSV</button>
      </div>
      
      {showQuarters && (
        <div className="fiscal-quarters">
          <h3>Quarters</h3>
          <table>
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.quarters.map((quarter) => (
                <tr key={`quarter-${quarter.quarter}`}>
                  <td>Q{quarter.quarter}</td>
                  <td>{new Date(quarter.startTime).toLocaleDateString()}</td>
                  <td>{new Date(quarter.endTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showMonths && (
        <div className="fiscal-months">
          <h3>Months</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.months.map((month) => (
                <tr key={`month-${month.month}`}>
                  <td>{month.month}</td>
                  <td>{month.name}</td>
                  <td>{new Date(month.startTime).toLocaleDateString()}</td>
                  <td>{new Date(month.endTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showWeeks && (
        <div className="fiscal-weeks">
          <h3>Weeks</h3>
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.weeks.map((week) => (
                <tr key={`week-${week.week}`}>
                  <td>{week.week}</td>
                  <td>{new Date(week.startTime).toLocaleDateString()}</td>
                  <td>{new Date(week.endTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/**
 * FiscalDateInfo - A React component for displaying fiscal information about a date
 */
export const FiscalDateInfo = ({ 
  date = new Date(),
  presetKey = 'us-federal'
}) => {
  const [fiscalInfo, setFiscalInfo] = useState(null);
  
  useEffect(() => {
    // Get the preset configuration
    const preset = FISCAL_YEAR_PRESETS[presetKey];
    
    if (!preset) {
      console.error(`Preset ${presetKey} not found`);
      return;
    }
    
    // Get fiscal year data using the selected preset
    const fyData = getFiscalYearWithPreset(presetKey, null, null);
    
    // Find which quarter the date falls in
    const quarter = fyData.quarters.find(q => 
      new Date(date) >= new Date(q.startTime) && 
      new Date(date) <= new Date(q.endTime)
    );
    
    // Find which month the date falls in
    const month = fyData.months.find(m => 
      new Date(date) >= new Date(m.startTime) && 
      new Date(date) <= new Date(m.endTime)
    );
    
    // Find which week the date falls in
    const week = fyData.weeks.find(w => 
      new Date(date) >= new Date(w.startTime) && 
      new Date(date) <= new Date(w.endTime)
    );
    
    setFiscalInfo({
      fiscalYear: fyData.fiscalYear,
      quarter: quarter ? quarter.quarter : 'N/A',
      month: month ? month.month : 'N/A',
      monthName: month ? month.name : 'N/A',
      week: week ? week.week : 'N/A'
    });
  }, [date, presetKey]);
  
  if (!fiscalInfo) {
    return <div>Loading fiscal information...</div>;
  }
  
  return (
    <div className="fiscal-date-info">
      <h3>Fiscal Information for {date.toLocaleDateString()}</h3>
      <table>
        <tbody>
          <tr>
            <th>Fiscal Year:</th>
            <td>{fiscalInfo.fiscalYear}</td>
          </tr>
          <tr>
            <th>Fiscal Quarter:</th>
            <td>Q{fiscalInfo.quarter}</td>
          </tr>
          <tr>
            <th>Fiscal Month:</th>
            <td>{fiscalInfo.month} ({fiscalInfo.monthName})</td>
          </tr>
          <tr>
            <th>Fiscal Week:</th>
            <td>{fiscalInfo.week}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/**
 * FiscalYearDashboard - A complete React dashboard component
 */
export const FiscalYearDashboard = () => {
  const [presetKey, setPresetKey] = useState('us-federal');
  const [year, setYear] = useState(new Date().getFullYear());
  const [locale, setLocale] = useState('en');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handlePresetChange = (preset) => {
    setPresetKey(preset);
  };
  
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };
  
  const handleLocaleChange = (e) => {
    setLocale(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };
  
  return (
    <div className="fiscal-year-dashboard">
      <h1>Fiscal Year Dashboard</h1>
      
      <div className="controls">
        <FiscalYearSelector 
          onChange={handlePresetChange} 
          defaultPreset={presetKey} 
        />
        
        <div className="year-selector">
          <label htmlFor="fiscal-year">Fiscal Year:</label>
          <input 
            type="number" 
            id="fiscal-year" 
            value={year} 
            onChange={handleYearChange} 
            min="2000" 
            max="2100" 
          />
        </div>
        
        <div className="locale-selector">
          <label htmlFor="locale">Locale:</label>
          <select id="locale" value={locale} onChange={handleLocaleChange}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        
        <div className="date-selector">
          <label htmlFor="selected-date">Selected Date:</label>
          <input 
            type="date" 
            id="selected-date" 
            value={selectedDate.toISOString().split('T')[0]} 
            onChange={handleDateChange} 
          />
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="calendar-section">
          <FiscalCalendarTable 
            presetKey={presetKey} 
            year={year} 
            showQuarters={true}
            showMonths={true}
            showWeeks={false}
            locale={locale}
          />
        </div>
        
        <div className="date-info-section">
          <FiscalDateInfo 
            date={selectedDate} 
            presetKey={presetKey} 
          />
        </div>
      </div>
    </div>
  );
};

// Example usage in a React application:
/*
import React from 'react';
import ReactDOM from 'react-dom';
import { FiscalYearDashboard } from './FiscalYearComponents';
import './styles.css';

ReactDOM.render(
  <FiscalYearDashboard />,
  document.getElementById('root')
);
*/
