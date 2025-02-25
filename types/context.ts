import { db } from '@/server/db';

export type ContextVariables = {
    db: typeof db;
};
