import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { ITEM_DATA, getItemName, getItemIconUrl } from '../data';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  hovered: boolean;
}

interface ItemTooltipProps {
  itemId: number;
  x: number;
  y: number;
}

export function ItemRain() {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [tooltip, setTooltip] = useState<ItemTooltipProps | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // 随机选择掉落物品
  const selectedItemIds = useMemo(() => {
    const allIds = Object.keys(ITEM_DATA).map(Number);
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 100); // 选择100个不同物品
  }, []);

  // 初始化掉落物品
  useEffect(() => {
    const initialItems: FallingItem[] = [];
    const usedIds = new Set<number>();
    
    for (let i = 0; i < 30; i++) {
      // 选择一个未使用的物品ID
      let itemId: number;
      do {
        itemId = selectedItemIds[Math.floor(Math.random() * selectedItemIds.length)];
      } while (usedIds.has(itemId) && usedIds.size < selectedItemIds.length);
      usedIds.add(itemId);
      
      initialItems.push({
        id: itemId,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.02 + Math.random() * 0.03,
        size: 24 + Math.random() * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        hovered: false,
      });
    }
    setItems(initialItems);
  }, [selectedItemIds]);

  // 动画循环
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (!isPaused) {
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.hovered) return item;
          
          let newY = item.y + (item.speed * deltaTime * 0.05);
          let newRotation = item.rotation + item.rotationSpeed;
          
          // 重置到底部
          if (newY > 110) {
            newY = -10;
            return { ...item, y: newY, rotation: newRotation, x: Math.random() * 100 };
          }
          
          return { ...item, y: newY, rotation: newRotation };
        })
      );
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // 鼠标位置检测
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    let foundHover = false;
    setItems(prevItems => {
      return prevItems.map(item => {
        const dx = mouseX - item.x;
        const dy = mouseY - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = item.size / 2 + 2;
        
        const isHovered = distance < hitRadius && !foundHover;
        if (isHovered) foundHover = true;
        
        if (isHovered && !item.hovered) {
          setTooltip({ itemId: item.id, x: e.clientX, y: e.clientY });
        } else if (!isHovered && item.hovered) {
          setTooltip(null);
        }
        
        return { ...item, hovered: isHovered };
      });
    });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setTooltip(null);
    setItems(prevItems => prevItems.map(item => ({ ...item, hovered: false })));
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      style={{ zIndex: 1 }}
    >
      {items.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className={`absolute transition-opacity ${isPaused ? '' : 'duration-300'}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: item.hovered ? 1 : 0.3,
          }}
        >
          <div 
            className={`
              relative rounded border-2 transition-all
              ${item.hovered 
                ? 'border-cyan-400/60 bg-slate-900/90 shadow-lg shadow-cyan-500/20 scale-110 z-50' 
                : 'border-slate-600/40 bg-slate-900/30'
              }
            `}
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
            }}
          >
            <img
              src={getItemIconUrl(item.id)}
              alt=""
              className="w-full h-full object-contain p-1"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      ))}

      {/* 物品提示框 */}
      {tooltip && (
        <div
          className="fixed z-[1000] pointer-events-none"
          style={{
            left: `${Math.min(tooltip.x + 16, window.innerWidth - 200)}px`,
            top: `${Math.min(tooltip.y + 16, window.innerHeight - 80)}px`,
          }}
        >
          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-lg shadow-xl shadow-cyan-500/10 p-3 min-w-[180px]">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={getItemIconUrl(tooltip.itemId)}
                alt=""
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{getItemName(tooltip.itemId)}</p>
                <p className="text-slate-500 text-xs">ID: {tooltip.itemId}</p>
              </div>
            </div>
            {ITEM_DATA[tooltip.itemId]?.desc && (
              <p className="text-slate-400 text-xs mt-2 border-t border-slate-700/50 pt-2">
                {ITEM_DATA[tooltip.itemId].desc}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 暂停提示 */}
      {isPaused && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 py-2 text-cyan-400 text-sm">
          暂停中 - 移动鼠标查看物品信息
        </div>
      )}
    </div>
  );
}
