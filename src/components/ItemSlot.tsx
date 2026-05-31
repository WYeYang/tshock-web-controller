import { getItemIconUrl, getItemWikiUrl } from '../utils/terraria';
import type { InventoryItem } from '../types/tshock';
import { ItemTooltip } from './ItemTooltip';
import { useState } from 'react';

interface ItemSlotProps {
  item: InventoryItem;
}

export const ItemSlot = ({ item }: ItemSlotProps) => {
  const [imageError, setImageError] = useState(false);

  if (item.netID === 0) {
    return (
      <div className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded flex items-center justify-center">
      </div>
    );
  }

  return (
    <ItemTooltip item={item}>
      <a
        href={getItemWikiUrl(item.netID)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-slate-800/70 border border-slate-700/70 rounded flex items-center justify-center relative hover:border-slate-500 transition-colors cursor-pointer"
      >
        {!imageError && (
          <img
            key={item.netID} // 添加 key 确保重新渲染
            src={getItemIconUrl(item.netID)}
            alt={`Item ${item.netID}`}
            className="w-7 h-7 object-contain"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        {item.stack > 1 && (
          <span className="absolute bottom-0 right-0 text-xs font-bold text-white bg-slate-900/80 px-1 rounded-tl">
            {item.stack}
          </span>
        )}
        {item.prefix > 0 && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
        )}
        {item.favorited && (
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </a>
    </ItemTooltip>
  );
};
