/**
 * Generic adapter for custom accounting systems
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
 * Data source function type
 */
export type DataSourceFunction = (
  endpoint: string, 
  params: Record<string, any>, 
  headers: Record<string, string>
) => Promise<any>;

/**
 * Data transformer function type
 */
export type DataTransformerFunction = (
  data: any, 
  options: FinancialDataOptions
) => FinancialData;

/**
 * Auth provider function type
 */
export type AuthProviderFunction = (
  code: string, 
  authConfig: AuthConfig
) => Promise<TokenResponse>;

/**
 * Generic adapter options
 */
export interface GenericAdapterOptions extends ApiConnectorOptions {
  dataSource: DataSourceFunction;
  dataTransformer: DataTransformerFunction;
  authProvider?: AuthProviderFunction;
  authUrl?: string;
  endpoints?: {
    profitAndLoss?: string;
    balanceSheet?: string;
    cashFlow?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Generic adapter for custom accounting systems
 */
export class GenericAccountingAdapter extends FinancialApiConnector {
  private dataSource: DataSourceFunction;
  private dataTransformer: DataTransformerFunction;
  private authProvider?: AuthProviderFunction;
  private authUrl?: string;
  private endpoints: Record<string, string> = {};
  
  constructor(authConfig: AuthConfig, options: GenericAdapterOptions) {
    // Validate required options
    if (!options.dataSource) {
      throw new Error('dataSource is required for GenericAccountingAdapter');
    }
    
    if (!options.dataTransformer) {
      throw new Error('dataTransformer is required for GenericAccountingAdapter');
    }
    
    super(authConfig, options);
    
    this.dataSource = options.dataSource;
    this.dataTransformer = options.dataTransformer;
    this.authProvider = options.authProvider;
    this.authUrl = options.authUrl;
    
    // Set default endpoints
    const defaultEndpoints = {
      profitAndLoss: 'reports/profit-and-loss',
      balanceSheet: 'reports/balance-sheet',
      cashFlow: 'reports/cash-flow'
    };
    
    // Merge with provided endpoints, filtering out undefined values
    if (options.endpoints) {
      for (const [key, value] of Object.entries(options.endpoints)) {
        if (value !== undefined) {
          this.endpoints[key] = value;
        }
      }
    } else {
      // Use defaults if no endpoints provided
      Object.assign(this.endpoints, defaultEndpoints);
    }
  }
  
  /**
   * Get the authorization URL for OAuth flow
   */
  getAuthorizationUrl(): string {
    if (!this.authUrl) {
      throw new Error('authUrl is required for OAuth flow');
    }
    
    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      response_type: 'code',
      scope: (this.authConfig.scope || []).join(' '),
      redirect_uri: this.authConfig.redirectUri,
      state: this.authConfig.state || Math.random().toString(36).substring(2, 15)
    });
    
    return `${this.authUrl}?${params.toString()}`;
  }
  
  /**
   * Exchange authorization code for access token
   * @param code Authorization code from OAuth callback
   */
  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    if (!this.authProvider) {
      throw new Error('authProvider is required for OAuth flow');
    }
    
    try {
      const tokenResponse = await this.authProvider(code, this.authConfig);
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
    if (!this.authProvider) {
      throw new Error('authProvider is required for OAuth flow');
    }
    
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      // Pass the refresh token as the code for the auth provider
      const tokenResponse = await this.authProvider(this.refreshToken, {
        ...this.authConfig,
        // Add a flag to indicate this is a refresh token request
        state: 'refresh_token'
      });
      
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
    // Ensure we have a valid token if auth is required
    if (this.authProvider && !this.isTokenValid()) {
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
        new Date().toISOString(),
        null,
        'monday',
        undefined,
        undefined
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    } else if (options.fiscalQuarter && options.fiscalYear) {
      // Get fiscal quarter date range
      const dateRange = getFiscalQuarterToDate(
        new Date().toISOString(),
        null,
        'monday',
        undefined,
        undefined
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    } else {
      // Get fiscal year date range
      const dateRange = getFiscalYearToDate(
        new Date().toISOString(),
        null,
        undefined,
        undefined
      );
      startDate = dateRange.startDate.toDate();
      endDate = dateRange.endDate.toDate();
    }
    
    // Format dates
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Get profit and loss report
    const plEndpoint = this.endpoints.profitAndLoss || 'reports/profit-and-loss';
    const plReport = await this.getRawData(plEndpoint, {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
    
    // Get balance sheet report if details are requested
    let balanceSheet = null;
    if (options.includeDetails) {
      const bsEndpoint = this.endpoints.balanceSheet || 'reports/balance-sheet';
      balanceSheet = await this.getRawData(bsEndpoint, {
        date: formattedEndDate
      });
    }
    
    // Get cash flow report if details are requested
    let cashFlow = null;
    if (options.includeDetails) {
      const cfEndpoint = this.endpoints.cashFlow || 'reports/cash-flow';
      cashFlow = await this.getRawData(cfEndpoint, {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
    }
    
    // Use the data transformer to convert raw data to FinancialData
    const financialData = this.dataTransformer({
      profitAndLoss: plReport,
      balanceSheet,
      cashFlow
    }, {
      ...options,
      startDate,
      endDate
    });
    
    return financialData;
  }
  
  /**
   * Get raw data from the API
   * @param endpoint API endpoint
   * @param params Query parameters
   */
  async getRawData(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    // Ensure we have a valid token if auth is required
    if (this.authProvider && !this.isTokenValid()) {
      await this.refreshAccessToken();
    }
    
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Add authorization header if we have an access token
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    // Add custom headers from options
    if (this.options.headers) {
      Object.assign(headers, this.options.headers);
    }
    
    try {
      // Use the provided data source function to fetch data
      return await this.dataSource(endpoint, params, headers);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

/**
 * Create a simple data source function for REST APIs
 * @param baseUrl Base URL for the API
 * @param options Additional options
 */
export function createRestDataSource(
  baseUrl: string,
  options: {
    timeout?: number;
    apiVersion?: string;
    contentType?: string;
  } = {}
): DataSourceFunction {
  return async (endpoint: string, params: Record<string, any>, headers: Record<string, string>) => {
    const apiVersion = options.apiVersion ? `/${options.apiVersion}` : '';
    const url = `${baseUrl}${apiVersion}/${endpoint}`;
    
    // Add query parameters
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, String(value));
    }
    
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    // Add content type header if not present
    if (options.contentType && !headers['Content-Type']) {
      headers['Content-Type'] = options.contentType;
    }
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
    
    try {
      const response = await fetch(fullUrl, {
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
      console.error('Error fetching data from API:', error);
      throw error;
    }
  };
}

/**
 * Create a simple data transformer function
 * @param mappings Field mappings for different report types
 */
export function createSimpleDataTransformer(
  mappings: {
    revenue?: string | string[];
    expenses?: string | string[];
    assets?: string | string[];
    liabilities?: string | string[];
    equity?: string | string[];
    cashFlow?: string | string[];
  } = {}
): DataTransformerFunction {
  return (data: any, options: FinancialDataOptions): FinancialData => {
    // Extract values using provided mappings
    const extractValue = (obj: any, path: string | string[]): number => {
      if (Array.isArray(path)) {
        // Try each path in order until one works
        for (const p of path) {
          try {
            const value = extractValue(obj, p);
            if (!isNaN(value)) {
              return value;
            }
          } catch (e) {
            // Continue to next path
          }
        }
        return 0;
      }
      
      // Handle dot notation paths
      const parts = path.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current === null || current === undefined) {
          return 0;
        }
        current = current[part];
      }
      
      // Convert to number
      const value = parseFloat(current);
      return isNaN(value) ? 0 : value;
    };
    
    // Extract values from reports
    const revenue = data.profitAndLoss ? extractValue(
      data.profitAndLoss, 
      mappings.revenue || 'revenue'
    ) : 0;
    
    const expenses = data.profitAndLoss ? extractValue(
      data.profitAndLoss, 
      mappings.expenses || 'expenses'
    ) : 0;
    
    const profit = revenue - expenses;
    
    // Create financial data object
    const financialData: FinancialData = {
      revenue,
      expenses,
      profit,
      period: {
        startDate: options.startDate as Date,
        endDate: options.endDate as Date,
        fiscalYear: options.fiscalYear,
        fiscalQuarter: options.fiscalQuarter,
        fiscalMonth: options.fiscalMonth
      }
    };
    
    // Add balance sheet data if available
    if (data.balanceSheet) {
      financialData.assets = extractValue(
        data.balanceSheet, 
        mappings.assets || 'assets'
      );
      
      financialData.liabilities = extractValue(
        data.balanceSheet, 
        mappings.liabilities || 'liabilities'
      );
      
      financialData.equity = extractValue(
        data.balanceSheet, 
        mappings.equity || 'equity'
      );
    }
    
    // Add cash flow data if available
    if (data.cashFlow) {
      financialData.cashFlow = extractValue(
        data.cashFlow, 
        mappings.cashFlow || 'cashFlow'
      );
    }
    
    return financialData;
  };
}
