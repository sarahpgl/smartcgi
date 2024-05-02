import { SocketState } from '@app/js/components/websocket/SocketState';
import { Listener } from '@app/js/components/websocket/types';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ClientPayloads } from '@shared/client/ClientPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerExceptionResponse } from '@shared/server/types';
import { SetterOrUpdater } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@mantine/notifications';

type EmitOptions<T extends ClientEvents> = {
  event: T;
  data?: ClientPayloads[T];
};

export default class SocketManager {
  public readonly socket: Socket;

  public setSocketState: SetterOrUpdater<SocketState> = () => { };

  private connectionLost: boolean = false;

  constructor() {
    this.socket = io(`${import.meta.env.VITE_API_URL}` /*import.meta.env.API_URL as string*/, {
      autoConnect: false,
      path: '/wsapi',
      transports: ['websocket'],
      withCredentials: true,
    });

    this.onConnect();
    this.onDisconnect();
    this.onException();
  }

  emit<T extends ClientEvents>(options: EmitOptions<T>): this {
    this.socket.emit(options.event, options.data);

    return this;
  }

  getSocketId(): string | null {
    if (!this.socket.connected || !this.socket.id) {
      return null;
    }

    return this.socket.id;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.on(event, listener);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.off(event, listener);

    return this;
  }

  private onConnect(): void {
    this.socket.on('connect', () => {
      if (this.connectionLost) {
        showNotification({
          message: 'Reconnected to server!',
          color: 'green',
          autoClose: 2000,
        });
        this.connectionLost = false;
      }
      if (localStorage.getItem('clientInGameId')) {
        this.emit({
          event: ClientEvents.ClientReconnect,
          data: {
            clientInGameId: localStorage.getItem('clientInGameId')!,
          },
        });
      }
      this.setSocketState((currVal) => {
        return { ...currVal, connected: true };
      });
    });
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', async (reason: Socket.DisconnectReason) => {
      if (reason === 'io client disconnect') {
        showNotification({
          message: 'Disconnected successfully!',
          color: 'green',
          autoClose: 2000,
        });
      }

      if (reason === 'io server disconnect') {
        showNotification({
          message: 'You got disconnect by server',
          color: 'orange',
          autoClose: 3000,
        });
      }

      if (reason === 'ping timeout' || reason === 'transport close' || reason === 'transport error') {
        showNotification({
          message: 'Connection lost to the server',
          color: 'orange',
          autoClose: 3000,
        });
        this.connectionLost = true;
      }

      this.setSocketState((currVal) => {
        return { ...currVal, connected: false };
      });
    });
  }

  private onException(): void {
    this.socket.on('exception', (data: ServerExceptionResponse) => {
      if (typeof data.exception === 'undefined') {
        showNotification({
          message: 'Unexpected error from server',
          color: 'red',
        });

        return;
      }

      let body = `Error: ${data.exception}`;

      if (data.message) {
        if (typeof data.message === 'string') {
          body += ` | Message: "${data.message}"`;
        } else if (typeof data.message === 'object') {
          body += ` | Message: "${JSON.stringify(data.message)}"`;
        }
      }

      showNotification({
        message: body,
        color: 'red',
      });
      console.error(`Error ${data.exception}`, `Message: ${data.message}`);
    });
  }
}
