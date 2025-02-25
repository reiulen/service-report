import { RowDataPacket } from "mysql2";
import { MySql2Database, MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { randomUUID } from "crypto";
import moment from "moment";
import {
  ServiceReportInput,
} from "@/types/report";

class ServiceRepository {
  async findAll(db: MySql2Database<any>) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM service_reports`
    );

    return Array.isArray(rows) ? rows : []
  }

  async findWhere(db: MySql2Database<any>, where: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM service_reports WHERE ${where}`
    );

    return Array.isArray(rows) ? rows : []
  }

  async findOne(db: MySql2Database<any>, id: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket>(
      `SELECT * FROM service_reports WHERE id = '${id}'`
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return null;
  }

  async createServiceReport(db: MySql2Database<any>, data: ServiceReportInput): Promise<RowDataPacket | null> {
    const uuid = randomUUID();
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

    await db.execute(
      `INSERT INTO 
        service_reports (id, customer_id, date, type, duration, created_by_user_id, created_at)
        VALUES (
            '${uuid}',
            '${data.customer_id}',
            '${data.date}',
            '${data.type}',
            '${data.duration ?? 0}',
            '${data.created_by_user_id ?? ""}',
            '${created_at}'
        )`
    );

    const result = await this.findOne(db, uuid);

    return result;
  }
}

export default new ServiceRepository();
