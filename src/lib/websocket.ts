import ioClient, {Socket} from 'socket.io-client';

import { createSubscriber } from 'svelte/reactivity';
import { browser } from '$app/environment';
import { page } from '$app/state';
import { getFileTree } from './remotes/files.remote';

import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { ClientToServerEvents, ServerClientEvents } from '$types/socket';

let clientSocket: ClientSocket | null = null;
export function getSocket(core: CoreAPI) {
  if (!browser) return null;
	
  if (!clientSocket) {
    const { protocol, host } = window.location;
    const url = `${protocol}//${host}`;

    const tape = page.params.tape;
    if (!tape) {
      console.warn('Could not find tape name');
      return null;
    };

    const socket = ioClient(url, {extraHeaders: {
      'x-tape-name': tape
    }});
    clientSocket = new ClientSocket(
      core,
      socket,
    );
  } else if (!clientSocket.socket.connected) {
    clientSocket.socket.connect();
  }
  return clientSocket;
}

class ClientSocket {
  #socket;
  #subscribe;

  constructor(
		private core: CoreAPI,
		socket: Socket<ServerClientEvents, ClientToServerEvents>,
  ) {
    this.#socket = socket;

    this.#subscribe = createSubscriber((update) => {
      socket.on('connect', update);
      socket.on('disconnect', update);
      socket.on('users-on-file', ({file, usersNb}: {file: string, usersNb: number}) => {
        if (file === this.core.activeTab?.id && this.core.activeTabInfos) {
          this.core.activeTabInfos.usersNb = usersNb;
        }
        update();
      });
      socket.on('remoteModification', async (modifications) => {
        await getFileTree().refresh();
        await this.core.syncStates(modifications, 'socket');
      });
    });
  }

  get socket() {
    this.#subscribe();

    return this.#socket;
  }
}

export type {ClientSocket};