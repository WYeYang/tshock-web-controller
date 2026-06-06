import type { ServerStatus, Player, CommandResult, ServerInfo, BanRecord, Group, User } from '../types/tshock';
import type { AppConfig } from '../types/config';
import { isElectron } from '../utils/platform';

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

  // ==================== 配置相关 ====================
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

  // ==================== Header 相关 ====================
  private mergeHeaders(baseHeaders: Record<string, string>, additionalHeaders?: RequestInit['headers']): Record<string, string> {
    if (!additionalHeaders) return baseHeaders;
    
    const merged = { ...baseHeaders };
    const headerEntries = Array.from(
      additionalHeaders instanceof Headers 
        ? additionalHeaders.entries() 
        : Object.entries(additionalHeaders as Record<string, string>)
    );
    headerEntries.forEach(([key, value]) => {
      merged[key] = value;
    });
    return merged;
  }

  private getHeaders(tshockUrl?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 在非 Electron 环境（纯浏览器）里，添加 X-TShock-Url header
    if (!isElectron() && tshockUrl) {
      headers['X-TShock-Url'] = tshockUrl;
    }
    
    return headers;
  }

  // ==================== URL 相关 ====================
  private addTokenToPath(path: string, token: string): string {
    if (!token) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}token=${encodeURIComponent(token)}`;
  }

  private buildUrl(path: string, tshockUrl: string): string {
    if (isElectron()) {
      // 在 Electron 环境里，直接请求完整 URL，配合 webSecurity: false
      const targetPath = path.replace(/^\/api/, '');
      return `${tshockUrl}${targetPath}`;
    } else {
      // 在纯浏览器环境里，请求相对路径 + header，由 Vite proxy 或云端代理处理
      return path;
    }
  }

  // ==================== 错误处理 ====================
  private async parseErrorResponse(response: Response): Promise<string> {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = errorText;
          }
        } catch {
          errorMessage = errorText;
        }
      }
    } catch {
      // 忽略
    }
    return errorMessage;
  }

  private checkApiStatus(data: any): void {
    if (data.status !== '200') {
      throw new Error(data.error || 'API request failed');
    }
  }

  // ==================== 核心请求方法 ====================
  async getToken(username: string, password: string): Promise<string> {
    const { serverUrl } = this.getConfigFromStorage();
    const url = this.buildUrl(`/api/v2/token/create?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, serverUrl);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(serverUrl),
      });
      
      if (!response.ok) {
        const errorMessage = await this.parseErrorResponse(response);
        DetailedErrorLogger.log('GET', url, {
          action: 'getToken',
          tshockUrl: serverUrl,
          status: response.status,
          error: errorMessage
        });
        throw new Error(errorMessage);
      }
      
      const data: TokenResponse = await response.json();
      this.checkApiStatus(data);
      
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
    const basePath = `/api${endpoint}`;
    const headers = this.mergeHeaders(this.getHeaders(serverUrl), options.headers);
    const fullPath = this.addTokenToPath(basePath, token);
    const fullUrl = this.buildUrl(fullPath, serverUrl);

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
        
        // 尝试解析 JSON 错误信息
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // 如果无法解析 JSON，使用原始文本
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        // 针对 403 错误提供更友好的提示
        if (response.status === 403) {
          throw new Error('认证失败（403）：服务器已重启或 Token 已失效，请重新获取 Token');
        }
        
        throw new Error(errorMessage);
      }

      const data: any = await response.json();
      this.checkApiStatus(data);

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

  // ==================== API 方法 ====================
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

  async executeCommand(cmd: string): Promise<CommandResult> {
    const data: any = await this.request<any>(`/v3/server/rawcmd?cmd=${encodeURIComponent(cmd)}`);
    
    const result: CommandResult = {
      status: data.status,
      response: data.response || '',
      error: data.error || ''
    };
    
    // 检查响应中是否包含错误信息
    const responseArray = Array.isArray(result.response) ? result.response : [result.response];
    const errorKeywords = ['没有权限', '无法', '失败', '错误', '不能', '无效', '不存在'];
    const hasError = responseArray.some(msg => 
      typeof msg === 'string' && errorKeywords.some(keyword => msg.includes(keyword))
    );
    
    if (hasError) {
      const errorMsg = responseArray.filter(msg => typeof msg === 'string').join('; ');
      throw new Error(errorMsg);
    }
    
    return result;
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

  async changeGroup(playerName: string, groupName: string): Promise<any> {
    const data: any = await this.request<any>(
      `/v2/users/update?user=${encodeURIComponent(playerName)}&type=name&group=${encodeURIComponent(groupName)}`
    );
    return data;
  }

  async giveItem(playerName: string, itemName: string, amount: number = 1): Promise<CommandResult> {
    return this.executeCommand(`/give ${itemName} ${playerName} ${amount}`);
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

  async getGroups(): Promise<Group[]> {
    const data: any = await this.request<any>('/v2/groups/list');
    return data.groups || data.response || data || [];
  }

  async getGroup(groupName: string): Promise<Group> {
    const data: any = await this.request<any>(`/v2/groups/read?group=${encodeURIComponent(groupName)}`);
    return data.response || data;
  }

  async createGroup(groupName: string, parent?: string, permissions?: string[], chatcolor?: string): Promise<any> {
    let endpoint = `/v2/groups/create?group=${encodeURIComponent(groupName)}`;
    if (parent) endpoint += `&parent=${encodeURIComponent(parent)}`;
    if (permissions && permissions.length > 0) endpoint += `&permissions=${encodeURIComponent(permissions.join(','))}`;
    if (chatcolor) endpoint += `&chatcolor=${encodeURIComponent(chatcolor)}`;
    return this.request<any>(endpoint);
  }

  async updateGroup(groupName: string, parent?: string, permissions?: string[], chatcolor?: string): Promise<any> {
    let endpoint = `/v2/groups/update?group=${encodeURIComponent(groupName)}`;
    if (parent) endpoint += `&parent=${encodeURIComponent(parent)}`;
    if (permissions && permissions.length > 0) endpoint += `&permissions=${encodeURIComponent(permissions.join(','))}`;
    if (chatcolor) endpoint += `&chatcolor=${encodeURIComponent(chatcolor)}`;
    return this.request<any>(endpoint);
  }

  async deleteGroup(groupName: string): Promise<any> {
    const endpoint = `/v2/groups/destroy?group=${encodeURIComponent(groupName)}`;
    return this.request<any>(endpoint);
  }

  async getUserList(): Promise<User[]> {
    const data: any = await this.request<any>('/v2/users/list');
    return data.users || data.response || data || [];
  }
}
