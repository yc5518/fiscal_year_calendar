/**
 * Fiscal Year Calendar
 * A library to generate fiscal year calendar based on custom fiscal year start date
 * 
 * This is the main entry point that re-exports all functionality from submodules.
 * For better tree-shaking, consider importing directly from submodules:
 * 
 * import { getFiscalYear } from 'fiscal-year-calendar/calendar';
 * import { formatDate } from 'fiscal-year-calendar/utils';
 * import { WeekOption } from 'fiscal-year-calendar/types';
 * import { compareFiscalPeriods } from 'fiscal-year-calendar/reporting';
 * import { applyTheme } from 'fiscal-year-calendar/ui';
 * import { QuickBooksConnector } from 'fiscal-year-calendar/integrations';
 */

// Export types
export * from "./types";

// Export all calendar functionality
export * from "./calendar";

// Export all utilities
export * from "./utils";

// Export reporting functionality with renamed exports to avoid conflicts
import { 
  compareFiscalPeriods as compareFiscalPeriodsAdvanced,
  getSamePeriodLastYear as getSamePeriodLastYearAdvanced,
  calculateYearOverYearChange
} from "./reporting/comparisons";

export {
  compareFiscalPeriodsAdvanced,
  getSamePeriodLastYearAdvanced,
  calculateYearOverYearChange
};

// Export UI functionality
export * from "./ui/theming";

// Export integrations
export * from "./integrations";
