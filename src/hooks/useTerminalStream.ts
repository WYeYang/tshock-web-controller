import { electronBridge, type TerminalOutput } from '../services/electronBridge';
import { TShockApi } from '../services/tshockApi';
import type { CommandResult } from '../types/tshock';
import { loadCommandHistory, addCommandToHistory } from '../utils/storage';

export interface TerminalStream {
  send: (command: string) => Promise<void>;
  onOutput: (callback: (data: TerminalOutput) => void) => () => void;
  sync?: () => Promise<void>;
  clear?: () => Promise<void>;
}

export class ElectronTerminalStream implements TerminalStream {
  send = async (command: string) => {
    await electronBridge.terminal.send(command);
  };

  onOutput = (callback: (data: TerminalOutput) => void) => {
    return electronBridge.terminal.onOutput(callback);
  };

  sync = async () => {
    await electronBridge.terminal.sync();
  };

  clear = async () => {
    await electronBridge.terminal.clear();
  };
}

class RestTerminalStream implements TerminalStream {
  private listeners: ((data: TerminalOutput) => void)[] = [];
  private syncCalled = false;

  send = async (command: string) => {
    const api = new TShockApi();
    try {
      const result: CommandResult = await api.executeCommand(command);
      const responseText = result.response || '';
      const output: TerminalOutput = {
        type: 'stdout',
        data: Array.isArray(responseText) ? responseText.join('\n') : String(responseText),
        timestamp: Date.now(),
      };
      this.listeners.forEach(fn => fn(output));
      // 保存到历史记录
      addCommandToHistory(command, true, responseText);
    } catch (err) {
      const output: TerminalOutput = {
        type: 'error',
        data: err instanceof Error ? err.message : '命令执行失败',
        timestamp: Date.now(),
      };
      this.listeners.forEach(fn => fn(output));
      // 保存到历史记录
      addCommandToHistory(command, false, err instanceof Error ? err.message : '命令执行失败');
    }
  };

  onOutput = (callback: (data: TerminalOutput) => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  };

  sync = async () => {
    // 避免重复同步
    if (this.syncCalled) return;
    this.syncCalled = true;

    // 从 localStorage 加载历史记录
    const history = loadCommandHistory();
    // 按时间顺序发送历史记录
    history.reverse().forEach(item => {
      // 发送命令
      this.listeners.forEach(fn => fn({
        type: 'command',
        data: item.command,
        timestamp: item.timestamp,
      }));
      // 发送响应
      if (item.response) {
        this.listeners.forEach(fn => fn({
          type: item.success ? 'stdout' : 'error',
          data: item.response || '',
          timestamp: item.timestamp + 1,
        }));
      }
    });
  };
}

export const useTerminalStream = (): TerminalStream => {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
  return isElectron ? new ElectronTerminalStream() : new RestTerminalStream();
};
