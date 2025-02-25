import { RowDataPacket } from "mysql2";
import { MySql2Database, MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { randomUUID } from "crypto";
import moment from "moment";
import { ProblemReportInput } from "@/types/report";

class ProblemReportRepository {
  async findAll(db: MySql2Database<any>) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM problem_reports`
    );

    return rows;
  }

  async findWhere(db: MySql2Database<any>, where: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket[]>(
      `SELECT * FROM problem_reports WHERE ${where}`
    );

    return Array.isArray(rows) ? rows : []
  }

  async findOne(db: MySql2Database<any>, id: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket>(
      `SELECT * FROM problem_reports WHERE id = '${id}'`
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return null;
  }

  async createProblemReport(db: MySql2Database<any>, data: ProblemReportInput): Promise<RowDataPacket | null> {
    const uuid = randomUUID();
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

    await db.execute(
      `INSERT INTO 
            problem_reports (id, customer_id, problem, resolution, created_by_user_id, created_at)
            VALUES (
                '${uuid}',
                '${data.customer_id}',
                '${data.problem}',
                '${data.resolution ?? ""}',
                '${data.created_by_user_id ?? ""}',
                '${created_at}'
            )`
    );

    const result = await this.findOne(db, uuid);

    return result;
  }
}

export default new ProblemReportRepository();
