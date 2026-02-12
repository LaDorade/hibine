import ioClient, {Socket} from 'socket.io-client';

import { createSubscriber } from 'svelte/reactivity';
import { browser, dev } from '$app/environment';
import type { CoreAPI } from '$core/CoreAPI.svelte';

let socket: ClientSocket | null = null;
export function getSocket(core: CoreAPI) {
  if (!browser) return null;
	
  if (!socket) {
    const port = dev ? 5173 : 3000; // todo: get from env ?
    const { protocol, hostname } = window.location;
    const url = `${protocol}//${hostname}`;
    const iosocket = ioClient(`${url}:${port}`);
    socket = new ClientSocket(iosocket, core);
  }
  return socket;
}

export class ClientSocket {
  #socket;
  #subscribe;

  constructor(socket: Socket, private core: CoreAPI) {
    this.#socket = socket;

    this.#subscribe = createSubscriber((update) => {
      socket.on('connect', update);
      socket.on('disconnect', update);
      socket.on('users-on-file', ({file, usersNb}: {file: string, usersNb: number}) => {
        if (file === this.core.activeTab?.id) {
          this.core.activeTabUsers = usersNb;
        }
        update();
      });
    });
  }

  get socket() {
    this.#subscribe();

    return this.#socket;
  }
}