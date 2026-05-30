
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTShock } from '../hooks/useTShock';
import type { Player, BanRecord } from '../types/tshock';

export function ServerStatusView() {
  const { loading, error, clearError, getServerInfo, getPlayers, kickPlayer, getBanList, unbanPlayer, getPlayerDetails, banMultipleIdentifiers, mutePlayer, unmutePlayer, teleportToPlayer, changeGroup, giveItem, executeCommand } = useTShock();
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [banList, setBanList] = useState<BanRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'bans'>('players');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerDetail, setPlayerDetail] = useState<Player | null>(null);
  const [playerDetailModalOpen, setPlayerDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: string; player: Player | null; banRecord: BanRecord | null }>({ isOpen: false, type: 'kick', player: null, banRecord: null });
  const [confirmReason, setConfirmReason] = useState('');
  const [confirmInputValue, setConfirmInputValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const reasonInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // 定时器引用

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

  useEffect(() => {
    fetchData();
    // 只有在没有弹窗打开时才设置定时器
    if (!playerDetailModalOpen && !confirmDialog.isOpen) {
      intervalRef.current = setInterval(fetchData, 30000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  // 监听弹窗状态变化，暂停或恢复定时器
  useEffect(() => {
    if (playerDetailModalOpen || confirmDialog.isOpen) {
      // 弹窗打开，暂停定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // 弹窗关闭，恢复定时器
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchData, 30000);
      }
    }
  }, [playerDetailModalOpen, confirmDialog.isOpen, fetchData]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => setToast({ message, type });

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
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'kick', player, banRecord: null });
  };
  const handleBan = (player: Player) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'ban', player, banRecord: null });
  };
  const handleMute = (player: Player) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'mute', player, banRecord: null });
  };
  const handleUnmute = (player: Player) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'unmute', player, banRecord: null });
  };
  const handleChangeGroup = (player: Player) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'changeGroup', player, banRecord: null });
  };
  const handleGiveItem = (player: Player) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'giveItem', player, banRecord: null });
  };
  const handleUnban = (banRecord: BanRecord) => {
    setConfirmReason('');
    setConfirmInputValue('');
    setConfirmDialog({ isOpen: true, type: 'unban', player: null, banRecord });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: 'kick', player: null, banRecord: null });
    setConfirmReason('');
    setConfirmInputValue('');
  };

  const confirmAction = async () => {
    setActionLoading(true);
    const reason = reasonInputRef.current?.value || '';
    const inputValue = valueInputRef.current?.value || '';
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
        const successCount = results.filter(r => r.success).length;
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
      } else if (confirmDialog.type === 'teleportTo' && confirmDialog.player) {
        await teleportToPlayer(confirmDialog.player.nickname);
        showToast(`已传送至玩家 ${confirmDialog.player.nickname}`, 'success');
      } else if (confirmDialog.type === 'changeGroup' && confirmDialog.player && inputValue) {
        await changeGroup(confirmDialog.player.nickname, inputValue);
        showToast(`已将玩家 ${confirmDialog.player.nickname} 的用户组修改为 ${inputValue}`, 'success');
      } else if (confirmDialog.type === 'giveItem' && confirmDialog.player) {
        const itemIdOrName = valueInputRef.current?.value?.trim() || '';
        const amount = parseInt(amountInputRef.current?.value) || 1;
        if (!itemIdOrName) {
          showToast('请输入物品ID或名称', 'error');
          setActionLoading(false);
          return;
        }
        await executeCommand(`/give ${confirmDialog.player.nickname} ${itemIdOrName} ${amount}`);
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
                    <input
                      ref={valueInputRef}
                      type="text"
                      placeholder="如 4956 或 铁剑"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">数量</label>
                    <input
                      ref={amountInputRef}
                      type="number"
                      placeholder="1"
                      defaultValue="1"
                      min="1"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <label className="block text-slate-400 text-xs sm:text-sm font-medium mb-2">{getInputPlaceholder()}</label>
                  <input
                    ref={valueInputRef}
                    type="text"
                    placeholder={getInputPlaceholder()}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                    autoFocus
                  />
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

  const PlayerDetailModalComp = () => {
    if (!playerDetailModalOpen) return null;
    const displayPlayer = playerDetail || selectedPlayer;
    if (!displayPlayer) return null;

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
        <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
                <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
              </div>
            </div>
            <button onClick={() => { setPlayerDetailModalOpen(false); setSelectedPlayer(null); setPlayerDetail(null); }} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
              ✕
            </button>
          </div>

          {loadingDetail ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  基本信息
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">昵称</p>
                    <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.nickname}</p>
                  </div>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">用户名</p>
                    <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.username || '未注册'}</p>
                  </div>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">用户组</p>
                    <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.group}</p>
                  </div>

                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">IP地址</p>
                    <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.ip || '未知'}</p>
                  </div>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">禁言</p>
                    <p className={`font-medium text-sm sm:text-base ${displayPlayer.muted ? 'text-red-400' : 'text-green-400'}`}>{displayPlayer.muted ? '是' : '否'}</p>
                  </div>
                  {displayPlayer.position && (
                    <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50 col-span-1 sm:col-span-2">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">位置</p>
                      <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.position}</p>
                    </div>
                  )}
                </div>
              </div>

              {displayPlayer.inventory && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    背包
                  </h3>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm">{displayPlayer.inventory}</p>
                  </div>
                </div>
              )}

              {displayPlayer.armor && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    装备
                  </h3>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm">{displayPlayer.armor}</p>
                  </div>
                </div>
              )}

              {displayPlayer.buffs && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    增益效果
                  </h3>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                    <p className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm">{displayPlayer.buffs}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  操作
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {selectedPlayer && <button onClick={() => handleKick(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    踢出
                  </button>}
                  {selectedPlayer && <button onClick={() => handleBan(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    封禁
                  </button>}
                  {selectedPlayer && (displayPlayer.muted ? (
                    <button onClick={() => handleUnmute(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      取消禁言
                    </button>
                  ) : (
                    <button onClick={() => handleMute(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      禁言
                    </button>
                  ))}
                  {selectedPlayer && <button onClick={() => handleChangeGroup(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    修改用户组
                  </button>}
                  {selectedPlayer && <button onClick={() => handleGiveItem(selectedPlayer)} className="px-3 py-2 sm:px-4 sm:py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    给予物品
                  </button>}
                </div>
              </div>
            </>
          )}
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
              <h3 className="text-red-400 font-semibold mb-1">错误</h3>
              <p className="text-slate-400">{error}</p>
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
                          &gt;
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
        </div>
      </div>

      <PlayerDetailModalComp />
      <ConfirmDialogComp />
      <ToastComp />
    </div>
  );
}
