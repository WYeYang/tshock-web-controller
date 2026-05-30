export interface TShockConfig {
  serverUrl: string;
  token: string;
  username: string;
  password: string;
  useCredentials: boolean;
}

export interface LLMConfig {
  apiUrl: string;
  apiKey: string;
}

export interface AppConfig {
  tshock: TShockConfig;
  llm: LLMConfig;
}
