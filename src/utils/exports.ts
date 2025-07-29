/**
 * Export functionality for fiscal-year-calendar
 */
import moment from 'moment';
import { WeekOption, QuarterOption, MonthOption, PeriodOption, BiWeeklyOption, SemiMonthlyOption } from '../types';

/**
 * Converts a date string to the specified format
 * @param dateString - The date string to format
 * @param format - The format to convert to (default: 'YYYY-MM-DD')
 * @returns The formatted date string
 */
function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
    return moment(new Date(dateString)).format(format);
}

/**
 * Exports fiscal calendar data to CSV format
 * @param data - The data to export (weeks, quarters, months, etc.)
 * @param options - Export options
 * @returns CSV string
 */
export function exportToCSV<T extends WeekOption | QuarterOption | MonthOption | PeriodOption | BiWeeklyOption | SemiMonthlyOption>(
    data: T[],
    options: {
        dateFormat?: string;
        includeHeaders?: boolean;
        delimiter?: string;
    } = {}
): string {
    const {
        dateFormat = 'YYYY-MM-DD',
        includeHeaders = true,
        delimiter = ','
    } = options;

    // Determine the type of data and set appropriate headers
    let headers: string[] = [];
    if (data.length > 0) {
        const firstItem = data[0];
        
        // Common properties for all types
        headers.push('startDate', 'endDate');
        
        // Type-specific properties
        if ('week' in firstItem) {
            headers.unshift('week');
        } else if ('quarter' in firstItem) {
            headers.unshift('quarter');
        } else if ('month' in firstItem) {
            headers.unshift('month');
            headers.splice(1, 0, 'name');
        } else if ('period' in firstItem) {
            headers.unshift('period');
            if ('weeks' in firstItem) {
                headers.push('weeks');
            }
        }
    }

    // Generate CSV content
    let csv = '';
    
    // Add headers if requested
    if (includeHeaders && headers.length > 0) {
        csv += headers.join(delimiter) + '\n';
    }
    
    // Add data rows
    data.forEach(item => {
        const row: string[] = [];
        
        // Add appropriate fields based on the type
        if ('week' in item) {
            row.push(item.week);
        } else if ('quarter' in item) {
            row.push(item.quarter);
        } else if ('month' in item) {
            row.push(item.month);
            row.push((item as MonthOption).name);
        } else if ('period' in item) {
            row.push(item.period);
        }
        
        // Add common fields
        row.push(formatDate(item.startTime, dateFormat));
        row.push(formatDate(item.endTime, dateFormat));
        
        // Add weeks if available
        if ('weeks' in item) {
            row.push(String((item as PeriodOption).weeks));
        }
        
        csv += row.join(delimiter) + '\n';
    });
    
    return csv;
}

/**
 * Exports fiscal calendar data to JSON format
 * @param data - The data to export (weeks, quarters, months, etc.)
 * @param options - Export options
 * @returns JSON string
 */
export function exportToJSON<T extends WeekOption | QuarterOption | MonthOption | PeriodOption | BiWeeklyOption | SemiMonthlyOption>(
    data: T[],
    options: {
        dateFormat?: string;
        pretty?: boolean;
    } = {}
): string {
    const {
        dateFormat = 'YYYY-MM-DD',
        pretty = false
    } = options;
    
    // Format dates in the data
    const formattedData = data.map(item => {
        const result: Record<string, any> = { ...item };
        result.startDate = formatDate(item.startTime, dateFormat);
        result.endDate = formatDate(item.endTime, dateFormat);
        
        // Keep original date strings if needed
        if (dateFormat !== 'original') {
            delete result.startTime;
            delete result.endTime;
        }
        
        return result;
    });
    
    // Convert to JSON string
    return JSON.stringify(formattedData, null, pretty ? 2 : 0);
}

/**
 * Exports fiscal calendar data to iCalendar format
 * @param data - The data to export (weeks, quarters, months, etc.)
 * @param options - Export options
 * @returns iCalendar string
 */
export function exportToICal<T extends WeekOption | QuarterOption | MonthOption | PeriodOption | BiWeeklyOption | SemiMonthlyOption>(
    data: T[],
    options: {
        calendarName?: string;
        eventPrefix?: string;
    } = {}
): string {
    const {
        calendarName = 'Fiscal Calendar',
        eventPrefix = 'Fiscal'
    } = options;
    
    // Start iCalendar file
    let ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//fiscal-year-calendar//EN',
        `X-WR-CALNAME:${calendarName}`,
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ].join('\r\n') + '\r\n';
    
    // Add events for each period
    data.forEach(item => {
        // Determine event type and summary
        let eventType: string;
        let summary: string;
        
        if ('week' in item) {
            eventType = 'Week';
            summary = `${eventPrefix} Week ${item.week}`;
        } else if ('quarter' in item) {
            eventType = 'Quarter';
            summary = `${eventPrefix} Quarter ${item.quarter}`;
        } else if ('month' in item) {
            eventType = 'Month';
            summary = `${eventPrefix} Month ${item.month} (${(item as MonthOption).name})`;
        } else if ('period' in item) {
            eventType = 'Period';
            summary = `${eventPrefix} Period ${item.period}`;
            if ('weeks' in item) {
                summary += ` (${(item as PeriodOption).weeks} weeks)`;
            }
        } else {
            eventType = 'Period';
            summary = `${eventPrefix} Period`;
        }
        
        // Format dates for iCal (remove dashes, colons, etc.)
        const startDate = moment(new Date(item.startTime)).format('YYYYMMDD');
        
        // End date needs to be the day after the end date because iCal uses exclusive end dates
        const endDate = moment(new Date(item.endTime)).add(1, 'day').format('YYYYMMDD');
        
        // Create event
        ical += [
            'BEGIN:VEVENT',
            `SUMMARY:${summary}`,
            `DTSTART;VALUE=DATE:${startDate}`,
            `DTEND;VALUE=DATE:${endDate}`,
            `DESCRIPTION:${eventPrefix} ${eventType} from ${formatDate(item.startTime)} to ${formatDate(item.endTime)}`,
            `UID:${startDate}-${endDate}-${eventType.toLowerCase()}-${Math.random().toString(36).substring(2, 11)}`,
            'SEQUENCE:0',
            'STATUS:CONFIRMED',
            'TRANSP:TRANSPARENT',
            'END:VEVENT'
        ].join('\r\n') + '\r\n';
    });
    
    // End iCalendar file
    ical += 'END:VCALENDAR\r\n';
    
    return ical;
}

/**
 * Exports fiscal calendar data to HTML format
 * @param data - The data to export (weeks, quarters, months, etc.)
 * @param options - Export options
 * @returns HTML string
 */
export function exportToHTML<T extends WeekOption | QuarterOption | MonthOption | PeriodOption | BiWeeklyOption | SemiMonthlyOption>(
    data: T[],
    options: {
        title?: string;
        dateFormat?: string;
        includeStyles?: boolean;
    } = {}
): string {
    const {
        title = 'Fiscal Calendar',
        dateFormat = 'YYYY-MM-DD',
        includeStyles = true
    } = options;
    
    // Determine the type of data and set appropriate headers
    let headers: string[] = [];
    let dataType = '';
    
    if (data.length > 0) {
        const firstItem = data[0];
        
        // Common properties for all types
        headers.push('Start Date', 'End Date');
        
        // Type-specific properties
        if ('week' in firstItem) {
            headers.unshift('Week');
            dataType = 'Weeks';
        } else if ('quarter' in firstItem) {
            headers.unshift('Quarter');
            dataType = 'Quarters';
        } else if ('month' in firstItem) {
            headers.unshift('Month');
            headers.splice(1, 0, 'Name');
            dataType = 'Months';
        } else if ('period' in firstItem) {
            headers.unshift('Period');
            dataType = 'Periods';
            if ('weeks' in firstItem) {
                headers.push('Weeks');
            }
        }
    }
    
    // Generate HTML content
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${includeStyles ? `<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f1f1; }
    </style>` : ''}
</head>
<body>
    <h1>${title}</h1>
    <p>Fiscal Calendar ${dataType}</p>
    <table>
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;
    
    // Add data rows
    data.forEach(item => {
        html += '<tr>';
        
        // Add appropriate fields based on the type
        if ('week' in item) {
            html += `<td>${item.week}</td>`;
        } else if ('quarter' in item) {
            html += `<td>${item.quarter}</td>`;
        } else if ('month' in item) {
            html += `<td>${item.month}</td>`;
            html += `<td>${(item as MonthOption).name}</td>`;
        } else if ('period' in item) {
            html += `<td>${item.period}</td>`;
        }
        
        // Add common fields
        html += `<td>${formatDate(item.startTime, dateFormat)}</td>`;
        html += `<td>${formatDate(item.endTime, dateFormat)}</td>`;
        
        // Add weeks if available
        if ('weeks' in item && 'period' in item) {
            html += `<td>${(item as PeriodOption).weeks}</td>`;
        }
        
        html += '</tr>';
    });
    
    html += `
        </tbody>
    </table>
</body>
</html>`;
    
    return html;
}
