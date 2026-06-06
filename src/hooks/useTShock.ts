import { useState, useCallback } from 'react';
import { TShockApi } from '../services/tshockApi';
import { useConfig } from './useConfig';
import type { ServerStatus, Player, CommandResult, ServerInfo, BanRecord, Group, User } from '../types/tshock';

export const useTShock = () => {
  const { updateTshockConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const getApi = useCallback((): TShockApi => {
    // 每次都返回新实例，直接从 localStorage 读取最新配置
    return new TShockApi();
  }, []);

  const handleRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await request();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getServerStatus = useCallback(async (): Promise<ServerStatus> => {
    const api = getApi();
    return handleRequest(() => api.getServerStatus());
  }, [getApi, handleRequest]);

  const getPlayers = useCallback(async (): Promise<Player[]> => {
    const api = getApi();
    return handleRequest(() => api.getPlayers());
  }, [getApi, handleRequest]);

  const executeCommand = useCallback(async (cmd: string): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.executeCommand(cmd));
  }, [getApi, handleRequest]);

  const getServerInfo = useCallback(async (): Promise<ServerInfo> => {
    const api = getApi();
    return handleRequest(() => api.getServerInfo());
  }, [getApi, handleRequest]);

  const kickPlayer = useCallback(async (username: string, reason?: string): Promise<any> => {
    const api = getApi();
    return handleRequest(() => api.kickPlayer(username, reason));
  }, [getApi, handleRequest]);

  const banPlayer = useCallback(async (username: string, reason?: string): Promise<any> => {
    const api = getApi();
    return handleRequest(() => api.banPlayer(username, reason));
  }, [getApi, handleRequest]);

  const getPlayerDetails = useCallback(async (playerName: string): Promise<Player> => {
    const api = getApi();
    return handleRequest(() => api.getPlayerDetails(playerName));
  }, [getApi, handleRequest]);

  const banMultipleIdentifiers = useCallback(async (identifiers: string[], reason?: string): Promise<any[]> => {
    const api = getApi();
    return handleRequest(() => api.banMultipleIdentifiers(identifiers, reason));
  }, [getApi, handleRequest]);

  const getBanList = useCallback(async (): Promise<BanRecord[]> => {
    const api = getApi();
    return handleRequest(() => api.getBanList());
  }, [getApi, handleRequest]);

  const unbanPlayer = useCallback(async (ticketNumber: number, fullDelete: boolean = true): Promise<any> => {
    const api = getApi();
    return handleRequest(() => api.unbanPlayer(ticketNumber, fullDelete));
  }, [getApi, handleRequest]);

  const getUsers = useCallback(async (): Promise<any> => {
    const api = getApi();
    return handleRequest(() => api.getUsers());
  }, [getApi, handleRequest]);

  const getUserInfo = useCallback(async (user: string, type: 'name' | 'id' = 'name'): Promise<any> => {
    const api = getApi();
    return handleRequest(() => api.getUserInfo(user, type));
  }, [getApi, handleRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const registerUser = useCallback(async (username: string, password: string) => {
    const api = getApi();
    return handleRequest(() => api.registerUser(username, password));
  }, [getApi, handleRequest]);

  const loginUser = useCallback(async (username: string, password: string) => {
    const api = getApi();
    return handleRequest(() => api.loginUser(username, password));
  }, [getApi, handleRequest]);

  const mutePlayer = useCallback(async (playerName: string, reason?: string): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.mutePlayer(playerName, reason));
  }, [getApi, handleRequest]);

  const unmutePlayer = useCallback(async (playerName: string): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.unmutePlayer(playerName));
  }, [getApi, handleRequest]);

  const teleportPlayer = useCallback(async (playerName: string, x: number, y: number): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.teleportPlayer(playerName, x, y));
  }, [getApi, handleRequest]);

  const teleportToPlayer = useCallback(async (targetPlayer: string): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.teleportToPlayer(targetPlayer));
  }, [getApi, handleRequest]);

  const changeGroup = useCallback(async (playerName: string, groupName: string): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.changeGroup(playerName, groupName));
  }, [getApi, handleRequest]);

  const giveItem = useCallback(async (playerName: string, itemName: string, amount: number = 1): Promise<CommandResult> => {
    const api = getApi();
    return handleRequest(() => api.giveItem(playerName, itemName, amount));
  }, [getApi, handleRequest]);

  const fetchAndSaveToken = useCallback(async (username: string, password: string, serverUrl?: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const api = new TShockApi();
      const token = await api.getToken(username, password);
      const updateData: any = { token };
      if (serverUrl) {
        updateData.serverUrl = serverUrl;
      }
      updateTshockConfig(updateData);

      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取Token失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateTshockConfig]);

  const fetchGroups = useCallback(async (): Promise<Group[]> => {
    setLoadingGroups(true);
    try {
      const api = getApi();
      const groupsData = await api.getGroups();
      setGroups(groupsData);
      return groupsData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户组列表失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingGroups(false);
    }
  }, [getApi]);

  const fetchGroup = useCallback(async (groupName: string): Promise<Group> => {
    const api = getApi();
    return handleRequest(() => api.getGroup(groupName));
  }, [getApi, handleRequest]);

  const createNewGroup = useCallback(async (groupName: string, parent?: string, permissions?: string[], chatcolor?: string): Promise<any> => {
    const api = getApi();
    const result = await handleRequest(() => api.createGroup(groupName, parent, permissions, chatcolor));
    await fetchGroups();
    return result;
  }, [getApi, handleRequest, fetchGroups]);

  const updateExistingGroup = useCallback(async (groupName: string, parent?: string, permissions?: string[], chatcolor?: string): Promise<any> => {
    const api = getApi();
    const result = await handleRequest(() => api.updateGroup(groupName, parent, permissions, chatcolor));
    await fetchGroups();
    return result;
  }, [getApi, handleRequest, fetchGroups]);

  const deleteExistingGroup = useCallback(async (groupName: string): Promise<any> => {
    const api = getApi();
    const result = await handleRequest(() => api.deleteGroup(groupName));
    await fetchGroups();
    return result;
  }, [getApi, handleRequest, fetchGroups]);

  const fetchUsers = useCallback(async (): Promise<User[]> => {
    setLoadingUsers(true);
    try {
      const api = getApi();
      const usersData = await api.getUserList();
      setUsers(usersData);
      return usersData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户列表失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingUsers(false);
    }
  }, [getApi]);

  return {
    loading,
    error,
    getServerStatus,
    getPlayers,
    executeCommand,
    getServerInfo,
    kickPlayer,
    banPlayer,
    getPlayerDetails,
    banMultipleIdentifiers,
    getBanList,
    unbanPlayer,
    getUsers,
    getUserInfo,
    registerUser,
    loginUser,
    clearError,
    fetchAndSaveToken,
    mutePlayer,
    unmutePlayer,
    teleportPlayer,
    teleportToPlayer,
    changeGroup,
    giveItem,
    groups,
    users,
    loadingGroups,
    loadingUsers,
    fetchGroups,
    fetchGroup,
    createNewGroup,
    updateExistingGroup,
    deleteExistingGroup,
    fetchUsers,
  };
};
