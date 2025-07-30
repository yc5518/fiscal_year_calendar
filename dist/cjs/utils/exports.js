"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = exportToCSV;
exports.exportToJSON = exportToJSON;
exports.exportToICal = exportToICal;
exports.exportToHTML = exportToHTML;
/**
 * Export utilities for fiscal-year-calendar
 * Provides functions to export calendar data to various formats
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Export data to CSV format
 * @param data - The data to export
 * @param options - CSV export options
 * @returns The CSV string
 */
function exportToCSV(data, options = {}) {
    const { headers = [], fields = [], delimiter = ',', filename } = options;
    // Convert object to array if needed
    const dataArray = Array.isArray(data) ? data : [data];
    // Generate headers if not provided
    const csvHeaders = headers.length > 0
        ? headers
        : (fields.length > 0
            ? fields
            : Object.keys(dataArray[0] || {}));
    // Generate CSV content
    let csvContent = csvHeaders.join(delimiter) + '\n';
    dataArray.forEach(item => {
        const row = fields.length > 0
            ? fields.map(field => item[field] || '')
            : Object.values(item);
        csvContent += row.join(delimiter) + '\n';
    });
    // Write to file if filename is provided
    if (filename) {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filename, csvContent);
    }
    return csvContent;
}
/**
 * Export data to JSON format
 * @param data - The data to export
 * @param options - JSON export options
 * @returns The JSON string
 */
function exportToJSON(data, options = {}) {
    const { pretty = false, filename } = options;
    const jsonContent = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
    // Write to file if filename is provided
    if (filename) {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filename, jsonContent);
    }
    return jsonContent;
}
/**
 * Export data to iCal format
 * @param data - The data to export
 * @param options - iCal export options
 * @returns The iCal string
 */
function exportToICal(data, options = {}) {
    const { calendarName = 'Fiscal Calendar', eventNamePrefix = '', eventNameField = 'name', startTimeField = 'startTime', endTimeField = 'endTime', description = '', filename } = options;
    // Convert object to array if needed
    const dataArray = Array.isArray(data) ? data : [data];
    // Generate iCal content
    let iCalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//fiscal-year-calendar//EN',
        `X-WR-CALNAME:${calendarName}`,
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ].join('\r\n') + '\r\n';
    // Add events
    dataArray.forEach(item => {
        const eventName = `${eventNamePrefix}${item[eventNameField] || ''}`;
        const startTime = new Date(item[startTimeField]);
        const endTime = new Date(item[endTimeField]);
        // Format dates for iCal
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        iCalContent += [
            'BEGIN:VEVENT',
            `UID:${Math.random().toString(36).substring(2)}@fiscal-calendar`,
            `DTSTAMP:${formatDate(new Date())}`,
            `DTSTART:${formatDate(startTime)}`,
            `DTEND:${formatDate(endTime)}`,
            `SUMMARY:${eventName}`,
            `DESCRIPTION:${description}`,
            'END:VEVENT'
        ].join('\r\n') + '\r\n';
    });
    iCalContent += 'END:VCALENDAR';
    // Write to file if filename is provided
    if (filename) {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filename, iCalContent);
    }
    return iCalContent;
}
/**
 * Export data to HTML format
 * @param data - The data to export
 * @param options - HTML export options
 * @returns The HTML string
 */
function exportToHTML(data, options = {}) {
    const { title = 'Fiscal Calendar', tableHeaders = [], tableFields = [], cssStyles = '', filename } = options;
    // Convert object to array if needed
    const dataArray = Array.isArray(data) ? data : [data];
    // Generate headers if not provided
    const headers = tableHeaders.length > 0
        ? tableHeaders
        : (tableFields.length > 0
            ? tableFields
            : Object.keys(dataArray[0] || {}));
    // Generate HTML content
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${cssStyles}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        ${headers.map(header => `<th>${header}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
`;
    // Add rows
    dataArray.forEach(item => {
        htmlContent += '      <tr>\n';
        if (tableFields.length > 0) {
            tableFields.forEach(field => {
                htmlContent += `        <td>${item[field] || ''}</td>\n`;
            });
        }
        else {
            Object.values(item).forEach(value => {
                htmlContent += `        <td>${value || ''}</td>\n`;
            });
        }
        htmlContent += '      </tr>\n';
    });
    htmlContent += `
    </tbody>
  </table>
</body>
</html>
`;
    // Write to file if filename is provided
    if (filename) {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filename, htmlContent);
    }
    return htmlContent;
}
