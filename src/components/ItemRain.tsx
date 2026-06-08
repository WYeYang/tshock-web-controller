import { useEffect, useState, useRef, useMemo } from 'react';
import { ITEM_DATA, getItemIconUrl } from '../data';
import { createPortal } from 'react-dom';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface HoverTooltip {
  id: number;
  x: number;
  y: number;
}

export function ItemRain() {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<HoverTooltip | null>(null);
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
    
    for (let i = 0; i < 100; i++) {
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
  const handleItemMouseEnter = (item: FallingItem, e: React.MouseEvent) => {
    setHoveredId(item.id);
    setTooltip({ id: item.id, x: e.clientX + 15, y: e.clientY + 15 });
  };

  // 鼠标移动
  const handleItemMouseMove = (e: React.MouseEvent) => {
    if (hoveredId) {
      setTooltip({ id: hoveredId, x: e.clientX + 15, y: e.clientY + 15 });
    }
  };

  // 鼠标离开物品
  const handleItemMouseLeave = () => {
    setHoveredId(null);
    setTooltip(null);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 5, pointerEvents: 'none' }}
    >
      {items.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className="absolute"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: `rotate(${item.rotation}deg)`,
            opacity: hoveredId === item.id ? 1 : 0.6,
            zIndex: hoveredId === item.id ? 50 : 1,
            transition: 'transform 0.15s, opacity 0.15s',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => handleItemMouseEnter(item, e)}
          onMouseMove={handleItemMouseMove}
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

      {/* 悬浮提示框 */}
      {tooltip && (() => {
        const itemData = ITEM_DATA[tooltip.id];
        const displayName = itemData?.zh || itemData?.en || `Item ${tooltip.id}`;
        
        return createPortal(
          <div
            className="fixed pointer-events-none bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl min-w-[240px] z-[1000]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0">
                <img
                  src={getItemIconUrl(tooltip.id)}
                  alt=""
                  className="w-12 h-12 object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1">
                  {displayName}
                </h3>
                
                {itemData?.zh && itemData?.en && itemData.zh !== itemData.en && (
                  <p className="text-xs text-slate-400 mb-2">
                    {itemData.en}
                  </p>
                )}
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500">ID:</span>
                    <span className="font-mono">{tooltip.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

    </div>
  );
}
