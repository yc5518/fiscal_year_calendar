/**
 * Fiscal Period Comparison Tools
 * 
 * This module provides tools for comparing fiscal periods and analyzing
 * financial data across different periods.
 */

import { DateInput, toDateObject } from '../utils/dateUtils';
import { getFiscalYear, getFiscalQuarter, getFiscalMonth } from '../calendar/fiscalYear';
import { FiscalYearPreset } from '../types';

/**
 * Period comparison result
 */
export interface PeriodComparisonResult {
  currentPeriod: {
    label: string;
    startDate: Date;
    endDate: Date;
    values: Record<string, number>;
  };
  previousPeriod: {
    label: string;
    startDate: Date;
    endDate: Date;
    values: Record<string, number>;
  };
  changes: {
    absolute: Record<string, number>;
    percentage: Record<string, number>;
  };
  summary: {
    improved: string[];
    declined: string[];
    unchanged: string[];
  };
}

/**
 * Period comparison options
 */
export interface PeriodComparisonOptions {
  metrics: string[];
  roundDecimals?: number;
  includeZeroValues?: boolean;
  thresholds?: {
    significant: number; // percentage change considered significant
    minimal: number;     // percentage change considered minimal
  };
}

/**
 * Compare two fiscal periods with financial data
 * 
 * @param currentPeriod - Current period data
 * @param previousPeriod - Previous period data
 * @param options - Comparison options
 * @returns Comparison result
 */
export function compareFiscalPeriods(
  currentPeriod: {
    label: string;
    startDate: DateInput;
    endDate: DateInput;
    values: Record<string, number>;
  },
  previousPeriod: {
    label: string;
    startDate: DateInput;
    endDate: DateInput;
    values: Record<string, number>;
  },
  options: PeriodComparisonOptions
): PeriodComparisonResult {
  const { 
    metrics, 
    roundDecimals = 2, 
    includeZeroValues = false,
    thresholds = { significant: 10, minimal: 2 }
  } = options;
  
  // Convert dates to Date objects
  const currentStartDate = toDateObject(currentPeriod.startDate);
  const currentEndDate = toDateObject(currentPeriod.endDate);
  const previousStartDate = toDateObject(previousPeriod.startDate);
  const previousEndDate = toDateObject(previousPeriod.endDate);
  
  // Calculate changes
  const absolute: Record<string, number> = {};
  const percentage: Record<string, number> = {};
  const improved: string[] = [];
  const declined: string[] = [];
  const unchanged: string[] = [];
  
  metrics.forEach(metric => {
    const currentValue = currentPeriod.values[metric] || 0;
    const previousValue = previousPeriod.values[metric] || 0;
    
    // Skip if both values are zero and includeZeroValues is false
    if (currentValue === 0 && previousValue === 0 && !includeZeroValues) {
      return;
    }
    
    // Calculate absolute change
    const absoluteChange = currentValue - previousValue;
    absolute[metric] = Number(absoluteChange.toFixed(roundDecimals));
    
    // Calculate percentage change
    let percentageChange = 0;
    if (previousValue !== 0) {
      percentageChange = (absoluteChange / Math.abs(previousValue)) * 100;
    } else if (currentValue !== 0) {
      percentageChange = currentValue > 0 ? 100 : -100; // Special case when previous is 0
    }
    
    percentage[metric] = Number(percentageChange.toFixed(roundDecimals));
    
    // Categorize the change
    const absPercentChange = Math.abs(percentageChange);
    if (absPercentChange < thresholds.minimal) {
      unchanged.push(metric);
    } else {
      // For revenue, profit, etc. higher is better
      // For expenses, costs, etc. lower is better
      // This is a simplified approach - in a real implementation, you'd want to
      // specify which metrics should be treated as "higher is better" vs "lower is better"
      const isPositiveMetric = !metric.toLowerCase().includes('expense') && 
                              !metric.toLowerCase().includes('cost');
      
      if ((isPositiveMetric && percentageChange > 0) || 
          (!isPositiveMetric && percentageChange < 0)) {
        improved.push(metric);
      } else {
        declined.push(metric);
      }
    }
  });
  
  return {
    currentPeriod: {
      label: currentPeriod.label,
      startDate: currentStartDate,
      endDate: currentEndDate,
      values: currentPeriod.values
    },
    previousPeriod: {
      label: previousPeriod.label,
      startDate: previousStartDate,
      endDate: previousEndDate,
      values: previousPeriod.values
    },
    changes: {
      absolute,
      percentage
    },
    summary: {
      improved,
      declined,
      unchanged
    }
  };
}

/**
 * Get the same period from the previous fiscal year
 * 
 * @param date - Date within the current period
 * @param periodType - Type of period (day, week, month, quarter, year)
 * @param preset - Fiscal year preset
 * @returns Current and previous period information
 */
export function getSamePeriodLastYear(
  date: DateInput,
  periodType: 'day' | 'week' | 'month' | 'quarter' | 'year',
  preset: FiscalYearPreset
): { 
  currentPeriod: { startDate: Date; endDate: Date; label: string; };
  previousPeriod: { startDate: Date; endDate: Date; label: string; };
} {
  const dateObj = toDateObject(date);
  const { fyStartMonth, fyStartDay } = preset;
  
  // Get current fiscal year
  const currentFY = getFiscalYear(dateObj.toISOString(), null, fyStartMonth, fyStartDay);
  const previousFY = currentFY - 1;
  
  // This is a simplified implementation - in a real implementation, you'd want to
  // calculate the exact start and end dates for each period type
  // For now, we'll just use placeholder dates
  
  let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date;
  let currentLabel: string, previousLabel: string;
  
  switch (periodType) {
    case 'year':
      // Fiscal year
      currentStart = new Date(currentFY, fyStartMonth, fyStartDay);
      currentEnd = new Date(currentFY + 1, fyStartMonth, fyStartDay - 1);
      previousStart = new Date(previousFY, fyStartMonth, fyStartDay);
      previousEnd = new Date(previousFY + 1, fyStartMonth, fyStartDay - 1);
      currentLabel = `FY${currentFY}`;
      previousLabel = `FY${previousFY}`;
      break;
      
    case 'quarter':
      // Fiscal quarter
      const currentQ = getFiscalQuarter(dateObj.toISOString(), null, 'monday', fyStartMonth, fyStartDay);
      // Calculate quarter start/end dates (simplified)
      currentStart = new Date(dateObj.getFullYear(), dateObj.getMonth() - ((currentQ - 1) * 3), 1);
      currentEnd = new Date(dateObj.getFullYear(), dateObj.getMonth() - ((currentQ - 1) * 3) + 3, 0);
      // Previous year, same quarter
      previousStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), currentStart.getDate());
      previousEnd = new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth(), currentEnd.getDate());
      currentLabel = `Q${currentQ} FY${currentFY}`;
      previousLabel = `Q${currentQ} FY${previousFY}`;
      break;
      
    case 'month':
      // Fiscal month
      const currentM = getFiscalMonth(dateObj.toISOString(), null, 'monday', fyStartMonth, fyStartDay);
      // Calculate month start/end dates (simplified)
      currentStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
      currentEnd = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
      // Previous year, same month
      previousStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), currentStart.getDate());
      previousEnd = new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth(), currentEnd.getDate());
      currentLabel = `M${currentM} FY${currentFY}`;
      previousLabel = `M${currentM} FY${previousFY}`;
      break;
      
    // Week and day cases would be implemented similarly
    default:
      // Default to current month
      currentStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
      currentEnd = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
      previousStart = new Date(currentStart.getFullYear() - 1, currentStart.getMonth(), currentStart.getDate());
      previousEnd = new Date(currentEnd.getFullYear() - 1, currentEnd.getMonth(), currentEnd.getDate());
      currentLabel = `${currentStart.toLocaleDateString()} - ${currentEnd.toLocaleDateString()}`;
      previousLabel = `${previousStart.toLocaleDateString()} - ${previousEnd.toLocaleDateString()}`;
  }
  
  return {
    currentPeriod: {
      startDate: currentStart,
      endDate: currentEnd,
      label: currentLabel
    },
    previousPeriod: {
      startDate: previousStart,
      endDate: previousEnd,
      label: previousLabel
    }
  };
}

/**
 * Calculate year-over-year change
 * 
 * @param currentValue - Current period value
 * @param previousValue - Previous period value
 * @returns Year-over-year change information
 */
export function calculateYearOverYearChange(
  currentValue: number,
  previousValue: number
): {
  absolute: number;
  percentage: number;
  direction: 'increase' | 'decrease' | 'unchanged';
} {
  const absolute = currentValue - previousValue;
  let percentage = 0;
  
  if (previousValue !== 0) {
    percentage = (absolute / Math.abs(previousValue)) * 100;
  } else if (currentValue !== 0) {
    percentage = currentValue > 0 ? 100 : -100;
  }
  
  let direction: 'increase' | 'decrease' | 'unchanged';
  if (Math.abs(percentage) < 0.1) {
    direction = 'unchanged';
  } else if (percentage > 0) {
    direction = 'increase';
  } else {
    direction = 'decrease';
  }
  
  return {
    absolute: Number(absolute.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    direction
  };
}
