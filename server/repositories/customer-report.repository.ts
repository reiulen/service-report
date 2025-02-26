import { RowDataPacket } from "mysql2";
import { MySql2Database, MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { randomUUID } from "crypto";
import moment from "moment";
import { CustomerReportInput } from "@/types/report";

class CustomerReportRepository {
  async findAll(db: MySql2Database<any>, query: any) {
    const {
      keyword,
      date,
      page = 1,
      limit = 10,
      orderBy = "created_at",
      orderDirection = "DESC",
    } = query;

    const conditions: string[] = [];
    const validColumns = ["name", "created_at"];

    if (keyword) {
      const keywordLower = `%${keyword.toLowerCase()}%`;
      conditions.push(
        `(LOWER(name) LIKE '${keywordLower}' 
            OR LOWER(address) LIKE '${keywordLower}' 
            OR LOWER(phone) LIKE '${keywordLower}' 
            OR LOWER(email) LIKE '${keywordLower}')`
      );
    }

    if (date) {
      conditions.push(`DATE(created_at) = '${date}'`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
    const orderByColumn = validColumns.includes(orderBy)
      ? orderBy
      : "created_at";
    const orderDirectionValue =
      orderDirection.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const offset = (page - 1) * limit;

    const totalDataQuery = `
        SELECT COUNT(*) as total FROM customers ${whereClause}
      `;
    const [totalRows] = await db.execute(totalDataQuery);
    const totalData = Array.isArray(totalRows) ? totalRows?.[0]?.total : 0;

    const customersQuery = `
        SELECT * FROM customers 
        ${whereClause}
        ORDER BY ${orderByColumn} ${orderDirectionValue}
        LIMIT ${limit} OFFSET ${offset}
      `;
    const [rows] = await db.execute(customersQuery);

    return [rows, totalData];
  }

  async findOne(db: MySql2Database<any>, id: string) {
    const [rows]: MySqlRawQueryResult = await db.execute<RowDataPacket>(
      `SELECT * FROM customers WHERE id = '${id}'`
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return null;
  }

  async createCustomerReport(
    db: MySql2Database<any>,
    data: CustomerReportInput
  ): Promise<RowDataPacket | null> {
    const uuid = randomUUID();
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

    await db.execute(
      `INSERT INTO 
        customers (id, name, address, phone, email, signature, created_by_user_id, created_at)
        VALUES (
            '${uuid}',
            '${data.name}',
            '${data.address}',
            '${data.phone ?? ""}',
            '${data.email}',
            '${data.signature ?? ""}',
            '${data.created_by_user_id ?? ""}',
            '${created_at}'
        )`
    );

    const result = await this.findOne(db, uuid);
    return result ?? null;
  }

  async updateCustomerReport(
    db: MySql2Database<any>,
    id: string,
    data: Partial<CustomerReportInput | any>
  ): Promise<RowDataPacket | null> {
    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
    
    const updates: string[] = [];
    
    for (const key in data) {
      if (data[key] !== undefined) {
        updates.push(`${key} = '${data[key]}'`);
      }
    }
    
    if (updates.length === 0) return this.findOne(db, id);
    
    updates.push(`updated_at = '${updated_at}'`);
    
    const query = `UPDATE customers SET ${updates.join(", ")} WHERE id = '${id}'`;
    
    await db.execute(query);
    
    return this.findOne(db, id);
  }
}

export default new CustomerReportRepository();
