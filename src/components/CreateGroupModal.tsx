
import { useState } from 'react';
import type { Group } from '../types/tshock';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, parent?: string, permissions?: string[], chatcolor?: string) => Promise<void>;
  groups: Group[];
}

export const CreateGroupModal = ({ isOpen, onClose, onCreateGroup, groups }: CreateGroupModalProps) => {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [chatcolor, setChatcolor] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await onCreateGroup(
        name.trim(),
        parent.trim() || undefined,
        undefined,
        chatcolor.trim() || undefined
      );
      setName('');
      setParent('');
      setChatcolor('');
      onClose();
    } catch (err) {
      console.error('Failed to create group:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md w-full transform transition-all">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
          创建新用户组
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">
              用户组名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入用户组名称"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">
              父组（可选）
            </label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
            >
              <option value="">无父组</option>
              {groups.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">
              聊天颜色（可选）
            </label>
            <input
              type="text"
              value={chatcolor}
              onChange={(e) => setChatcolor(e.target.value)}
              placeholder="例如：#FF0000"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-800/50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {creating ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
