export interface TShockConfig {
  serverUrl: string;
  token: string;
  username: string;
  password: string;
  useCredentials: boolean;
}

export interface AppConfig {
  tshock: TShockConfig;
}
