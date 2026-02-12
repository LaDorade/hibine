import express from 'express';
import { handler } from '../build/handler.js';
import { initServerWebsocket } from './websocket.js';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// websocket
initServerWebsocket(server);

// sveltekit
app.use(handler);

// start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
