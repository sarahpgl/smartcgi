import { ServerEvents } from './ServerEvents';
import { CardStateDefinition } from '../common/types';

export type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };
};