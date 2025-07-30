/**
 * QuickBooks API connector for fiscal-year-calendar
 */

import { 
  FinancialApiConnector, 
  AuthConfig, 
  ApiConnectorOptions, 
  TokenResponse, 
  FinancialDataOptions, 
  FinancialData 
} from './base';
import { getFiscalYearToDate, getFiscalQuarterToDate, getFiscalMonthToDate } from '../calendar/dateRanges';
import { toDateObject } from '../utils/dateUtils';

/**
 * QuickBooks API connector options
 */
export interface QuickBooksOptions extends ApiConnectorOptions {
  environment?: 'sandbox' | 'production';
  minorVersion?: number;
  useJson?: boolean;
}

/**
 * QuickBooks API connector
 */
export class QuickBooksConnector extends FinancialApiConnector {
  private readonly SANDBOX_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';
  private readonly PRODUCTION_BASE_URL = 'https://quickbooks.api.intuit.com';
  private readonly AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
  private readonly TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  
  constructor(authConfig: AuthConfig, options: QuickBooksOptions = {}) {
    const SANDBOX_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';
    const PRODUCTION_BASE_URL = 'https://quickbooks.api.intuit.com';
    
    // Set default options for QuickBooks API
    const quickBooksOptions: QuickBooksOptions = {
      environment: 'sandbox',
      apiVersion: 'v3',
      minorVersion: 65,
      useJson: true,
      ...options
    };
    
    // Set base URL based on environment
    if (!quickBooksOptions.baseUrl) {
      quickBooksOptions.baseUrl = quickBooksOptions.environment === 'sandbox' 
        ? SANDBOX_BASE_URL 
        : PRODUCTION_BASE_URL;
    }
    
    super(authConfig, quickBooksOptions);
  }
  
  /**
   * Get the authorization URL for OAuth flow
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      response_type: 'code',
      scope: (this.authConfig.scope || ['com.intuit.quickbooks.accounting']).join(' '),
      redirect_uri: this.authConfig.redirectUri,
      state: this.authConfig.state || Math.random().toString(36).substring(2, 15)
    });
    
    return `${this.AUTH_URL}?${params.toString()}`;
  }
  
  /**
   * Exchange authorization code for access token
   * @param code Authorization code from OAuth callback
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.authConfig.redirectUri
    });
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${this.authConfig.clientId}:${this.authConfig.clientSecret}`).toString('base64')}`
    };
    
    try {
      const response = await fetch(this.TOKEN_URL, {
        method: 'POST',
        headers,
        body: params.toString()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      const tokenResponse: TokenResponse = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        scope: data.scope
      };
      
      this.setTokenInfo(tokenResponse);
      
      return tokenResponse;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }
  
  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${this.authConfig.clientId}:${this.authConfig.clientSecret}`).toString('base64')}`
    };
    
    try {
      const response = await fetch(this.TOKEN_URL, {
        method: 'POST',
        headers,
        body: params.toString()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      const tokenResponse: TokenResponse = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        scope: data.scope
      };
      
      this.setTokenInfo(tokenResponse);
      
      return tokenResponse;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  /**
   * Get financial data for a specific fiscal period
   * @param options Options for retrieving financial data
   */
  async getFinancialData(options: FinancialDataOptions): Promise<FinancialData> {
    // Ensure we have a valid token
    if (!this.isTokenValid()) {
      await this.refreshAccessToken();
    }
    
    // Determine date range based on options
    let startDate: Date;
    let endDate: Date;
    
    if (options.startDate && options.endDate) {
      // Use provided date range
      startDate = toDateObject(options.startDate);
      endDate = toDateObject(options.endDate);
    } else if (options.fiscalMonth && options.fiscalYear) {
      // Get fiscal month date range
      const dateRange = getFiscalMonthToDate(
        new Date().toISOString(), // Use current date as reference
        null, // Use default timezone
        'monday', // Use Monday as start of week
        undefined, // Use default fiscal year start month
        undefined // Use default fiscal year start day
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    } else if (options.fiscalQuarter && options.fiscalYear) {
      // Get fiscal quarter date range
      const dateRange = getFiscalQuarterToDate(
        new Date().toISOString(), // Use current date as reference
        null, // Use default timezone
        'monday', // Use Monday as start of week
        undefined, // Use default fiscal year start month
        undefined // Use default fiscal year start day
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    } else {
      // Get fiscal year date range
      const dateRange = getFiscalYearToDate(
        new Date().toISOString(), // Use current date as reference
        null, // Use default timezone
        undefined, // Use default fiscal year start month
        undefined // Use default fiscal year start day
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    }
    
    // Format dates for QuickBooks API
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Get profit and loss report
    const plReport = await this.getRawData('reports/ProfitAndLoss', {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      accounting_method: 'Accrual'
    });
    
    // Get balance sheet report if details are requested
    let balanceSheet = null;
    if (options.includeDetails) {
      balanceSheet = await this.getRawData('reports/BalanceSheet', {
        start_date: formattedStartDate,
        end_date: formattedEndDate
      });
    }
    
    // Extract financial data from reports
    const revenue = this.extractTotalFromReport(plReport, 'Income');
    const expenses = this.extractTotalFromReport(plReport, 'Expenses');
    const profit = revenue - expenses;
    
    // Create financial data object
    const financialData: FinancialData = {
      revenue,
      expenses,
      profit,
      period: {
        startDate,
        endDate,
        fiscalYear: options.fiscalYear,
        fiscalQuarter: options.fiscalQuarter,
        fiscalMonth: options.fiscalMonth
      }
    };
    
    // Add balance sheet data if available
    if (balanceSheet && options.includeDetails) {
      financialData.assets = this.extractTotalFromReport(balanceSheet, 'Assets');
      financialData.liabilities = this.extractTotalFromReport(balanceSheet, 'Liabilities');
      financialData.equity = this.extractTotalFromReport(balanceSheet, 'Equity');
      
      // Add detailed breakdown if requested
      financialData.details = {
        incomeBreakdown: this.extractCategoriesFromReport(plReport, 'Income'),
        expenseBreakdown: this.extractCategoriesFromReport(plReport, 'Expenses'),
        assetBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Assets'),
        liabilityBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Liabilities'),
        equityBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Equity')
      };
    }
    
    return financialData;
  }
  
  /**
   * Get raw data from the QuickBooks API
   * @param endpoint API endpoint
   * @param params Query parameters
   */
  async getRawData(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    // Ensure we have a valid token
    if (!this.isTokenValid()) {
      await this.refreshAccessToken();
    }
    
    const options = this.options as QuickBooksOptions;
    const apiVersion = options.apiVersion || 'v3';
    const minorVersion = options.minorVersion || 65;
    
    // Build URL with query parameters
    const queryParams = new URLSearchParams({
      minorversion: minorVersion.toString(),
      ...params
    });
    
    const url = `${options.baseUrl}/${apiVersion}/company/${params.realmId || 'default'}/${endpoint}?${queryParams.toString()}`;
    
    // Set headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': options.useJson ? 'application/json' : 'application/xml'
    };
    
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching data from QuickBooks API:', error);
      throw error;
    }
  }
  
  /**
   * Extract total value from a specific section of a report
   * @param report QuickBooks report data
   * @param section Section name (e.g., 'Income', 'Expenses')
   */
  private extractTotalFromReport(report: any, section: string): number {
    try {
      // This is a simplified implementation
      // In a real implementation, you would need to navigate the actual QuickBooks report structure
      const rows = report.Rows?.Row || [];
      
      for (const row of rows) {
        if (row.Header?.ColData?.[0]?.value === section && row.Summary?.ColData?.[1]?.value) {
          // Remove currency symbol and convert to number
          const valueStr = row.Summary.ColData[1].value.replace(/[^0-9.-]+/g, '');
          return parseFloat(valueStr) || 0;
        }
      }
      
      return 0;
    } catch (error) {
      console.error(`Error extracting ${section} total from report:`, error);
      return 0;
    }
  }
  
  /**
   * Extract category breakdown from a specific section of a report
   * @param report QuickBooks report data
   * @param section Section name (e.g., 'Income', 'Expenses')
   */
  private extractCategoriesFromReport(report: any, section: string): Record<string, number> {
    const categories: Record<string, number> = {};
    
    try {
      // This is a simplified implementation
      // In a real implementation, you would need to navigate the actual QuickBooks report structure
      const rows = report.Rows?.Row || [];
      let inSection = false;
      
      for (const row of rows) {
        // Check if we're entering the section
        if (row.Header?.ColData?.[0]?.value === section) {
          inSection = true;
          continue;
        }
        
        // Check if we're exiting the section
        if (inSection && row.Header && row.Header.ColData?.[0]?.value && row.Header.ColData[0].value !== section) {
          inSection = false;
        }
        
        // Process rows within the section
        if (inSection && row.ColData && row.ColData.length >= 2) {
          const categoryName = row.ColData[0].value;
          const valueStr = row.ColData[1].value.replace(/[^0-9.-]+/g, '');
          const value = parseFloat(valueStr) || 0;
          
          if (categoryName && !categoryName.includes('Total')) {
            categories[categoryName] = value;
          }
        }
      }
      
      return categories;
    } catch (error) {
      console.error(`Error extracting ${section} categories from report:`, error);
      return categories;
    }
  }
}
