export interface ItemData {
  en: string;
  zh: string;
  desc?: string;
}

export interface PrefixData {
  en: string;
  zh: string;
  stats?: Record<string, string | number>;
}

export interface BuffData {
  en: string;
  zh: string;
  type?: 'buff' | 'debuff' | 'pet';
}

import itemsJson from './items.json' with { type: 'json' };
import prefixesJson from './prefixes.json' with { type: 'json' };
import buffsJson from './buffs.json' with { type: 'json' };

export const ITEM_DATA: Record<number, ItemData> = itemsJson as Record<number, ItemData>;
export const PREFIX_DATA: Record<number, PrefixData> = prefixesJson as Record<number, PrefixData>;
export const BUFF_DATA: Record<number, BuffData> = buffsJson as Record<number, BuffData>;

export function getItemName(netId: number): string | undefined {
  const data = ITEM_DATA[netId];
  if (!data) return undefined;
  return data.zh || data.en;
}

export function getItemIconUrl(netId: number): string {
  const data = ITEM_DATA[netId];
  if (data && data.en) {
    const formattedName = data.en.replace(/\s+/g, '_');
    return `https://terraria.wiki.gg/images/${formattedName}.png`;
  }
  return '';
}

export function getPrefixName(prefixId: number): string | undefined {
  const data = PREFIX_DATA[prefixId];
  if (!data) return undefined;
  return data.zh || data.en;
}

export function getBuffName(buffId: number): string | undefined {
  const data = BUFF_DATA[buffId];
  if (!data) return undefined;
  return data.zh || data.en;
}

export function getBuffType(buffId: number): 'buff' | 'debuff' | 'pet' | undefined {
  const data = BUFF_DATA[buffId];
  if (!data) return undefined;
  return data.type;
}

export interface ItemTooltipInfo {
  netId: number;
  prefixId: number;
  name: string;
  prefixName?: string;
  fullName: string;
  iconUrl: string;
}

export function getItemTooltipInfo(netId: number, prefixId: number = 0): ItemTooltipInfo | null {
  const data = ITEM_DATA[netId];
  if (!data) return null;
  
  const name = data.zh || data.en;
  const prefixName = prefixId > 0 ? getPrefixName(prefixId) : undefined;
  const fullName = prefixName ? `${prefixName} ${name}` : name;
  
  return {
    netId,
    prefixId,
    name,
    prefixName,
    fullName,
    iconUrl: getItemIconUrl(netId)
  };
}
