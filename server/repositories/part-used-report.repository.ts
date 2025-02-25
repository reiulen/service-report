import { RowDataPacket } from "mysql2";
import { MySql2Database, MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { randomUUID } from "crypto";
import moment from "moment";
import { PartUsedReportInput } from "@/types/report";

class PartUsedReportRepository {
  async findAll(db: MySql2Database<any>) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM part_used_reports`
    );

    return rows;
  }

  async findOne(db: MySql2Database<any>, id: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket>(
      `SELECT * FROM part_used_reports WHERE id = '${id}'`
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return null;
  }

  async findWhere(db: MySql2Database<any>, where: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM part_used_reports WHERE ${where}`
    );

    return Array.isArray(rows) ? rows : []
  }

  async createPartUsedReport(db: MySql2Database<any>, data: PartUsedReportInput[]): Promise<RowDataPacket[] | []> {
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

    const uuidCreated: string[] = [];
    const values = data.map(part => {
      const uuid = randomUUID();
      uuidCreated.push(uuid);
      return `('${uuid}', '${part.customer_id}', '${part.name}', '${part.quantity ?? 0}', '${part.price ?? 0}', '${part.created_by_user_id ?? ""}', '${created_at}')`;
    }).join(", ");

    await db.execute(
      `INSERT INTO 
        part_used_reports (id, customer_id, name, quantity, price, created_by_user_id, created_at)
        VALUES ${values}`
    );

    const result = await this.findWhere(db, `id IN ('${uuidCreated.join("', '")}')`);

    return Array.isArray(result) ? result : [];
  }
}

export default new PartUsedReportRepository();
