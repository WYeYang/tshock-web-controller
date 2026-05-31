
import { useState, useEffect, useMemo } from 'react';
import type { Group, User } from '../types/tshock';
import { ALL_PERMISSIONS, PERMISSION_DESCRIPTIONS } from '../constants/permissions';

type ActiveTab = 'basic' | 'permissions' | 'members';

interface GroupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  users: User[];
  onUpdateGroup: (
    groupName: string,
    parent?: string,
    permissions?: string[],
    chatcolor?: string
  ) => Promise<void>;
  onChangeUserGroup: (userName: string, groupName: string) => Promise<any>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  refreshUsers?: () => void;
  initialTab?: ActiveTab;
}

export const GroupEditModal = ({
  isOpen,
  onClose,
  group,
  users,
  onUpdateGroup,
  onChangeUserGroup,
  showToast,
  refreshUsers,
  initialTab = 'basic',
}: GroupEditModalProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('basic');
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingPermission, setUpdatingPermission] = useState(false);
  const [editParent, setEditParent] = useState('');
  const [editChatColor, setEditChatColor] = useState('');
  const [savingBasicInfo, setSavingBasicInfo] = useState(false);
  const [updatingMember, setUpdatingMember] = useState(false);

  useEffect(() => {
    if (group) {
      const groupPerms = group.permissions || [];
      // 确保权限是数组
      const normalizedPerms = Array.isArray(groupPerms) 
        ? groupPerms 
        : (typeof groupPerms === 'string' ? (groupPerms as string).split(',') : []);
      
      setCurrentPermissions([...normalizedPerms]);
      setEditParent(group.parent || '');
      setEditChatColor(group.chatcolor || '');
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [group, initialTab]);

  // 计算值，确保在条件判断之前调用所有 Hooks
  const currentMembers = group ? users.filter((u) => u.group === group.name) : [];
  const otherUsers = group ? users.filter((u) => u.group !== group.name) : [];

  const filteredCurrentPermissions = useMemo(() => {
    if (!searchQuery) return currentPermissions;
    const query = searchQuery.toLowerCase();
    return currentPermissions.filter(p => 
      p.toLowerCase().includes(query) || 
      (PERMISSION_DESCRIPTIONS[p] || '').toLowerCase().includes(query)
    );
  }, [currentPermissions, searchQuery]);

  const filteredAvailablePermissions = useMemo(() => {
    const available = ALL_PERMISSIONS.filter(p => !currentPermissions.includes(p));
    if (!searchQuery) return available;
    const query = searchQuery.toLowerCase();
    return available.filter(p => 
      p.toLowerCase().includes(query) || 
      (PERMISSION_DESCRIPTIONS[p] || '').toLowerCase().includes(query)
    );
  }, [currentPermissions, searchQuery]);

  if (!isOpen || !group) return null;

  const addPermission = async (permission: string) => {
    if (updatingPermission) return;
    setUpdatingPermission(true);
    try {
      const newPermissions = [...currentPermissions, permission];
      await onUpdateGroup(group.name, editParent || undefined, newPermissions, editChatColor || undefined);
      setCurrentPermissions(newPermissions);
      showToast(`添加权限 ${permission} 成功`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '添加权限失败';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingPermission(false);
    }
  };

  const removePermission = async (permission: string) => {
    if (updatingPermission) return;
    setUpdatingPermission(true);
    try {
      const newPermissions = currentPermissions.filter((p) => p !== permission);
      await onUpdateGroup(group.name, editParent || undefined, newPermissions, editChatColor || undefined);
      setCurrentPermissions(newPermissions);
      showToast(`移除权限 ${permission} 成功`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '移除权限失败';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingPermission(false);
    }
  };

  const saveBasicInfo = async () => {
    setSavingBasicInfo(true);
    try {
      await onUpdateGroup(group.name, editParent || undefined, currentPermissions, editChatColor || undefined);
      showToast(`用户组 ${group.name} 更新成功`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新用户组失败';
      showToast(errorMessage, 'error');
    } finally {
      setSavingBasicInfo(false);
    }
  };

  const addMember = async (user: User) => {
    if (updatingMember) return;
    setUpdatingMember(true);
    try {
      await onChangeUserGroup(user.name, group.name);
      showToast(`已将用户 ${user.name} 添加到 ${group.name}`, 'success');
      if (refreshUsers) await refreshUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '添加成员失败';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingMember(false);
    }
  };

  const removeMember = async (user: User) => {
    if (updatingMember) return;
    setUpdatingMember(true);
    try {
      await onChangeUserGroup(user.name, 'default');
      showToast(`已将用户 ${user.name} 移出 ${group.name}`, 'success');
      if (refreshUsers) await refreshUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '移除成员失败';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingMember(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2">
              用户组名称
            </label>
            <input
              type="text"
              value={group.name}
              disabled
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2">
              父组
            </label>
            <input
              type="text"
              value={editParent}
              onChange={(e) => setEditParent(e.target.value)}
              placeholder="输入父组名称"
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-xs font-medium mb-2">
              聊天颜色（可选）
            </label>
            <input
              type="text"
              value={editChatColor}
              onChange={(e) => setEditChatColor(e.target.value)}
              placeholder="例如：#FF0000"
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm"
            />
          </div>
        </div>
        <button
          onClick={saveBasicInfo}
          disabled={savingBasicInfo}
          className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {savingBasicInfo ? '保存中...' : '保存基本信息'}
        </button>
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex gap-2 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索权限（可按权限名或说明搜索）..."
          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <div className="flex-1 min-h-0 flex gap-4">
        <div className="flex-1 min-h-0 bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex flex-col">
          <h4 className="text-cyan-400 text-sm font-medium mb-3 flex-shrink-0">
            已有权限 ({currentPermissions.length})
          </h4>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {filteredCurrentPermissions.length === 0 ? (
              <p className="text-slate-500 text-xs">{currentPermissions.length === 0 ? '暂无权限' : '无匹配结果'}</p>
            ) : (
              filteredCurrentPermissions.map((perm) => {
                const isWildcard = perm.includes('*');
                return (
                  <div
                    key={perm}
                    onClick={() => removePermission(perm)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded text-xs transition-all cursor-pointer ${
                      isWildcard
                        ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-slate-700/30 text-slate-300 hover:bg-red-500/20 hover:text-red-400'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate block font-medium">{perm}</span>
                      {PERMISSION_DESCRIPTIONS[perm] && (
                        <span className={`text-xs block truncate ${isWildcard ? 'text-yellow-500/70' : 'text-slate-500'}`}>
                          {PERMISSION_DESCRIPTIONS[perm]}
                        </span>
                      )}
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">✕</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex flex-col">
          <h4 className="text-green-400 text-sm font-medium mb-3 flex-shrink-0">
            可选权限 ({ALL_PERMISSIONS.length - currentPermissions.length})
          </h4>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {filteredAvailablePermissions.length === 0 ? (
              <p className="text-slate-500 text-xs">{currentPermissions.length === ALL_PERMISSIONS.length ? '已拥有所有权限' : '无匹配结果'}</p>
            ) : (
              filteredAvailablePermissions.map((perm) => {
                const isWildcard = perm.includes('*');
                return (
                  <div
                    key={perm}
                    onClick={() => addPermission(perm)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded text-xs transition-all cursor-pointer ${
                      isWildcard
                        ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30'
                        : 'bg-slate-700/30 text-slate-300 hover:bg-green-500/20 hover:text-green-400'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="truncate block font-medium">{perm}</span>
                      {PERMISSION_DESCRIPTIONS[perm] && (
                        <span className={`text-xs block truncate ${isWildcard ? 'text-yellow-500/70' : 'text-slate-500'}`}>
                          {PERMISSION_DESCRIPTIONS[perm]}
                        </span>
                      )}
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">+</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <p className="text-slate-500 text-xs pt-2 flex-shrink-0">
        点击权限即可添加或移除，黄色高亮的为通配符权限（匹配该分类下所有权限），修改会立即保存
      </p>
    </div>
  );

  const renderMembers = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex flex-col">
          <h4 className="text-cyan-400 text-sm font-medium mb-3 flex-shrink-0">
            当前组成员 ({currentMembers.length})
          </h4>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {currentMembers.length === 0 ? (
              <p className="text-slate-500 text-xs">暂无成员 (用户总数: {users.length})</p>
            ) : (
              currentMembers.map((member) => (
                <div
                  key={member.name}
                  onClick={() => removeMember(member)}
                  className="group flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded text-xs text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <span className="truncate block font-medium">{member.name}</span>
                    <span className="text-slate-500 text-xs block">ID: {member.id || '-'}</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex flex-col">
          <h4 className="text-green-400 text-sm font-medium mb-3 flex-shrink-0">
            可添加用户 ({otherUsers.length})
          </h4>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {otherUsers.length === 0 ? (
              <p className="text-slate-500 text-xs">
                暂无可添加的用户 (用户总数: {users.length})
              </p>
            ) : (
              otherUsers.map((user) => (
                <div
                  key={user.name}
                  onClick={() => addMember(user)}
                  className="group flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded text-xs text-slate-300 hover:bg-green-500/20 hover:text-green-400 transition-all cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <span className="truncate block font-medium">{user.name}</span>
                    <span className="text-slate-500 text-xs block truncate">
                      当前组: {user.group} • ID: {user.id || '-'}
                    </span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="text-slate-500 text-xs pt-2 flex-shrink-0">
        点击用户即可添加或移除，修改会立即保存
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-5xl lg:max-w-6xl w-full transform transition-all h-[85vh] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👥</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                编辑用户组: {group.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 border-b border-slate-700/50 pb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'basic'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'permissions'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            权限管理
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'members'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            成员管理
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'permissions' && renderPermissions()}
          {activeTab === 'members' && renderMembers()}
        </div>
      </div>
    </div>
  );
};

