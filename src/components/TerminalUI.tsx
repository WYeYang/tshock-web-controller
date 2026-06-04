import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { electronBridge } from '../services/electronBridge';

interface TerminalUIProps {
  visible: boolean;
  onOutput?: (data: string) => void;
}

export function TerminalUI({ visible, onOutput }: TerminalUIProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  const copySelection = async () => {
    if (!terminalInstanceRef.current) return;
    try {
      const selection = terminalInstanceRef.current.getSelection();
      if (selection) {
        await navigator.clipboard.writeText(selection);
        setHasSelection(false);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (!terminalRef.current || !visible) return;

    const terminal = new Terminal({
      cursorBlink: false,
      cursorStyle: 'bar',
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      allowTransparency: true,
      theme: {
        background: '#000000',
        foreground: '#cccccc',
        cursor: '#555555',
        cursorAccent: '#000000',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#cc5555',
        green: '#55cc55',
        yellow: '#cccc55',
        blue: '#5555cc',
        magenta: '#cc55cc',
        cyan: '#55cccc',
        white: '#cccccc',
        brightBlack: '#555555',
        brightRed: '#ff5555',
        brightGreen: '#55ff55',
        brightYellow: '#ffff55',
        brightBlue: '#5555ff',
        brightMagenta: '#ff55ff',
        brightCyan: '#55ffff',
        brightWhite: '#ffffff'
      },
      scrollback: 5000,
      convertEol: true,
      disableStdin: true,
      macOptionIsMeta: false,
      macOptionClickForcesSelection: false,
      rightClickSelectsWord: false
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);
    
    // 彻底禁用聚焦
    setTimeout(() => {
      const textarea = terminalRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.disabled = true;
        textarea.tabIndex = -1;
        textarea.style.display = 'none';
      }
      const terminalElement = terminalRef.current?.querySelector('.xterm');
      if (terminalElement) {
        (terminalElement as HTMLElement).tabIndex = -1;
      }
    }, 100);
    
    // 监听选中变化
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const hasSel = selection && selection.toString().trim().length > 0;
      setHasSelection(hasSel);
    };

    const terminalElement = terminalRef.current;
    terminalElement.addEventListener('mouseup', handleSelectionChange);
    terminalElement.addEventListener('mousedown', handleSelectionChange);
    terminalElement.addEventListener('keyup', handleSelectionChange);
    document.addEventListener('selectionchange', handleSelectionChange);
    
    requestAnimationFrame(() => {
      fitAddon.fit();
      electronBridge.terminal.resize(terminal.cols, terminal.rows);
      terminal.scrollToBottom();
    });

    terminalInstanceRef.current = terminal;
    fitAddonRef.current = fitAddon;

    terminal.onResize(({ cols, rows }) => {
      electronBridge.terminal.resize(cols, rows);
    });

    const unsubscribe = electronBridge.terminal.onOutput((data) => {
      terminal.write(data.data);
      onOutput?.(data.data);
      setTimeout(() => {
        terminal.scrollToBottom();
      }, 10);
    });

    electronBridge.terminal.sync();
    
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (e) {}
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      terminalElement.removeEventListener('mouseup', handleSelectionChange);
      terminalElement.removeEventListener('mousedown', handleSelectionChange);
      terminalElement.removeEventListener('keyup', handleSelectionChange);
      document.removeEventListener('selectionchange', handleSelectionChange);
      unsubscribe();
      terminal.dispose();
    };
  }, [visible]);

  return (
    <div className="relative border border-gray-600 overflow-hidden" style={{ height: '450px', width: '100%', backgroundColor: '#000000' }}>
      <div 
        ref={terminalRef} 
        className="h-full w-full" 
        style={{ pointerEvents: 'none' }}
      />
      {hasSelection && (
        <button
          onClick={copySelection}
          className="absolute top-2 right-2 z-10 px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white text-sm transition-colors"
        >
          复制
        </button>
      )}
    </div>
  );
}
