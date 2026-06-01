import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
// import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  detail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
}

export const PlayerDetailModal = ({ 
  isOpen, 
  onClose, 
  player, 
  detail, 
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');

  if (!isOpen) return null;
  const displayPlayer = detail || player;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  // const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
  //   const buffs: { buffId: number; timeLeft: string }[] = [];
  //   const parts = buffString.split(',').map(s => s.trim());
  //   
  //   for (let i = 0; i < parts.length; i += 2) {
  //     const buffId = parseInt(parts[i]);
  //     if (buffId > 0) {
  //       const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
  //       buffs.push({ buffId, timeLeft });
  //     }
  //   }
  //   
  //   return buffs;
  // };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1 justify-items-center items-start gap-1 sm:gap-2 grid-cols-[repeat(auto-fill,minmax(36px,1fr))]"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={`${item.netID}-${item.stack}-${item.prefix}-${index}`} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  基本信息
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-0.5">昵称</p>
                    <p className="text-white font-medium text-xs truncate">{displayPlayer.nickname}</p>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-0.5">用户名</p>
                    <p className="text-white font-medium text-xs truncate">{displayPlayer.username || '未注册'}</p>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-0.5">用户组</p>
                    <p className="text-white font-medium text-xs truncate">{displayPlayer.group}</p>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-0.5">IP地址</p>
                    <p className="text-white font-medium text-xs truncate">{displayPlayer.ip || '未知'}</p>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-0.5">禁言</p>
                    <p className={`font-medium text-xs ${displayPlayer.muted ? 'text-red-400' : 'text-green-400'}`}>{displayPlayer.muted ? '是' : '否'}</p>
                  </div>
                  {displayPlayer.position && (
                    <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50 col-span-1 sm:col-span-2">
                      <p className="text-slate-400 text-xs mb-0.5">位置</p>
                      <p className="text-white font-medium text-xs truncate">{displayPlayer.position}</p>
                    </div>
                  )}
                </div>
              </div>

              {displayPlayer.items && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    物品
                  </h3>
                  <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveInventoryTab(tab.key as any)}
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                          activeInventoryTab === tab.key
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50 h-[315px] overflow-y-auto">
                    {displayPlayer.items[activeInventoryTab] && displayPlayer.items[activeInventoryTab].length > 0 ? (
                      renderItemGrid(displayPlayer.items[activeInventoryTab])
                    ) : (
                      <p className="text-slate-500 text-sm">暂无物品</p>
                    )}
                  </div>
                </div>
              )}

              {!displayPlayer.items && (
                <>
                  {displayPlayer.inventory && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        背包
                      </h3>
                      <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50 h-[315px] overflow-y-auto">
                        <p className="text-slate-300 whitespace-pre-wrap text-xs">{displayPlayer.inventory}</p>
                      </div>
                    </div>
                  )}

                  {displayPlayer.armor && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        装备
                      </h3>
                      <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50 h-[315px] overflow-y-auto">
                        <p className="text-slate-300 whitespace-pre-wrap text-xs">{displayPlayer.armor}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* {displayPlayer.buffs && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    增益效果
                  </h3>
                  <div className="bg-slate-800/30 p-2 rounded-lg border border-slate-700/50 min-h-[200px]">
                    {(() => {
                      const buffs = parseBuffString(displayPlayer.buffs!);
                      if (buffs.length > 0) {
                        return (
                          <div className="grid grid-cols-10 gap-1">
                            {buffs.map((buff, index) => (
                              <BuffSlot key={index} buffId={buff.buffId} timeLeft={buff.timeLeft} />
                            ))}
                          </div>
                        );
                      }
                      return <p className="text-slate-300 whitespace-pre-wrap text-xs">{displayPlayer.buffs}</p>;
                    })()}
                  </div>
                </div>
              )} */}

              <div>
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  操作
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {player && onKick && <button onClick={() => onKick(player)} className="px-2 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                    踢出
                  </button>}
                  {player && onBan && <button onClick={() => onBan(player)} className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                    封禁
                  </button>}
                  {player && onMute && onUnmute && (displayPlayer.muted ? (
                    <button onClick={() => onUnmute(player)} className="px-2 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                      取消禁言
                    </button>
                  ) : (
                    <button onClick={() => onMute(player)} className="px-2 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                      禁言
                    </button>
                  ))}
                  {player && onChangeGroup && (
                    displayPlayer.username ? (
                      <button onClick={() => onChangeGroup(player)} className="px-2 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                        修改用户组
                      </button>
                    ) : (
                      <button disabled className="px-2 py-1.5 bg-slate-700/20 border border-slate-700/30 rounded-lg text-slate-500 font-medium cursor-not-allowed flex items-center justify-center gap-1 text-xs">
                        未注册
                      </button>
                    )
                  )}
                  {player && onGiveItem && <button onClick={() => onGiveItem(player)} className="px-2 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-medium transition-all flex items-center justify-center gap-1 text-xs">
                    给予物品
                  </button>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
