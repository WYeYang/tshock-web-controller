import { ITEM_DATA, BUFF_DATA, getItemIconUrl as getItemIconUrlFromData, getItemName, getPrefixName } from '../data';

export interface ItemInfo {
  netId: number;
  name: string;
  iconUrl: string;
  tooltip: string;
}

export function getItemInfo(netId: number, prefixId: number = 0): ItemInfo | null {
  const data = ITEM_DATA[netId];
  if (!data) return null;
  
  const name = data.zh || data.en;
  const prefixName = prefixId > 0 ? getPrefixName(prefixId) : undefined;
  const fullName = prefixName ? `${prefixName} ${name}` : name;
  
  let tooltip = `ID: ${netId}`;
  if (data.zh) tooltip += ` | ${data.zh}`;
  if (data.en && data.en !== data.zh) tooltip += ` (${data.en})`;
  
  return {
    netId,
    name: fullName,
    iconUrl: getItemIconUrlFromData(netId),
    tooltip
  };
}

export function getItemIconUrl(netId: number): string {
  return getItemIconUrlFromData(netId);
}

export { getItemName };

export function getItemTooltip(netId: number): string {
  const data = ITEM_DATA[netId];
  if (!data) return `ID: ${netId}`;
  let tooltip = `ID: ${netId}`;
  if (data.zh) tooltip += ` | ${data.zh}`;
  if (data.en && data.en !== data.zh) tooltip += ` (${data.en})`;
  return tooltip;
}

export function getBuffIconUrl(buffId: number): string {
  return `https://terraria.wiki.gg/images/thumb/Buff_${buffId}.png/48px-Buff_${buffId}.png`;
}

export function getItemWikiUrl(netId: number): string {
  return `https://terraria.wiki.gg/wiki/Item_IDs#${netId}`;
}

export function getBuffWikiUrl(buffId: number): string {
  const buffData = BUFF_DATA[buffId];
  if (buffData && buffData.en) {
    const wikiName = buffData.en.replace(/ /g, '_');
    return `https://terraria.wiki.gg/wiki/${wikiName}`;
  }
  return `https://terraria.wiki.gg/wiki/Buff_IDs#${buffId}`;
}
