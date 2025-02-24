import { Hono } from 'hono'
import { reportRoutes } from './routes/report'

export const app = new Hono().basePath('/api')

app.route('/reports', reportRoutes)
