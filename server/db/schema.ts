import { mysqlTable, varchar, int, text, datetime } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    created_by_user_id: varchar("created_by_user_id", { length: 36 }),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
});

export const customers = mysqlTable("customers", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    pdf_generated: varchar("pdf_generated", { length: 255 }),
    signature: varchar("signature", { length: 255 }),
    created_by_user_id: varchar("created_by_user_id", { length: 36 }),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
});

export const serviceReports = mysqlTable("service_reports", {
    id: varchar("id", { length: 36 }).primaryKey(),
    customer_id: varchar("customer_id", { length: 36 }).notNull(),
    date: datetime("date").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    duration: int("duration"),
    created_by_user_id: varchar("created_by_user_id", { length: 36 }),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
});

export const problemReports = mysqlTable("problem_reports", {
    id: varchar("id", { length: 36 }).primaryKey(),
    customer_id: varchar("customer_id", { length: 36 }).notNull(),
    problem: text("problem").notNull(),
    resolution: text("resolution"),
    created_by_user_id: varchar("created_by_user_id", { length: 36 }),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
});

export const partUsedReports = mysqlTable("part_used_reports", {
    id: varchar("id", { length: 36 }).primaryKey(),
    customer_id: varchar("customer_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: int("quantity").notNull(),
    price: int("price").notNull(),
    created_by_user_id: varchar("created_by_user_id", { length: 36 }),
    created_at: datetime("created_at"),
    updated_at: datetime("updated_at"),
});

