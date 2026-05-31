export function getItemIconUrl(netId: number): string {
  return `https://terraria.wiki.gg/images/thumb/${getItemIconPath(netId)}/32px-${getItemIconPath(netId)}`;
}

export function getBuffIconUrl(buffId: number): string {
  return `https://terraria.wiki.gg/images/thumb/${getBuffIconPath(buffId)}/32px-${getBuffIconPath(buffId)}`;
}

export function getItemWikiUrl(netId: number): string {
  return `https://terraria.wiki.gg/wiki/Item_IDs#${netId}`;
}

export function getBuffWikiUrl(buffId: number): string {
  return `https://terraria.wiki.gg/wiki/Buff_IDs#${buffId}`;
}

function getItemIconPath(netId: number): string {
  return `Item_${netId}.png`;
}

function getBuffIconPath(buffId: number): string {
  return `Buff_${buffId}.png`;
}
