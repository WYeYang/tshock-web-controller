export interface ServerStatus {
  name: string;
  port: number;
  playercount: number;
  maxplayers: number;
  world: string;
  uptime: string;
  serverpassword: boolean;
  players: Player[];
}

export interface InventoryItem {
  netID: number;
  prefix: number;
  stack: number;
  favorited: boolean;
}

export interface PlayerItems {
  inventory: InventoryItem[];
  equipment: InventoryItem[];
  dyes: InventoryItem[];
  piggy: InventoryItem[];
  safe: InventoryItem[];
  forge: InventoryItem[];
}

export interface Player {
  nickname: string;
  username: string | null;
  group: string;
  active?: boolean;
  state?: number;
  team?: number;
  ip?: string;
  uuid?: string;
  registered?: string | null;
  muted?: boolean;
  position?: string;
  inventory?: string;
  armor?: string;
  dyes?: string;
  buffs?: string;
  items?: PlayerItems;
}

export interface BanRecord {
  ticket_number: number;
  identifier: string;
  reason: string;
  banning_user: string;
  start_date_ticks: number;
  end_date_ticks: number;
}

export interface CommandResult {
  status: string;
  response: string | string[];
  error: string;
}

export interface ServerInfo {
  name: string;
  serverversion: string;
  tshockversion: string;
  api: number;
  port: number;
  playercount: number;
  maxplayers: number;
  world: string;
  uptime: string;
  serverpassword: boolean;
}

export interface Group {
  name: string;
  parent: string;
  permissions: string[];
  chatcolor: string;
  prefix?: string;
  suffix?: string;
}

export interface User {
  name: string;
  group: string;
  id?: number;
  ip?: string;
  uuid?: string;
  registered?: string;
}

export interface ApiResponse<T> {
  status: string;
  response: T;
  error: string;
}
