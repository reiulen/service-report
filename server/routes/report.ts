import { Hono } from "hono";


export const reportRoutes = new Hono()

reportRoutes.get('/reports', (c) => {
    return c.json({ message: 'Get all reports' })
})