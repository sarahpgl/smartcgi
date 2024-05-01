import { atom } from 'recoil';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';

export const CurrentLobbyState = atom<ServerPayloads[ServerEvents.LobbyState] | null>({
  key: 'CurrentLobbyState',
  default: null,
});

export const CurrentGameState = atom<ServerPayloads[ServerEvents.GameState] | null>({
  key: 'CurrentGameState',
  default: null,
});