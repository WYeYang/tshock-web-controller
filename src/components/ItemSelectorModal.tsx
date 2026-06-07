import { useState, useMemo, useCallback } from 'react';
import { ITEM_DATA, getItemIconUrl } from '../data';
import { ItemTooltip } from './ItemTooltip';

interface ItemSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (itemId: number) => void;
}

const ITEMS_PER_PAGE = 100; // 每页100个物品

export const ItemSelectorModal = ({ isOpen, onClose, onSelectItem }: ItemSelectorModalProps) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 转换 ITEM_DATA 为数组用于渲染
  const items = useMemo(() => {
    return Object.entries(ITEM_DATA).map(([idStr, data]) => ({
      id: parseInt(idStr),
      ...data
    }));
  }, []);

  // 搜索过滤
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    const searchLower = searchText.toLowerCase();
    return items.filter(item => {
      const idMatch = item.id.toString().includes(searchText);
      const enMatch = item.en.toLowerCase().includes(searchLower);
      const zhMatch = item.zh.toLowerCase().includes(searchLower);
      return idMatch || enMatch || zhMatch;
    });
  }, [items, searchText]);

  // 重置页码当搜索变化时
  useCallback(() => {
    setCurrentPage(1);
  }, [searchText]);

  // 计算分页
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage]);

  // 翻页函数
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-4xl w-full transform transition-all max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">选择物品</h3>
            <p className="text-slate-400 text-xs sm:text-sm">搜索并选择要给予的物品</p>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        <div className="mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="搜索物品：ID、英文或中文名称..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
            autoFocus
          />
        </div>

        {/* 分页信息 */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0 text-slate-400 text-xs sm:text-sm">
          <span>共 {filteredItems.length} 个物品</span>
          <span>第 {currentPage} / {totalPages} 页</span>
        </div>

        <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {currentPageItems.length > 0 ? (
              <div 
                className="grid gap-1 sm:gap-2 w-full grid-cols-10 auto-rows-fr items-center justify-items-center content-start pt-1"
                style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}
              >
                {currentPageItems.map((item) => (
                  <div key={item.id} className="cursor-pointer py-1">
                    <ItemTooltip
                      item={{
                        netID: item.id,
                        prefix: 0,
                        stack: 1,
                        favorited: false
                      }}
                    >
                      <div
                        onClick={() => {
                          onSelectItem(item.id);
                          onClose();
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-slate-700/50 rounded hover:bg-purple-500/30 hover:border-purple-500/50 border border-transparent transition-all mx-auto"
                      >
                        <img
                          src={getItemIconUrl(item.id)}
                          alt=""
                          className="w-7 h-7 object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </ItemTooltip>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">未找到匹配的物品</p>
            )}
          </div>
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 flex-shrink-0">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              上一页
            </button>
            <span className="text-slate-400 text-sm">第 {currentPage} 页</span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
