import { useState } from 'react';
import { getBuffIconUrl, getBuffWikiUrl } from '../utils/terraria';
import { getBuffName, getBuffType, BUFF_DATA } from '../data';

interface BuffSlotProps {
  buffId: number;
  timeLeft?: string;
}

export const BuffSlot = ({ buffId, timeLeft }: BuffSlotProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (buffId === 0) {
    return (
      <div className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded flex items-center justify-center">
      </div>
    );
  }

  const buffName = getBuffName(buffId);
  const buffType = getBuffType(buffId);
  const buffData = BUFF_DATA[buffId];
  const isUnknown = !buffName;

  return (
    <div className="relative">
      <a
        href={getBuffWikiUrl(buffId)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-slate-800/70 border border-slate-700/70 rounded flex items-center justify-center relative hover:border-slate-500 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img
          src={getBuffIconUrl(buffId)}
          alt={buffName || `Buff ${buffId}`}
          className="w-8 h-8 object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {timeLeft && (
          <span className="absolute bottom-0 right-0 text-xs font-bold text-white bg-slate-900/80 px-1 rounded-tl">
            {timeLeft}
          </span>
        )}
      </a>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg whitespace-nowrap z-50">
          <div className={`text-sm font-bold ${
            isUnknown ? 'text-slate-400' :
            buffType === 'debuff' ? 'text-red-400' : 
            buffType === 'pet' ? 'text-yellow-400' : 
            buffType === 'mount' ? 'text-blue-400' : 
            buffType === 'summon' ? 'text-purple-400' : 
            'text-green-400'
          }`}>
            {buffName || `Buff ${buffId}`}
          </div>
          {buffData?.zhDesc && (
            <div className="text-xs text-slate-300 mt-1 max-w-xs">
              {buffData.zhDesc}
            </div>
          )}
          {!buffData?.zhDesc && buffData?.desc && (
            <div className="text-xs text-slate-400 mt-1 max-w-xs">
              {buffData.desc}
            </div>
          )}
          <div className="text-xs text-slate-400 mt-1">
            ID: {buffId}
          </div>
        </div>
      )}
    </div>
  );
};
