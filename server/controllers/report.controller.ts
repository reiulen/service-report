import { Context } from "hono";
import { errorResponse, successResponse } from "../utils/response.util";
import { customerReportSchema } from "../schemas/report.schema";
import reportService from "../services/report.service";

class ReportController {
  async getReports(c: Context) {
    try {
      const query = c.req.query();
      const db = c.get("db");

      const reports = await reportService.getReports(db, query);

      return c.json(reports.response, 200);
    } catch (error) {
      return c.json(
        errorResponse(`${(error as Error).message || "An error occurred"}`),
        500
      );
    }
  }

  async validateCustomer(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const db = c.get("db");

      const validateCustomer = await reportService.validateCustomer(db, body);
      if (validateCustomer.status === false) {
        return c.json(
         validateCustomer.response,
          400
        );
      }

      return c.json(validateCustomer.response, 200);
    } catch (error) {
      return c.json(
        errorResponse(`${(error as Error).message || "An error occurred"}`),
        500
      );
    }
  }

  async generateReport(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      const db = c.get("db");

      const validateCustomer = await reportService.validateCustomer(db, body.customer);
      if (validateCustomer.status === false) {
        return c.json(
         validateCustomer.response,
          400
        );
      }

      const generateReport = await reportService.generateReport(db, body);
      if (generateReport.status === false) {
        return c.json(
         generateReport.response,
          400
        );
      }

      return c.json(successResponse("Report generated successfully", generateReport.response), 200);
    } catch (error) {
      return c.json(
        errorResponse(`${(error as Error).message || "An error occurred"}`),
        500
      );
    }
  }
}

export default new ReportController();
