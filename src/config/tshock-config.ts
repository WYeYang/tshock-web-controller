
export const DEFAULT_REST_API_SETTINGS = {
  RestApiEnabled: true,
  RestApiPort: 7878,
  EnableTokenEndpointAuthentication: false,
  LogRest: true,
  RESTMaximumRequestsPerInterval: 50,
  RESTRequestBucketDecreaseIntervalMinutes: 1,
  ApplicationRestTokens: {}
};

export const DEFAULT_SERVER_URL = 'http://localhost:7878';

export function mergeWithDefaultRestApiSettings(config: any): any {
  return {
    ...config,
    Settings: {
      ...(config?.Settings || {}),
      ...DEFAULT_REST_API_SETTINGS
    }
  };
}
