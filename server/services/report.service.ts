import {
  CustomerReportInput,
  PartUsedReportInput,
  GenerateReportInput,
  CustomerReport,
} from "@/types/report";
import { db, db as dbConnection } from "../db";
import { errorResponse, successResponse } from "../utils/response.util";
import { eq, or } from "drizzle-orm";
import { customers } from "../db/schema";
import { customerReportSchema } from "../schemas/report.schema";
import customerReportRepository from "../repositories/customer-report.repository";
import serviceReportRepository from "../repositories/service-report.repository";
import problemReportRepository from "../repositories/problem-report.repository";
import partUsedReportRepository from "../repositories/part-used-report.repository";

class ReportService {
  async getReports(db: typeof dbConnection, query: any) {
    const customerReports = await customerReportRepository.findAll(db, query);
    const collectCustomerIds = customerReports.map((report) => report.id);

    const serviceReports = await serviceReportRepository.findWhere(
      db,
      `customer_id IN ('${collectCustomerIds.join("', '")}')`
    );
    const findService = new Map(
      serviceReports.map((report) => [report.customer_id, report])
    );

    const problemReports = await problemReportRepository.findWhere(
      db,
      `customer_id IN ('${collectCustomerIds.join("', '")}')`
    );
    const findProblem = new Map(
      problemReports.map((report) => [report.customer_id, report])
    );

    const partUsedReports = await partUsedReportRepository.findWhere(
      db,
      `customer_id IN ('${collectCustomerIds.join("', '")}')`
    );
    const findPartUsed = new Map(
      partUsedReports.map((report) => [report.customer_id, report])
    );

    const reportsAll = customerReports.map((report) => {
      report.service = findService.get(report.id);
      report.problem = findProblem.get(report.id);
      report.partsUsed = findPartUsed.get(report.id);
      return report;
    });

    return {
      status: true,
      response: reportsAll,
    };
  }

  async validateCustomer(db: typeof dbConnection, body: CustomerReportInput) {
    const findCustomerDuplicate = await db.query.customers.findFirst({
      where: or(
        eq(customers.email, body.email ?? ""),
        eq(customers.phone, body.phone ?? "")
      ),
    });

    if (findCustomerDuplicate) {
      const emailDuplicate = findCustomerDuplicate.email === body.email;
      const duplicateField = emailDuplicate ? "email" : "phone";
      return {
        status: false,
        response: errorResponse(
          `Customer with ${duplicateField} already exists`,
          {
            [duplicateField]: [
              `Customer with this ${duplicateField} already exists`,
            ],
          }
        ),
      };
    }

    return {
      status: true,
      response: successResponse("Customer valid", body),
    };
  }

  async generateReport(db: typeof dbConnection, body: GenerateReportInput) {
    return db.transaction(async (trx) => {
      const customerReport =
        await customerReportRepository.createCustomerReport(trx, {
          ...body.customer,
        });
      if (!customerReport) throw new Error("Failed to create customer report");

      const serviceReport = await serviceReportRepository.createServiceReport(
        trx,
        {
          customer_id: customerReport.id,
          ...body.service,
        }
      );
      if (!serviceReport) throw new Error("Failed to create service report");

      const problemReport = await problemReportRepository.createProblemReport(
        trx,
        {
          customer_id: customerReport.id,
          ...body.problem,
        }
      );
      if (!problemReport) throw new Error("Failed to create problem report");

      const partUsedInput: PartUsedReportInput[] = body.partsUsed.map(
        (part) => ({
          customer_id: customerReport.id,
          name: part.name,
          quantity: part.quantity,
          price: part.price ?? 0,
        })
      );

      const partUsedReports =
        await partUsedReportRepository.createPartUsedReport(trx, partUsedInput);

      if (partUsedInput.length !== partUsedReports.length)
        throw new Error("Failed to create part used report");

      return {
        status: true,
        response: {
          customerReport,
          serviceReport,
          problemReport,
          partUsedReports,
        },
      };
    });
  }
}

export default new ReportService();
