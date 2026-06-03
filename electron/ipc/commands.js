import path from 'path';
import fs from 'fs';
import { app } from 'electron';

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  registerCommand(name, handler) {
    this.commands.set(name.toLowerCase(), handler);
    console.log(`[CommandRegistry] 注册命令: ${name}`);
  }

  findCommand(name) {
    return this.commands.get(name.toLowerCase());
  }

  getCommands() {
    return Array.from(this.commands.keys());
  }
}

function getScriptsDir() {
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'scripts');
  }
  return path.join(process.resourcesPath, 'app', 'scripts');
}

function normalizeCommand(cmd) {
  return cmd.trim();
}

function findMatchingScript(command) {
  const scriptsDir = getScriptsDir();
  const normalizedCmd = normalizeCommand(command);

  console.log('[findMatchingScript] scriptsDir:', scriptsDir);
  console.log('[findMatchingScript] normalizedCmd:', normalizedCmd);
  console.log('[findMatchingScript] scriptsDir exists:', fs.existsSync(scriptsDir));

  if (!fs.existsSync(scriptsDir)) {
    console.log('[findMatchingScript] scriptsDir 不存在');
    return null;
  }

  const files = fs.readdirSync(scriptsDir);
  console.log('[findMatchingScript] 目录中的文件:', files);

  const scriptFile = `${normalizedCmd}.js`;
  console.log('[findMatchingScript] 查找的脚本文件:', scriptFile);

  if (files.includes(scriptFile)) {
    const fullPath = path.join(scriptsDir, scriptFile);
    console.log('[findMatchingScript] 找到匹配脚本:', fullPath);
    return fullPath;
  }

  console.log('[findMatchingScript] 未找到匹配脚本');
  return null;
}

function getNodePath() {
  return process.execPath;
}

function parseCommandArgs(cmd) {
  const args = [];
  let current = '';
  let inQuote = null;

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i];

    if (char === '"' || char === "'") {
      if (inQuote === char) {
        inQuote = null;
      } else if (!inQuote) {
        inQuote = char;
      } else {
        current += char;
      }
    } else if (char === ' ' && !inQuote) {
      if (current) {
        args.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    args.push(current);
  }

  return args;
}

const registry = new CommandRegistry();

export {
  registry,
  getScriptsDir,
  findMatchingScript,
  getNodePath,
  parseCommandArgs,
  normalizeCommand,
};
