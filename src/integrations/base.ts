/**
 * Base integration interface for financial API connectors
 */

export interface FinancialDataOptions {
  fiscalYear?: number;
  fiscalQuarter?: number;
  fiscalMonth?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  includeDetails?: boolean;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  cashFlow?: number;
  details?: Record<string, any>;
  period: {
    startDate: Date;
    endDate: Date;
    fiscalYear?: number;
    fiscalQuarter?: number;
    fiscalMonth?: number;
  };
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
}

export interface ApiConnectorOptions {
  baseUrl?: string;
  apiVersion?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Base class for financial API connectors
 */
export abstract class FinancialApiConnector {
  protected authConfig: AuthConfig;
  protected options: ApiConnectorOptions;
  protected accessToken: string | null = null;
  protected refreshToken: string | null = null;
  protected tokenExpiry: Date | null = null;

  constructor(authConfig: AuthConfig, options: ApiConnectorOptions = {}) {
    this.authConfig = authConfig;
    this.options = {
      timeout: 30000, // 30 seconds default timeout
      ...options
    };
  }

  /**
   * Get the authorization URL for OAuth flow
   */
  abstract getAuthorizationUrl(): string;

  /**
   * Exchange authorization code for access token
   * @param code Authorization code from OAuth callback
   */
  abstract exchangeCodeForToken(code: string): Promise<TokenResponse>;

  /**
   * Refresh the access token using the refresh token
   */
  abstract refreshAccessToken(): Promise<TokenResponse>;

  /**
   * Check if the current token is valid
   */
  isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    
    // Consider token expired 5 minutes before actual expiry
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return new Date().getTime() < this.tokenExpiry.getTime() - bufferTime;
  }

  /**
   * Set token information
   */
  setTokenInfo(tokenResponse: TokenResponse): void {
    this.accessToken = tokenResponse.accessToken;
    
    if (tokenResponse.refreshToken) {
      this.refreshToken = tokenResponse.refreshToken;
    }
    
    if (tokenResponse.expiresIn) {
      this.tokenExpiry = new Date(Date.now() + tokenResponse.expiresIn * 1000);
    }
  }

  /**
   * Get financial data for a specific fiscal period
   * @param options Options for retrieving financial data
   */
  abstract getFinancialData(options: FinancialDataOptions): Promise<FinancialData>;

  /**
   * Get raw data from the API
   * @param endpoint API endpoint
   * @param params Query parameters
   */
  abstract getRawData(endpoint: string, params?: Record<string, any>): Promise<any>;
}
