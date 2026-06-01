import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ITEM_DATA, PREFIX_DATA, getItemIconUrl } from '../data';

interface ItemTooltipProps {
  item: {
    netID: number;
    prefix: number;
    stack: number;
    favorited: boolean;
  };
  children: React.ReactNode;
}

export const ItemTooltip = ({ item, children }: ItemTooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const itemData = ITEM_DATA[item.netID];
  const prefixData = item.prefix > 0 ? PREFIX_DATA[item.prefix] : undefined;
  const displayName = itemData?.zh || itemData?.en || `Item ${item.netID}`;
  const fullDisplayName = prefixData 
    ? `${prefixData.zh || prefixData.en} ${displayName}` 
    : displayName;

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX + 12,
      y: e.clientY + 12,
    });
  };

  const tooltipContent = isHovered && item.netID > 0 ? (
    <div
      className="fixed pointer-events-none bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl min-w-[240px] z-[1000]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex gap-3 items-start">
        <div className="flex-shrink-0">
          <img
            src={getItemIconUrl(item.netID)}
            alt=""
            className="w-12 h-12 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">
            {fullDisplayName}
          </h3>
          
          {itemData?.zh && itemData?.en && itemData.zh !== itemData.en && (
            <p className="text-xs text-slate-400 mb-2">
              {itemData.en}
            </p>
          )}
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">ID:</span>
              <span className="font-mono">{item.netID}</span>
            </div>
            
            {prefixData && (
              <div className="flex items-center gap-2 text-amber-400">
                <span className="text-slate-500">前缀:</span>
                <span className="font-semibold">
                  {prefixData.zh || prefixData.en}
                  {prefixData.zh && prefixData.en && prefixData.zh !== prefixData.en && (
                    <span className="text-xs text-slate-500 ml-1">
                      ({prefixData.en})
                    </span>
                  )}
                </span>
              </div>
            )}
            
            {item.stack > 1 && (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-slate-500">数量:</span>
                <span className="font-semibold">{item.stack}</span>
              </div>
            )}
            
            {item.favorited && (
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-slate-500">状态:</span>
                <span className="font-semibold">已收藏</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={wrapperRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className="inline-block"
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};
