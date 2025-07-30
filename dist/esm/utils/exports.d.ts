/**
 * Options for CSV export
 */
export interface CSVExportOptions {
    headers?: string[];
    fields?: string[];
    delimiter?: string;
    filename?: string;
}
/**
 * Options for JSON export
 */
export interface JSONExportOptions {
    pretty?: boolean;
    filename?: string;
}
/**
 * Options for iCal export
 */
export interface ICalExportOptions {
    calendarName?: string;
    eventNamePrefix?: string;
    eventNameField?: string;
    startTimeField?: string;
    endTimeField?: string;
    description?: string;
    filename?: string;
}
/**
 * Options for HTML export
 */
export interface HTMLExportOptions {
    title?: string;
    tableHeaders?: string[];
    tableFields?: string[];
    cssStyles?: string;
    filename?: string;
}
/**
 * Export data to CSV format
 * @param data - The data to export
 * @param options - CSV export options
 * @returns The CSV string
 */
export declare function exportToCSV(data: any[] | object, options?: CSVExportOptions): string;
/**
 * Export data to JSON format
 * @param data - The data to export
 * @param options - JSON export options
 * @returns The JSON string
 */
export declare function exportToJSON(data: any, options?: JSONExportOptions): string;
/**
 * Export data to iCal format
 * @param data - The data to export
 * @param options - iCal export options
 * @returns The iCal string
 */
export declare function exportToICal(data: any[] | object, options?: ICalExportOptions): string;
/**
 * Export data to HTML format
 * @param data - The data to export
 * @param options - HTML export options
 * @returns The HTML string
 */
export declare function exportToHTML(data: any[] | object, options?: HTMLExportOptions): string;
