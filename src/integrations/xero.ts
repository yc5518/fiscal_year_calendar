/**
 * Xero API connector for fiscal-year-calendar
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
 * Xero API connector options
 */
export interface XeroOptions extends ApiConnectorOptions {
  tenantId?: string;
  apiVersion?: string;
}

/**
 * Xero API connector
 */
export class XeroConnector extends FinancialApiConnector {
  private readonly BASE_URL = 'https://api.xero.com';
  private readonly AUTH_URL = 'https://login.xero.com/identity/connect/authorize';
  private readonly TOKEN_URL = 'https://identity.xero.com/connect/token';
  private tenantId: string | null = null;
  
  constructor(authConfig: AuthConfig, options: XeroOptions = {}) {
    const BASE_URL = 'https://api.xero.com';
    
    const xeroOptions: XeroOptions = {
      apiVersion: '2.0',
      ...options
    };
    
    if (!xeroOptions.baseUrl) {
      xeroOptions.baseUrl = BASE_URL;
    }
    
    super(authConfig, xeroOptions);
    
    if (options.tenantId) {
      this.tenantId = options.tenantId;
    }
  }
  
  /**
   * Get the authorization URL for OAuth flow
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      response_type: 'code',
      scope: (this.authConfig.scope || ['accounting.reports.read', 'accounting.transactions.read']).join(' '),
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
      
      // Get tenant ID if not provided
      if (!this.tenantId) {
        await this.fetchTenantId();
      }
      
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
   * Fetch tenant ID from Xero API
   */
  private async fetchTenantId(): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }
    
    const url = `${this.BASE_URL}/connections`;
    
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }
      
      const connections = await response.json();
      
      if (connections && connections.length > 0) {
        this.tenantId = connections[0].tenantId;
        return this.tenantId;
      }
      
      this.tenantId = null;
      throw new Error('No tenant ID found');
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
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
    
    // Ensure we have a tenant ID
    if (!this.tenantId) {
      await this.fetchTenantId();
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
    
    // Format dates for Xero API
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Get profit and loss report
    const plReport = await this.getRawData('reports/ProfitAndLoss', {
      fromDate: formattedStartDate,
      toDate: formattedEndDate
    });
    
    // Get balance sheet report if details are requested
    let balanceSheet = null;
    if (options.includeDetails) {
      balanceSheet = await this.getRawData('reports/BalanceSheet', {
        date: formattedEndDate
      });
    }
    
    // Extract financial data from reports
    const revenue = this.extractTotalFromReport(plReport, 'Revenue');
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
        incomeBreakdown: this.extractCategoriesFromReport(plReport, 'Revenue'),
        expenseBreakdown: this.extractCategoriesFromReport(plReport, 'Expenses'),
        assetBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Assets'),
        liabilityBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Liabilities'),
        equityBreakdown: this.extractCategoriesFromReport(balanceSheet, 'Equity')
      };
    }
    
    return financialData;
  }
  
  /**
   * Get raw data from the Xero API
   * @param endpoint API endpoint
   * @param params Query parameters
   */
  async getRawData(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    // Ensure we have a valid token
    if (!this.isTokenValid()) {
      await this.refreshAccessToken();
    }
    
    // Ensure we have a tenant ID
    if (!this.tenantId) {
      await this.fetchTenantId();
    }
    
    const options = this.options as XeroOptions;
    const apiVersion = options.apiVersion || '2.0';
    
    // Build URL with query parameters
    const queryParams = new URLSearchParams(params);
    
    const url = `${options.baseUrl}/api/xro/${apiVersion}/${endpoint}?${queryParams.toString()}`;
    
    // Set headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json'
    };
    
    if (this.tenantId) {
      headers['Xero-Tenant-Id'] = this.tenantId;
    }
    
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
      console.error('Error fetching data from Xero API:', error);
      throw error;
    }
  }
  
  /**
   * Extract total value from a specific section of a report
   * @param report Xero report data
   * @param section Section name (e.g., 'Revenue', 'Expenses')
   */
  private extractTotalFromReport(report: any, section: string): number {
    try {
      // This is a simplified implementation
      // In a real implementation, you would need to navigate the actual Xero report structure
      const rows = report.Rows || [];
      
      for (const row of rows) {
        if (row.Title === section && row.Total) {
          return parseFloat(row.Total) || 0;
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
   * @param report Xero report data
   * @param section Section name (e.g., 'Revenue', 'Expenses')
   */
  private extractCategoriesFromReport(report: any, section: string): Record<string, number> {
    const categories: Record<string, number> = {};
    
    try {
      // This is a simplified implementation
      // In a real implementation, you would need to navigate the actual Xero report structure
      const rows = report.Rows || [];
      let sectionRows: any[] = [];
      
      // Find the section
      for (const row of rows) {
        if (row.Title === section && row.Rows) {
          sectionRows = row.Rows;
          break;
        }
      }
      
      // Process rows within the section
      for (const row of sectionRows) {
        if (row.Title && row.Total && !row.Title.includes('Total')) {
          categories[row.Title] = parseFloat(row.Total) || 0;
        }
      }
      
      return categories;
    } catch (error) {
      console.error(`Error extracting ${section} categories from report:`, error);
      return categories;
    }
  }
}
