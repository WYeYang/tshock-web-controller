import type { ServerStatus, Player, CommandResult, ServerInfo, BanRecord } from '../types/tshock';
import type { AppConfig } from '../types/config';

const STORAGE_KEY = 'tshock-web-config';

const decrypt = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
};

const getConfig = (): AppConfig | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const decrypted = decrypt(data);
    return JSON.parse(decrypted) as AppConfig;
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
};

export interface TokenResponse {
  status: string;
  response: string;
  error: string;
  token?: string;
}

class DetailedErrorLogger {
  static log(method: string, url: string, details: any) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      method,
      url,
      ...details
    };
    console.error('[API Error]', JSON.stringify(errorInfo, null, 2));
    
    if (details.stack) {
      console.error('[Stack Trace]', details.stack);
    }
  }
}

export class TShockApi {
  constructor() {}

  private getConfigFromStorage(): { serverUrl: string; token: string } {
    const config = getConfig();
    if (!config) {
      return { serverUrl: 'http://localhost:7878', token: '' };
    }
    return {
      serverUrl: config.tshock.serverUrl || 'http://localhost:7878',
      token: config.tshock.token || ''
    };
  }

  private getHeaders(tshockUrl: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-TShock-Url': tshockUrl,
    };
  }

  async getToken(username: string, password: string): Promise<string> {
    const { serverUrl } = this.getConfigFromStorage();
    const url = `/api/v2/token/create?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(serverUrl),
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          // 尝试解析JSON格式的错误
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // 如果解析失败，尝试读取文本
          try {
            const errorText = await response.text();
            if (errorText) {
              try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) {
                  errorMessage = errorJson.error;
                }
              } catch {
                errorMessage = errorText || errorMessage;
              }
            }
          } catch {
            // 忽略
          }
        }
        DetailedErrorLogger.log('GET', url, {
          action: 'getToken',
          tshockUrl: serverUrl,
          status: response.status,
          error: errorMessage
        });
        throw new Error(errorMessage);
      }
      
      const data: TokenResponse = await response.json();
      if (data.status !== '200') {
        DetailedErrorLogger.log('GET', url, {
          action: 'getToken',
          tshockUrl: serverUrl,
          apiStatus: data.status,
          apiError: data.error,
          response: data.response
        });
        throw new Error(data.error || 'Failed to get token');
      }
      
      const token = data.token || data.response;
      return token;
    } catch (error) {
      DetailedErrorLogger.log('GET', url, {
        action: 'getToken',
        tshockUrl: serverUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { serverUrl, token } = this.getConfigFromStorage();
    const url = `/api${endpoint}`;
    const headers = this.getHeaders(serverUrl);

    if (options.headers) {
      const headerEntries = Array.from(
        options.headers instanceof Headers 
          ? options.headers.entries() 
          : Object.entries(options.headers as Record<string, string>)
      );
      headerEntries.forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    let fullUrl = url;
    if (token) {
      const separator = url.includes('?') ? '&' : '?';
      fullUrl = `${url}${separator}token=${encodeURIComponent(token)}`;
    }

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        DetailedErrorLogger.log('FETCH', fullUrl, {
          action: 'request',
          tshockUrl: serverUrl,
          method: options.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          response: errorText,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();
      
      if (data.status !== '200') {
        DetailedErrorLogger.log('FETCH', fullUrl, {
          action: 'request',
          tshockUrl: serverUrl,
          method: options.method || 'GET',
          apiStatus: data.status,
          apiError: data.error,
          response: data.response,
        });
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      DetailedErrorLogger.log('FETCH', fullUrl, {
        action: 'request',
        tshockUrl: serverUrl,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  async getServerStatus(): Promise<ServerStatus> {
    const data: any = await this.request<any>('/v2/server/status');
    // /v2/server/status 返回的数据直接在根级别
    return {
      name: data.name || '',
      port: data.port || 0,
      playercount: data.playercount || 0,
      maxplayers: data.maxplayers || 0,
      world: data.world || '',
      uptime: data.uptime || '',
      serverpassword: data.serverpassword || false,
      players: data.players || [],
    } as ServerStatus;
  }

  async getPlayers(): Promise<Player[]> {
    // 先用 PlayerListV2 尝试获取更详细的玩家信息
    try {
      const data: any = await this.request<any>('/v2/players/list');
      const players = data.players || data.response || data || [];
      return players;
    } catch (error) {
      // 如果失败，回退到 /v2/server/status?players=true
      const statusData: any = await this.request<any>('/v2/server/status?players=true');
      return statusData.players || [];
    }
  }

  async getUserInfo(username: string, type: 'name' | 'id' = 'name'): Promise<any> {
    const data: any = await this.request<any>(`/v2/users/read?user=${encodeURIComponent(username)}&type=${type}`);
    return data.response || data;
  }

  async getUserList(): Promise<any[]> {
    const data: any = await this.request<any>('/v2/users/list');
    return data.users || data.response || data || [];
  }

  async executeCommand(cmd: string): Promise<CommandResult> {
    const data: any = await this.request<any>(`/v3/server/rawcmd?cmd=${encodeURIComponent(cmd)}`);
    return {
      status: data.status,
      response: data.response || '',
      error: data.error || ''
    } as CommandResult;
  }

  async getServerInfo(): Promise<ServerInfo> {
    const data: any = await this.request<any>('/v2/server/status');
    // /v2/server/status 返回的数据直接在根级别
    return {
      name: data.name || '',
      serverversion: data.serverversion || '',
      tshockversion: data.tshockversion || '',
      api: 2,
      port: data.port || 0,
      playercount: data.playercount || 0,
      maxplayers: data.maxplayers || 0,
      world: data.world || '',
      uptime: data.uptime || '',
      serverpassword: data.serverpassword || false,
    } as ServerInfo;
  }

  async kickPlayer(username: string, reason?: string): Promise<any> {
    let endpoint = `/v2/players/kick?player=${encodeURIComponent(username)}`;
    if (reason) {
      endpoint += `&reason=${encodeURIComponent(reason)}`;
    }
    return this.request<any>(endpoint);
  }

  async getPlayerDetails(playerName: string): Promise<Player> {
    // PlayerReadV4 直接返回数据在根级别
    try {
      const data: any = await this.request<any>(`/v4/players/read?player=${encodeURIComponent(playerName)}`);
      return data as Player;
    } catch (error) {
      // 如果 v4 版本失败，回退到 v3 版本
      const data: any = await this.request<any>(`/v3/players/read?player=${encodeURIComponent(playerName)}`);
      return data as Player;
    }
  }

  async banPlayer(identifier: string, reason?: string): Promise<any> {
    let endpoint = `/v3/bans/create?identifier=${encodeURIComponent(identifier)}`;
    if (reason) {
      endpoint += `&reason=${encodeURIComponent(reason)}`;
    }
    return this.request<any>(endpoint);
  }

  async banMultipleIdentifiers(identifiers: string[], reason?: string): Promise<any[]> {
    const results = [];
    for (const identifier of identifiers) {
      try {
        const result = await this.banPlayer(identifier, reason);
        results.push({ identifier, success: true, result });
      } catch (error) {
        results.push({ identifier, success: false, error });
      }
    }
    return results;
  }

  async getBanList(): Promise<BanRecord[]> {
    const data: any = await this.request<any>('/v3/bans/list');
    return data.bans || [];
  }

  async unbanPlayer(ticketNumber: number, fullDelete: boolean = true): Promise<any> {
    let endpoint = `/v3/bans/destroy?ticketNumber=${encodeURIComponent(ticketNumber.toString())}`;
    if (fullDelete) {
      endpoint += `&fullDelete=true`;
    }
    return this.request<any>(endpoint, {
      method: 'POST',
    });
  }

  async mutePlayer(playerName: string, reason?: string): Promise<CommandResult> {
    let cmd = `/mute ${playerName}`;
    if (reason) {
      cmd += ` ${reason}`;
    }
    return this.executeCommand(cmd);
  }

  async unmutePlayer(playerName: string): Promise<CommandResult> {
    return this.executeCommand(`/unmute ${playerName}`);
  }

  async teleportPlayer(playerName: string, x: number, y: number): Promise<CommandResult> {
    return this.executeCommand(`/tp ${playerName} ${x} ${y}`);
  }

  async teleportToPlayer(targetPlayer: string): Promise<CommandResult> {
    return this.executeCommand(`/tp ${targetPlayer}`);
  }

  async changeGroup(playerName: string, groupName: string): Promise<CommandResult> {
    return this.executeCommand(`/usergroup ${playerName} ${groupName}`);
  }

  async giveItem(playerName: string, itemName: string, amount: number = 1): Promise<CommandResult> {
    return this.executeCommand(`/give ${playerName} ${itemName} ${amount}`);
  }

  async getUsers(): Promise<any> {
    const endpoint = `/v2/users/list`;
    const response: any = await this.request<any>(endpoint);
    return response;
  }

  async registerUser(username: string, password: string): Promise<CommandResult> {
    const cmd = `/register ${username} ${password}`;
    return this.executeCommand(cmd);
  }

  async loginUser(username: string, password: string): Promise<CommandResult> {
    const cmd = `/login ${username} ${password}`;
    return this.executeCommand(cmd);
  }
}
