
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTShock } from '../hooks/useTShock';
import type { Player, BanRecord, Group } from '../types/tshock';
import { GroupList } from './GroupList';
import { GroupEditModal } from './GroupEditModal';
import { CreateGroupModal } from './CreateGroupModal';
import { DeleteGroupModal } from './DeleteGroupModal';
import { PlayerDetailModal } from './PlayerDetailModal';
import { ItemSelectorModal } from './ItemSelectorModal';
import { ITEM_DATA } from '../data';

interface ServerStatusViewProps {
  onGoToConfig?: () => void;
}

export function ServerStatusView({ onGoToConfig }: ServerStatusViewProps) {
  const {
    loading,
    error,
    clearError,
    getServerInfo,
    getPlayers,
    kickPlayer,
    getBanList,
    unbanPlayer,
    getPlayerDetails,
    banMultipleIdentifiers,
    mutePlayer,
    unmutePlayer,
    changeGroup,
    executeCommand,
    groups,
    users,
    loadingGroups,
    fetchGroups,
    fetchUsers,
    fetchGroup,
    createNewGroup,
    updateExistingGroup,
    deleteExistingGroup,
  } = useTShock();
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [banList, setBanList] = useState<BanRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'bans' | 'groups'>('players');

  // 用户组编辑相关状态
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<Group | null>(null);
  const [groupEditModalOpen, setGroupEditModalOpen] = useState(false);
  const [groupEditModalInitialTab, setGroupEditModalInitialTab] = useState<'basic' | 'permissions' | 'members'>('basic');
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<string | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerDetail, setPlayerDetail] = useState<Player | null>(null);
  const [playerDetailModalOpen, setPlayerDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: string; player: Player | null; banRecord: BanRecord | null }>({ isOpen: false, type: 'kick', player: null, banRecord: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [amountValue, setAmountValue] = useState('1');
  const reasonInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [info, playerList, bans] = await Promise.all([getServerInfo(), getPlayers(), getBanList()]);
      setServerInfo(info);
      setPlayers(playerList);
      setBanList(bans);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  }, [getServerInfo, getPlayers, getBanList]);

  const fetchGroupsAndUsers = useCallback(async () => {
    try {
      await Promise.all([fetchGroups(), fetchUsers()]);
    } catch (err) {
      console.error('Failed to fetch groups or users:', err);
    }
  }, [fetchGroups, fetchUsers]);

  useEffect(() => {
    fetchData();
    fetchGroupsAndUsers();
    if (!playerDetailModalOpen && !confirmDialog.isOpen && !groupEditModalOpen && !createGroupDialogOpen && !confirmDeleteGroup) {
      intervalRef.current = setInterval(fetchData, 30000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, fetchGroupsAndUsers]);

  useEffect(() => {
    if (activeTab === 'groups') {
      fetchGroupsAndUsers();
    }
  }, [activeTab, fetchGroupsAndUsers]);

  useEffect(() => {
    if (playerDetailModalOpen || confirmDialog.isOpen || groupEditModalOpen || createGroupDialogOpen || confirmDeleteGroup) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchData, 30000);
      }
    }
  }, [playerDetailModalOpen, confirmDialog.isOpen, groupEditModalOpen, createGroupDialogOpen, confirmDeleteGroup, fetchData]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => setToast({ message, type });

  // 用户组编辑相关函数
  const openGroupEditModal = async (group: Group, initialTab?: 'basic' | 'permissions' | 'members') => {
    try {
      // 获取完整用户组详情，包含权限
      const fullGroup = await fetchGroup(group.name);
      setSelectedGroupForEdit({ ...fullGroup });
      setGroupEditModalInitialTab(initialTab || 'basic');
      setGroupEditModalOpen(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户组详情失败';
      showToast(errorMessage, 'error');
    }
  };

  const closeGroupEditModal = () => {
    setGroupEditModalOpen(false);
    setSelectedGroupForEdit(null);
    setGroupEditModalInitialTab('basic');
  };

  const openPlayerDetail = async (player: Player) => {
    setSelectedPlayer(player);
    setPlayerDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const detail = await getPlayerDetails(player.nickname);
      setPlayerDetail(detail);
    } catch (err) {
      console.error('获取玩家详情失败:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleKick = (player: Player) => {
    setConfirmDialog({ isOpen: true, type: 'kick', player, banRecord: null });
  };
  const handleBan = (player: Player) => {
    setConfirmDialog({ isOpen: true, type: 'ban', player, banRecord: null });
  };
  const handleMute = (player: Player) => {
    setConfirmDialog({ isOpen: true, type: 'mute', player, banRecord: null });
  };
  const handleUnmute = (player: Player) => {
    setConfirmDialog({ isOpen: true, type: 'unmute', player, banRecord: null });
  };
  const handleChangeGroup = (player: Player) => {
    setConfirmDialog({ isOpen: true, type: 'changeGroup', player, banRecord: null });
  };
  const handleGiveItem = (player: Player) => {
    setInputValue('');
    setAmountValue('1');
    setConfirmDialog({ isOpen: true, type: 'giveItem', player, banRecord: null });
  };

  const handleUnban = (banRecord: BanRecord) => {
    setConfirmDialog({ isOpen: true, type: 'unban', player: null, banRecord });
  };

  const handleSelectItem = (itemId: number) => {
    const itemData = ITEM_DATA[itemId];
    setInputValue(itemData?.zh || itemData?.en || itemId.toString());
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: 'kick', player: null, banRecord: null });
  };

  const confirmAction = async () => {
    setActionLoading(true);
    const reason = reasonInputRef.current?.value || '';
    const changeGroupValue = valueInputRef.current?.value || '';
    try {
      if (confirmDialog.type === 'kick' && confirmDialog.player) {
        await kickPlayer(confirmDialog.player.nickname, reason);
        showToast(`已踢出玩家 ${confirmDialog.player.nickname}`, 'success');
      } else if (confirmDialog.type === 'ban' && confirmDialog.player) {
        const identifiers = [confirmDialog.player.nickname];
        if (confirmDialog.player.username) identifiers.push(`acc:${confirmDialog.player.username}`);
        const detail = playerDetail || confirmDialog.player;
        if (detail.ip) identifiers.push(`ip:${detail.ip}`);
        const banReason = reason || '违规封禁';
        const results = await banMultipleIdentifiers(identifiers, banReason);
        const successCount = results.filter((r: any) => r.success).length;
        showToast(`封禁成功！已处理 ${successCount}/${identifiers.length} 个标识符`, 'success');
      } else if (confirmDialog.type === 'unban' && confirmDialog.banRecord) {
        await unbanPlayer(confirmDialog.banRecord.ticket_number);
        showToast(`已解封 ${confirmDialog.banRecord.identifier}`, 'success');
      } else if (confirmDialog.type === 'mute' && confirmDialog.player) {
        await mutePlayer(confirmDialog.player.nickname, reason);
        showToast(`已禁言玩家 ${confirmDialog.player.nickname}`, 'success');
      } else if (confirmDialog.type === 'unmute' && confirmDialog.player) {
        await unmutePlayer(confirmDialog.player.nickname);
        showToast(`已取消禁言玩家 ${confirmDialog.player.nickname}`, 'success');
      } else if (confirmDialog.type === 'changeGroup' && confirmDialog.player && changeGroupValue) {
        await changeGroup(confirmDialog.player.nickname, changeGroupValue);
        showToast(`已将玩家 ${confirmDialog.player.nickname} 的用户组修改为 ${changeGroupValue}`, 'success');
      } else if (confirmDialog.type === 'giveItem' && confirmDialog.player) {
        const itemIdOrName = inputValue.trim() || '';
        const amount = parseInt(amountValue) || 1;
        if (!itemIdOrName) {
          showToast('请输入物品ID或名称', 'error');
          setActionLoading(false);
          return;
        }
        await executeCommand(`/give ${itemIdOrName} ${confirmDialog.player.nickname} ${amount}`);
        showToast(`已给予玩家 ${confirmDialog.player.nickname} 物品 ${itemIdOrName} x${amount}`, 'success');
      }
      await fetchData();
      if (selectedPlayer) await openPlayerDetail(selectedPlayer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '操作失败';
      console.error('操作失败:', errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(false);
      closeConfirmDialog();
    }
  };

  const getConfirmMessage = () => {
    if (confirmDialog.type === 'unban' && confirmDialog.banRecord) {
      const r = confirmDialog.banRecord;
      return `确定要解封吗？\n标识符: ${r.identifier}\n封禁原因: ${r.reason || '无'}\n封禁人: ${r.banning_user || '未知'}`;
    }
    if (!confirmDialog.player) return '';
    const p = confirmDialog.player;
    switch (confirmDialog.type) {
      case 'kick': return `确定要踢出玩家 ${p.nickname} 吗？`;
      case 'ban':
        let banMsg = `确定要封禁玩家 ${p.nickname} 吗？\n\n昵称: ${p.nickname}\n`;
        if (p.username) banMsg += `用户名: ${p.username}\n`;
        if (p.ip) banMsg += `IP地址: ${p.ip}\n`;
        banMsg += '\n注意：将同时封禁昵称、账号和IP';
        return banMsg;
      case 'mute': return `确定要禁言玩家 ${p.nickname} 吗？`;
      case 'unmute': return `确定要取消禁言玩家 ${p.nickname} 吗？`;
      case 'changeGroup': return `确定要修改玩家 ${p.nickname} 的用户组吗？`;
      case 'giveItem': return `确定要给玩家 ${p.nickname} 物品吗？\n\n格式：物品名 [数量]`;
      default: return '';
    }
  };

  const ToastComp = () => {
    if (!toast) return null;
    useEffect(() => {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }, []);

    const colors = {
      success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400',
      error: 'from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400',
      info: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-400',
    };

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`glass-card border bg-gradient-to-r ${colors[toast.type]} p-4 flex items-center gap-3`}>
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    );
  };

  const ConfirmDialogComp = () => {
    if (!confirmDialog.isOpen) return null;
    const getTitle = () => {
      switch (confirmDialog.type) {
        case 'kick': return '踢出玩家';
        case 'ban': return '封禁玩家';
        case 'unban': return '解封玩家';
        case 'mute': return '禁言玩家';
        case 'unmute': return '取消禁言';
        case 'changeGroup': return '修改用户组';
        case 'giveItem': return '给予物品';
        default: return '确认';
      }
    };

    const getDialogType = () => {
      if (confirmDialog.type === 'unban') return 'warning';
      if (confirmDialog.type === 'kick' || confirmDialog.type === 'ban' || confirmDialog.type === 'mute') return 'danger';
      return 'info';
    };

    const showReason = confirmDialog.type === 'kick' || confirmDialog.type === 'ban' || confirmDialog.type === 'mute';
    const showInput = confirmDialog.type === 'changeGroup' || confirmDialog.type === 'giveItem';
    const getInputPlaceholder = () => confirmDialog.type === 'changeGroup' ? '用户组名称' : '物品ID/名称 [数量]';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
        <div className="glass-card neon-border p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md w-full transform transition-all max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{getTitle()}</h3>
          <div className="text-slate-300 mb-4 sm:mb-6 whitespace-pre-line bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50 text-sm sm:text-base">
            {getConfirmMessage()}
          </div>
          {showReason && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">原因</label>
              <input
                ref={reasonInputRef}
                type="text"
                placeholder="请输入原因（可选）"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                autoFocus
              />
            </div>
          )}
          {showInput && (
            <div className="mb-4 sm:mb-6">
              {confirmDialog.type === 'giveItem' ? (
                <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">物品ID/名称</label>
                      <div className="flex gap-2">
                        <input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          type="text"
                          placeholder="如 4956 或 铁剑"
                          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                          autoFocus
                        />
                        <button onClick={(e) => { e.stopPropagation(); setItemSelectorOpen(true); }} className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 font-medium transition-all flex-shrink-0">选择</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">数量</label>
                      <input
                        value={amountValue}
                        onChange={(e) => setAmountValue(e.target.value)}
                        type="number"
                        placeholder="1"
                        min="1"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                      />
                    </div>
                  </div>
              ) : (
                <>
                  <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">{getInputPlaceholder()}</label>
                  {confirmDialog.type === 'changeGroup' ? (
                    <select
                      ref={valueInputRef as any}
                      onChange={(e) => {
                        if (valueInputRef.current) {
                          (valueInputRef.current as any).value = e.target.value;
                        }
                      }}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                      autoFocus
                    >
                      {groups.map((group) => (
                        <option key={group.name} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      ref={valueInputRef}
                      type="text"
                      placeholder={getInputPlaceholder()}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                      autoFocus
                    />
                  )}
                </>
              )}
            </div>
          )}
          <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
            <button
              onClick={closeConfirmDialog}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-slate-600 text-white font-medium hover:bg-slate-800/50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              取消
            </button>
            <button
              onClick={confirmAction}
              disabled={actionLoading}
              className={`flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50 text-sm sm:text-base ${getDialogType() === 'danger' ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90' : getDialogType() === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90' : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90'}`}
            >
              {actionLoading ? '处理中...' : '确认'}
            </button>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-600/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gradient">服务器状态</h1>
          <p className="text-slate-400 text-sm">实时监控服务器</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-cyan-400 text-sm font-medium transition-all disabled:opacity-50">
          刷新
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-4 glass-card neon-border p-4 border-red-500/50">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {error.includes('403') || error.includes('令牌') || error.includes('token') ? (
                <>
                  <h3 className="text-red-400 font-semibold mb-1">认证失败</h3>
                  <p className="text-slate-300 mb-3">游戏服务器可能已重启，Token 已失效，请重新获取 Token。</p>
                  {onGoToConfig && (
                    <button
                      onClick={onGoToConfig}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                    >
                      前往配置面板重新生成 Token
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-red-400 font-semibold mb-1">错误</h3>
                  <p className="text-slate-400">{error}</p>
                </>
              )}
            </div>
            <button onClick={clearError} className="text-slate-500 hover:text-white transition-colors">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="glass-card neon-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center neon-pulse">
              ⚡
            </div>
            <h2 className="text-lg font-bold text-white">服务器信息</h2>
          </div>

          {loading && !serverInfo ? (
            <div className="space-y-3">加载中...</div>
          ) : serverInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg"><span className="text-slate-400 text-sm">服务器名称</span><span className="text-white font-medium text-right truncate">{serverInfo.name}</span></div>
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg"><span className="text-slate-400 text-sm">版本</span><span className="text-cyan-400 font-medium text-right">{serverInfo.serverversion}</span></div>
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg"><span className="text-slate-400 text-sm">在线玩家</span><span className="text-green-400 font-medium text-right">{serverInfo.playercount} / {serverInfo.maxplayers}</span></div>
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg"><span className="text-slate-400 text-sm">运行时间</span><span className="text-white font-medium text-right">{serverInfo.uptime}</span></div>
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/30 rounded-lg md:col-span-2"><span className="text-slate-400 text-sm">世界</span><span className="text-white font-medium text-right truncate">{serverInfo.world}</span></div>
            </div>
          ) : null}
        </div>

        <div className="glass-card neon-border p-6">
          <div className="flex items-center gap-4 mb-5 border-b border-slate-700/50 pb-4">
            <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'players' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
              在线玩家
              <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'players' ? 'bg-purple-500/30' : 'bg-slate-700/50'}`}>{players.length}</span>
            </button>
            <button onClick={() => setActiveTab('bans')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bans' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
              封禁列表
              <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'bans' ? 'bg-red-500/30' : 'bg-slate-700/50'}`}>{banList.length}</span>
            </button>
            <button onClick={() => setActiveTab('groups')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'groups' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
              用户组管理
              <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'groups' ? 'bg-cyan-500/30' : 'bg-slate-700/50'}`}>{groups.length}</span>
            </button>
          </div>

          {activeTab === 'players' && (
            <div>
              {loading && players.length === 0 ? (
                <div className="space-y-3">加载中...</div>
              ) : players.length > 0 ? (
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/50 transition-all cursor-pointer" onClick={() => openPlayerDetail(player)}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${player.active ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-medium truncate">{player.nickname}</div>
                            <div className="text-slate-500 text-xs flex items-center gap-2">
                              <span>{player.group}</span>
                              {player.username && <span>• {player.username}</span>}
                              {player.muted && <span className="text-red-400">• 已禁言</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {player.active && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">在线</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">暂无在线玩家</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bans' && (
            <div>
              {loading && banList.length === 0 ? (
                <div className="space-y-3">加载中...</div>
              ) : banList.length > 0 ? (
                <div className="space-y-2">
                  {banList.map((banRecord, index) => (
                    <div key={index} className="bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/50 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-red-400"></div>
                            <div className="text-white font-medium truncate">{banRecord.identifier}</div>
                          </div>
                          <div className="text-slate-500 text-xs space-y-1">
                            {banRecord.reason && <div>原因: {banRecord.reason}</div>}
                            {banRecord.banning_user && <div>封禁人: {banRecord.banning_user}</div>}
                            <div className="text-slate-600">编号: {banRecord.ticket_number}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); handleUnban(banRecord); }} className="px-3 py-1.5 rounded bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-all">解封</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">暂无封禁记录</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'groups' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">用户组列表</h3>
                <button
                  onClick={() => setCreateGroupDialogOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                >
                  + 创建新组
                </button>
              </div>

              {loadingGroups && groups.length === 0 ? (
                <div className="space-y-3">加载中...</div>
              ) : groups.length > 0 ? (
                <GroupList
                  groups={groups}
                  onEditGroup={openGroupEditModal}
                  onDeleteGroup={(name) => setConfirmDeleteGroup(name)}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">暂无用户组</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PlayerDetailModal 
        isOpen={playerDetailModalOpen}
        onClose={() => { setPlayerDetailModalOpen(false); setSelectedPlayer(null); setPlayerDetail(null); }}
        player={selectedPlayer}
        detail={playerDetail}
        loadingDetail={loadingDetail}
        onKick={handleKick}
        onBan={handleBan}
        onMute={handleMute}
        onUnmute={handleUnmute}
        onChangeGroup={handleChangeGroup}
        onGiveItem={handleGiveItem}
      />
      <ConfirmDialogComp />
      <ToastComp />
      <GroupEditModal
        isOpen={groupEditModalOpen}
        onClose={closeGroupEditModal}
        group={selectedGroupForEdit}
        users={users}
        groups={groups}
        onUpdateGroup={updateExistingGroup}
        onChangeUserGroup={changeGroup}
        showToast={showToast}
        refreshUsers={fetchUsers}
        initialTab={groupEditModalInitialTab}
      />
      <CreateGroupModal
        isOpen={createGroupDialogOpen}
        onClose={() => setCreateGroupDialogOpen(false)}
        onCreateGroup={createNewGroup}
        groups={groups}
      />
      <DeleteGroupModal
        isOpen={!!confirmDeleteGroup}
        onClose={() => setConfirmDeleteGroup(null)}
        groupName={confirmDeleteGroup}
        onDelete={deleteExistingGroup}
        showToast={showToast}
      />
      <ItemSelectorModal
        isOpen={itemSelectorOpen}
        onClose={() => setItemSelectorOpen(false)}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}
