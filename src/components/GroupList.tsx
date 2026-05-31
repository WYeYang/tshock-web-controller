
import type { Group } from '../types/tshock';

interface GroupListProps {
  groups: Group[];
  onEditGroup: (group: Group, initialTab?: 'basic' | 'permissions' | 'members') => void;
  onDeleteGroup: (groupName: string) => void;
}

export const GroupList = ({ groups, onEditGroup, onDeleteGroup }: GroupListProps) => {
  return (
    <div className="space-y-2">
      {groups.map((group, index) => {
        const permCount = (group.permissions || []).length;
        return (
          <div
            key={index}
            className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-cyan-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium truncate">{group.name}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-2">
                    <span>父组: {group.parent || '无'}</span>
                    {permCount > 0 && <span>•</span>}
                    {permCount > 0 && <span>权限: {permCount}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditGroup(group, 'permissions')}
                  className="px-3 py-1.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-medium hover:bg-yellow-500/30 transition-all"
                >
                  权限
                </button>
                <button
                  onClick={() => onEditGroup(group, 'members')}
                  className="px-3 py-1.5 rounded bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-all"
                >
                  成员
                </button>
                <button
                  onClick={() => onEditGroup(group, 'basic')}
                  className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all"
                >
                  编辑
                </button>
                <button
                  onClick={() => onDeleteGroup(group.name)}
                  className="px-3 py-1.5 rounded bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
