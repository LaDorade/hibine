import express from 'express';
import { createServer } from 'http';
import { initServerWebsocket } from './setupSocket.ts';

const app = express();
const server = createServer(app);

// websocket
initServerWebsocket(server);

// sveltekit
const handler = (await import('../build/handler.js')).handler; // dynamic import to avoid loading sveltekit server hooks before websocket server init
app.use(handler);

// start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
