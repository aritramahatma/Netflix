import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { setupRoutes } from './routes';

const app = new Hono();

app.use('*', cors());
setupRoutes(app);

export default app;