import { getBuffIconUrl, getBuffWikiUrl } from '../utils/terraria';

interface BuffSlotProps {
  buffId: number;
  timeLeft?: string;
}

export const BuffSlot = ({ buffId, timeLeft }: BuffSlotProps) => {
  if (buffId === 0) {
    return (
      <div className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded flex items-center justify-center">
      </div>
    );
  }

  return (
    <a
      href={getBuffWikiUrl(buffId)}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-slate-800/70 border border-slate-700/70 rounded flex items-center justify-center relative hover:border-slate-500 transition-colors"
    >
      <img
        src={getBuffIconUrl(buffId)}
        alt={`Buff ${buffId}`}
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
  );
};
