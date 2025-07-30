/**
 * Examples of using financial API integrations with fiscal-year-calendar
 */

import {
  QuickBooksConnector,
  XeroConnector,
  GenericAccountingAdapter,
  createRestDataSource,
  createSimpleDataTransformer
} from '../src/integrations';

/**
 * Example 1: Using QuickBooks API connector
 */
async function quickBooksExample() {
  // Initialize QuickBooks connector
  const qbConnector = new QuickBooksConnector({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'https://your-app.com/callback',
    scope: ['com.intuit.quickbooks.accounting']
  }, {
    environment: 'sandbox', // Use 'production' for live data
    minorVersion: 65
  });

  // Get authorization URL for OAuth flow
  const authUrl = qbConnector.getAuthorizationUrl();
  console.log('Authorize QuickBooks access by visiting:', authUrl);

  // After user authorizes and is redirected to your callback URL with a code parameter
  // Exchange the code for an access token
  // This would typically be done in your callback route handler
  const code = 'authorization-code-from-callback';
  await qbConnector.exchangeCodeForToken(code);

  // Get financial data for fiscal year 2025
  const financialData = await qbConnector.getFinancialData({
    fiscalYear: 2025,
    includeDetails: true
  });

  console.log('QuickBooks Financial Data:', financialData);
  console.log(`Revenue: ${financialData.revenue}`);
  console.log(`Expenses: ${financialData.expenses}`);
  console.log(`Profit: ${financialData.profit}`);

  // Get financial data for a specific fiscal quarter
  const quarterData = await qbConnector.getFinancialData({
    fiscalYear: 2025,
    fiscalQuarter: 2,
    includeDetails: true
  });

  console.log(`Q2 2025 Revenue: ${quarterData.revenue}`);
}

/**
 * Example 2: Using Xero API connector
 */
async function xeroExample() {
  // Initialize Xero connector
  const xeroConnector = new XeroConnector({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'https://your-app.com/callback',
    scope: ['accounting.reports.read', 'accounting.transactions.read']
  });

  // Get authorization URL for OAuth flow
  const authUrl = xeroConnector.getAuthorizationUrl();
  console.log('Authorize Xero access by visiting:', authUrl);

  // After user authorizes and is redirected to your callback URL with a code parameter
  // Exchange the code for an access token
  // This would typically be done in your callback route handler
  const code = 'authorization-code-from-callback';
  await xeroConnector.exchangeCodeForToken(code);

  // Get financial data for fiscal year 2025
  const financialData = await xeroConnector.getFinancialData({
    fiscalYear: 2025,
    includeDetails: true
  });

  console.log('Xero Financial Data:', financialData);
  console.log(`Revenue: ${financialData.revenue}`);
  console.log(`Expenses: ${financialData.expenses}`);
  console.log(`Profit: ${financialData.profit}`);

  // Get financial data for a specific date range
  const rangeData = await xeroConnector.getFinancialData({
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    includeDetails: true
  });

  console.log(`Q1 2025 Revenue: ${rangeData.revenue}`);
}

/**
 * Example 3: Using Generic Adapter with a custom accounting system
 */
async function genericAdapterExample() {
  // Create a REST data source for your custom API
  const dataSource = createRestDataSource('https://api.your-accounting-system.com', {
    apiVersion: 'v1',
    contentType: 'application/json',
    timeout: 10000
  });

  // Create a data transformer with field mappings for your API's response format
  const dataTransformer = createSimpleDataTransformer({
    revenue: 'data.income.total',
    expenses: 'data.expenses.total',
    assets: 'data.balanceSheet.assets.total',
    liabilities: 'data.balanceSheet.liabilities.total',
    equity: 'data.balanceSheet.equity.total',
    cashFlow: 'data.cashFlow.netCashFlow'
  });

  // Create a custom auth provider function
  const authProvider = async (code: string, authConfig: any) => {
    // Implement your custom authentication logic here
    const response = await fetch('https://api.your-accounting-system.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${authConfig.clientId}:${authConfig.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: authConfig.state === 'refresh_token' ? 'refresh_token' : 'authorization_code',
        [authConfig.state === 'refresh_token' ? 'refresh_token' : 'code']: code,
        redirect_uri: authConfig.redirectUri
      }).toString()
    });

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope
    };
  };

  // Initialize the generic adapter
  const adapter = new GenericAccountingAdapter({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'https://your-app.com/callback'
  }, {
    dataSource,
    dataTransformer,
    authProvider,
    authUrl: 'https://api.your-accounting-system.com/oauth/authorize',
    endpoints: {
      profitAndLoss: 'reports/profit-loss',
      balanceSheet: 'reports/balance-sheet',
      cashFlow: 'reports/cash-flow'
    }
  });

  // Get authorization URL for OAuth flow
  const authUrl = adapter.getAuthorizationUrl();
  console.log('Authorize access by visiting:', authUrl);

  // After user authorizes and is redirected to your callback URL with a code parameter
  // Exchange the code for an access token
  const code = 'authorization-code-from-callback';
  await adapter.exchangeCodeForToken(code);

  // Get financial data for fiscal year 2025
  const financialData = await adapter.getFinancialData({
    fiscalYear: 2025,
    includeDetails: true
  });

  console.log('Financial Data:', financialData);
}

/**
 * Example 4: Using the Generic Adapter without authentication
 * (for systems that don't require OAuth)
 */
async function noAuthExample() {
  // Create a simple data source that doesn't require authentication
  const dataSource = async (endpoint: string, params: Record<string, any>, headers: Record<string, string>) => {
    const url = `https://api.public-accounting-data.com/${endpoint}`;
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, String(value));
    }
    
    const response = await fetch(`${url}?${queryParams.toString()}`, {
      method: 'GET',
      headers
    });
    
    return await response.json();
  };

  // Create a simple data transformer
  const dataTransformer = createSimpleDataTransformer();

  // Initialize the generic adapter without auth provider
  const adapter = new GenericAccountingAdapter({
    clientId: '', // Not used but required by the interface
    clientSecret: '', // Not used but required by the interface
    redirectUri: '' // Not used but required by the interface
  }, {
    dataSource,
    dataTransformer
  });

  // Get financial data for fiscal year 2025
  const financialData = await adapter.getFinancialData({
    fiscalYear: 2025
  });

  console.log('Financial Data:', financialData);
}

// Run the examples
async function runExamples() {
  try {
    console.log('=== QuickBooks Example ===');
    // await quickBooksExample();
    
    console.log('\n=== Xero Example ===');
    // await xeroExample();
    
    console.log('\n=== Generic Adapter Example ===');
    // await genericAdapterExample();
    
    console.log('\n=== No Auth Example ===');
    // await noAuthExample();
    
    console.log('\nAll examples are commented out to prevent actual API calls.');
    console.log('Uncomment the example you want to run after configuring your API credentials.');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

runExamples();
