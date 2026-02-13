import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import {initServerWebsocket} from './server/websocket.js';

import type {HttpServer} from 'vite';

export const webSocketServer = {
  name: 'webSocketServer',
  configureServer(server: {httpServer: HttpServer | null}) {
    initServerWebsocket(server.httpServer);
  }
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    webSocketServer
  ],
});
