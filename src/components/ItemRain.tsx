import { useEffect, useState, useRef, useMemo } from 'react';
import { ITEM_DATA, getItemName, getItemIconUrl } from '../data';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ItemTooltipData {
  itemId: number;
  x: number;
  y: number;
}

export function ItemRain() {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [tooltip, setTooltip] = useState<ItemTooltipData | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // 随机选择掉落物品
  const selectedItemIds = useMemo(() => {
    const allIds = Object.keys(ITEM_DATA).map(Number);
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 500);
  }, []);

  // 初始化掉落物品
  useEffect(() => {
    const initialItems: FallingItem[] = [];
    
    for (let i = 0; i < 150; i++) {
      const itemId = selectedItemIds[i % selectedItemIds.length];
      initialItems.push({
        id: itemId,
        x: Math.random() * (window.innerWidth - 60),
        y: Math.random() * window.innerHeight,
        speed: 0.3 + Math.random() * 0.5,
        size: 36 + Math.random() * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }
    setItems(initialItems);
  }, [selectedItemIds]);

  // 动画循环
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 16.67; // 标准化到60fps
      lastTimeRef.current = timestamp;

      setItems(prevItems => 
        prevItems.map(item => {
          if (hoveredId === item.id) return item;
          
          let newY = item.y + item.speed * deltaTime;
          let newRotation = item.rotation + item.rotationSpeed;
          
          // 重置到底部
          if (newY > window.innerHeight + 50) {
            newY = -50;
            return { 
              ...item, 
              y: newY, 
              rotation: newRotation, 
              x: Math.random() * (window.innerWidth - 60),
              id: selectedItemIds[Math.floor(Math.random() * selectedItemIds.length)]
            };
          }
          
          return { ...item, y: newY, rotation: newRotation };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredId, selectedItemIds]);

  // 鼠标进入物品
  const handleItemMouseEnter = (e: React.MouseEvent, item: FallingItem) => {
    e.stopPropagation();
    setHoveredId(item.id);
    setTooltip({ 
      itemId: item.id, 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  // 鼠标在物品上移动
  const handleItemMouseMove = (e: React.MouseEvent, item: FallingItem) => {
    e.stopPropagation();
    setTooltip({ 
      itemId: item.id, 
      x: e.clientX, 
      y: e.clientY 
    });
  };

  // 鼠标离开物品
  const handleItemMouseLeave = () => {
    setHoveredId(null);
    setTooltip(null);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {items.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className="absolute pointer-events-auto"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: `rotate(${item.rotation}deg)`,
            opacity: hoveredId === item.id ? 1 : 0.6,
            zIndex: hoveredId === item.id ? 50 : 1,
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={(e) => handleItemMouseEnter(e, item)}
          onMouseMove={(e) => handleItemMouseMove(e, item)}
          onMouseLeave={handleItemMouseLeave}
        >
          <div 
            className={`
              relative rounded border-2 cursor-pointer
              ${hoveredId === item.id 
                ? 'border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-500/30 scale-110' 
                : 'border-slate-500/60 bg-slate-900/60'
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
            top: `${Math.min(tooltip.y + 16, window.innerHeight - 100)}px`,
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

      {/* 底部提示 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 py-2 text-cyan-400 text-sm">
        鼠标悬停查看物品信息
      </div>
    </div>
  );
}
