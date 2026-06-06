import { useState, useEffect } from 'react';
import { electronBridge, type TerminalOutput } from '../services/electronBridge';
import { usePlatform } from './usePlatform';
import { TShockApi } from '../services/tshockApi';
import type { CommandResult } from '../types/tshock';

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
    } catch (err) {
      const output: TerminalOutput = {
        type: 'error',
        data: err instanceof Error ? err.message : '命令执行失败',
        timestamp: Date.now(),
      };
      this.listeners.forEach(fn => fn(output));
    }
  };

  onOutput = (callback: (data: TerminalOutput) => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  };
}

export const useTerminalStream = (): TerminalStream => {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
  return isElectron ? new ElectronTerminalStream() : new RestTerminalStream();
};
