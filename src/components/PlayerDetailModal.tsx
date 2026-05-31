import { useState } from 'import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
importimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | nullimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) =>import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMuteimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Playerimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player:import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player:import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventoryimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalPropsimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventoryimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' |import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyesimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[]import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[]import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2)import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId >import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i +import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <Itemimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 zimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-borderimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:maximport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[9import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div classNameimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justifyimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xlimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 fleximport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold textimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="textimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 smimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slateimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div classNameimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <divimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-1import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mbimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lgimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid gridimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 smimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">昵称import { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">昵称</p>
                  <p className="text-white font-medium text-sm sm:text-base truncate">{displayimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">昵称</p>
                  <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.nickname}</p>
                </div>
                <div className="bg-slateimport { useState } from 'react';
import type { Player, InventoryItem } from '../types/tshock';
import { ItemSlot } from './ItemSlot';
import { BuffSlot } from './BuffSlot';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlayer: Player | null;
  playerDetail: Player | null;
  loadingDetail: boolean;
  onKick?: (player: Player) => void;
  onBan?: (player: Player) => void;
  onMute?: (player: Player) => void;
  onUnmute?: (player: Player) => void;
  onChangeGroup?: (player: Player) => void;
  onGiveItem?: (player: Player) => void;
  onClearInventory?: (player: Player) => void;
  onClearArmor?: (player: Player) => void;
  onClearBuffs?: (player: Player) => void;
}

export const PlayerDetailModal = ({
  isOpen,
  onClose,
  selectedPlayer,
  playerDetail,
  loadingDetail,
  onKick,
  onBan,
  onMute,
  onUnmute,
  onChangeGroup,
  onGiveItem,
  onClearInventory,
  onClearArmor,
  onClearBuffs
}: PlayerDetailModalProps) => {
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'equipment' | 'dyes' | 'piggy' | 'safe' | 'forge'>('inventory');
  
  if (!isOpen) return null;
  const displayPlayer = playerDetail || selectedPlayer;
  if (!displayPlayer) return null;

  const tabs = [
    { key: 'inventory', label: '背包' },
    { key: 'equipment', label: '装备' },
    { key: 'dyes', label: '染料' },
    { key: 'piggy', label: '猪猪存钱罐' },
    { key: 'safe', label: '保险箱' },
    { key: 'forge', label: '熔炉' },
  ];

  const parseBuffString = (buffString: string): { buffId: number; timeLeft: string }[] => {
    const buffs: { buffId: number; timeLeft: string }[] = [];
    const parts = buffString.split(',').map(s => s.trim());
    
    for (let i = 0; i < parts.length; i += 2) {
      const buffId = parseInt(parts[i]);
      if (buffId > 0) {
        const timeLeft = parts[i + 1] ? `${parts[i + 1]}s` : '';
        buffs.push({ buffId, timeLeft });
      }
    }
    
    return buffs;
  };

  const renderItemGrid = (items: InventoryItem[], gridCols: number = 10) => {
    return (
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <ItemSlot key={index} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 lg:pl-[280px]">
      <div className="glass-card neon-border p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-cyan-400 text-lg sm:text-xl">👤</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{displayPlayer.nickname}</h2>
              <p className="text-slate-400 text-xs sm:text-sm">玩家详情</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex-shrink-0">
            ✕
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                基本信息
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/50">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">昵称</p>
                  <p className="text-white font-medium text-sm sm:text-base truncate">{displayPlayer.nickname}</p>
                </div>
                <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate