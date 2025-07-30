import React, { useState, useEffect } from 'react';
import {
  getFiscalYear,
  getWeekOptions,
  getMonthOptions,
  getQuarterOptions,
  getFiscalYearWithPreset,
  FISCAL_YEAR_PRESETS,
  START_OF_WEEK
} from 'fiscal-year-calendar';

/**
 * FiscalCalendar component demonstrates how to use fiscal-year-calendar in a React application
 */
const FiscalCalendar = () => {
  // State for fiscal year configuration
  const [config, setConfig] = useState({
    year: new Date().getFullYear(),
    fyStartMonth: 9, // October (0-based)
    fyStartDay: 1,
    preset: '',
    weekStartDay: START_OF_WEEK.monday.value
  });
  
  // State for calendar data
  const [calendarData, setCalendarData] = useState({
    weeks: [],
    months: [],
    quarters: []
  });
  
  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState({
    type: 'month',
    value: '1'
  });
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Effect to update calendar data when config changes
  useEffect(() => {
    const { year, fyStartMonth, fyStartDay, weekStartDay } = config;
    
    // Get calendar data
    const weeks = getWeekOptions(weekStartDay, null, year, fyStartMonth, fyStartDay);
    const months = getMonthOptions(weekStartDay, null, year, fyStartMonth, fyStartDay);
    const quarters = getQuarterOptions(weekStartDay, null, year, fyStartMonth, fyStartDay);
    
    setCalendarData({ weeks, months, quarters });
  }, [config]);
  
  // Handle preset change
  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    
    if (presetKey) {
      const preset = FISCAL_YEAR_PRESETS[presetKey];
      setConfig(prev => ({
        ...prev,
        fyStartMonth: preset.fyStartMonth,
        fyStartDay: preset.fyStartDay,
        preset: presetKey
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        preset: ''
      }));
    }
  };
  
  // Handle fiscal year change
  const handleYearChange = (e) => {
    setConfig(prev => ({
      ...prev,
      year: parseInt(e.target.value)
    }));
  };
  
  // Handle start month change
  const handleStartMonthChange = (e) => {
    setConfig(prev => ({
      ...prev,
      fyStartMonth: parseInt(e.target.value),
      preset: '' // Clear preset when manually changing
    }));
  };
  
  // Handle start day change
  const handleStartDayChange = (e) => {
    setConfig(prev => ({
      ...prev,
      fyStartDay: parseInt(e.target.value),
      preset: '' // Clear preset when manually changing
    }));
  };
  
  // Handle week start day change
  const handleWeekStartDayChange = (e) => {
    setConfig(prev => ({
      ...prev,
      weekStartDay: e.target.value
    }));
  };
  
  // Handle period type change
  const handlePeriodTypeChange = (e) => {
    setSelectedPeriod({
      type: e.target.value,
      value: '1' // Reset to first period
    });
  };
  
  // Handle period value change
  const handlePeriodValueChange = (e) => {
    setSelectedPeriod(prev => ({
      ...prev,
      value: e.target.value
    }));
  };
  
  // Get current period data
  const getCurrentPeriodData = () => {
    const { type, value } = selectedPeriod;
    const { weeks, months, quarters } = calendarData;
    
    switch (type) {
      case 'week':
        return weeks.find(week => week.week === value) || {};
      case 'month':
        return months.find(month => month.month === value) || {};
      case 'quarter':
        return quarters.find(quarter => quarter.quarter === value) || {};
      default:
        return {};
    }
  };
  
  // Get fiscal year for a date
  const getFiscalYearForDate = (date) => {
    const { fyStartMonth, fyStartDay } = config;
    return getFiscalYear(date, null, fyStartMonth, fyStartDay);
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get period options based on type
  const getPeriodOptions = () => {
    const { type } = selectedPeriod;
    const { weeks, months, quarters } = calendarData;
    
    switch (type) {
      case 'week':
        return weeks.map(week => (
          <option key={week.week} value={week.week}>
            Week {week.week}
          </option>
        ));
      case 'month':
        return months.map(month => (
          <option key={month.month} value={month.month}>
            {month.name}
          </option>
        ));
      case 'quarter':
        return quarters.map(quarter => (
          <option key={quarter.quarter} value={quarter.quarter}>
            Quarter {quarter.quarter}
          </option>
        ));
      default:
        return [];
    }
  };
  
  const periodData = getCurrentPeriodData();
  const fiscalYear = getFiscalYearForDate(selectedDate);
  
  return (
    <div className="fiscal-calendar">
      <h1>Fiscal Year Calendar</h1>
      
      <div className="config-panel">
        <h2>Configuration</h2>
        
        <div className="form-group">
          <label>Preset:</label>
          <select value={config.preset} onChange={handlePresetChange}>
            <option value="">Custom</option>
            {Object.keys(FISCAL_YEAR_PRESETS).map(key => (
              <option key={key} value={key}>
                {FISCAL_YEAR_PRESETS[key].name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Fiscal Year:</label>
          <select value={config.year} onChange={handleYearChange}>
            {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Start Month:</label>
          <select value={config.fyStartMonth} onChange={handleStartMonthChange}>
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Start Day:</label>
          <input
            type="number"
            min="1"
            max="31"
            value={config.fyStartDay}
            onChange={handleStartDayChange}
          />
        </div>
        
        <div className="form-group">
          <label>Week Starts On:</label>
          <select value={config.weekStartDay} onChange={handleWeekStartDayChange}>
            <option value={START_OF_WEEK.monday.value}>Monday</option>
            <option value={START_OF_WEEK.sunday.value}>Sunday</option>
            <option value={START_OF_WEEK.saturday.value}>Saturday</option>
          </select>
        </div>
      </div>
      
      <div className="period-selector">
        <h2>Period Selection</h2>
        
        <div className="form-group">
          <label>Period Type:</label>
          <select value={selectedPeriod.type} onChange={handlePeriodTypeChange}>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Period:</label>
          <select value={selectedPeriod.value} onChange={handlePeriodValueChange}>
            {getPeriodOptions()}
          </select>
        </div>
        
        <div className="period-info">
          <h3>Period Information</h3>
          <p><strong>Start Date:</strong> {formatDate(periodData.startTime)}</p>
          <p><strong>End Date:</strong> {formatDate(periodData.endTime)}</p>
        </div>
      </div>
      
      <div className="date-checker">
        <h2>Date Checker</h2>
        
        <div className="form-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
        
        <div className="date-info">
          <p><strong>Fiscal Year:</strong> {fiscalYear}</p>
        </div>
      </div>
      
      <style jsx>{`
        .fiscal-calendar {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          color: #2c3e50;
          text-align: center;
        }
        
        h2 {
          color: #3498db;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        
        .config-panel, .period-selector, .date-checker {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        
        .form-group label {
          width: 120px;
          font-weight: bold;
        }
        
        .form-group select, .form-group input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .period-info, .date-info {
          background-color: #ecf0f1;
          padding: 15px;
          border-radius: 4px;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default FiscalCalendar;
