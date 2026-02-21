import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';

import {initServerWebsocket} from './server/websocket.js';

import type {HttpServer, Plugin} from 'vite';

export const webSocketServer: () => Plugin = () => {
  return {
    name: 'webSocketServer',
    configureServer(server: {httpServer: HttpServer | null}) {
      initServerWebsocket(server.httpServer);
    }
  };
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    lucidePreprocess(),
    webSocketServer()
  ],
});
