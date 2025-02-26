import {
  CustomerReportInput,
  PartUsedReportInput,
  GenerateReportInput,
  CustomerReport,
  ReportData,
} from "@/types/report";
import { db as dbConnection } from "../db";
import { errorResponse, successResponse } from "../utils/response.util";
import { eq, or } from "drizzle-orm";
import { customers } from "../db/schema";
import customerReportRepository from "../repositories/customer-report.repository";
import serviceReportRepository from "../repositories/service-report.repository";
import problemReportRepository from "../repositories/problem-report.repository";
import partUsedReportRepository from "../repositories/part-used-report.repository";
import { saveBase64Image } from "../utils/helpers/helper";
import { PDFDocument, rgb } from "pdf-lib";
import path from "path";
import fs from 'fs';

class ReportService {
  async getReports(db: typeof dbConnection, query: any) {
    const [customerReports, totalData] = await customerReportRepository.findAll(
      db,
      query
    );
    const collectCustomerIds = customerReports.map(
      (report: ReportData) => report.id
    );

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

    const reportsAll = customerReports.map((report: ReportData) => {
      report.service = findService.get(report.id);
      report.problem = findProblem.get(report.id);
      report.partsUsed = findPartUsed.get(report.id);
      return report;
    });

    return {
      status: true,
      response: {
        data: reportsAll,
        meta: {
          totalData: totalData,
          page: query.page ?? 1,
          limit: query.limit ?? 10,
        },
      },
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
      const directorySignature = "uploads";
      const filenameSignature = `signature-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      let signaturePath = null;
      if (body.signature) {
        signaturePath = await saveBase64Image(
          body.signature,
          directorySignature,
          filenameSignature
        );
        signaturePath = `/${directorySignature}/${filenameSignature}.png`;
        if (!signaturePath) throw new Error("Failed to save signature");
      }

      const customerReport =
        await customerReportRepository.createCustomerReport(trx, {
          ...body.customer,
          signature: signaturePath ?? "",
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

      let problemReport = null;
      if (body.problem.problem == "" || body.problem.resolution == "") {
        problemReport = await problemReportRepository.createProblemReport(trx, {
          customer_id: customerReport.id,
          ...body.problem,
        });
        if (!problemReport) throw new Error("Failed to create problem report");
      }

      let partUsedReports = null;
      if (body?.partsUsed && body.partsUsed.length > 0) {
        const partUsedInput: PartUsedReportInput[] = body?.partsUsed?.map(
          (part) => ({
            customer_id: customerReport.id,
            name: part.name,
            quantity: part.quantity,
            price: part.price ?? 0,
          })
        );

        partUsedReports = await partUsedReportRepository.createPartUsedReport(
          trx,
          partUsedInput
        );

        if (partUsedInput.length !== partUsedReports.length)
          throw new Error("Failed to create part used report");
      }

      const pdfGenerated = await this.generateReportPDF(body);
      if (!pdfGenerated) throw new Error("Failed to generate PDF");
      
      const updateCustomer = await customerReportRepository.updateCustomerReport(
        trx,
        customerReport.id,
        {
          pdf_generated: pdfGenerated,
        }
      );
      if (!updateCustomer) throw new Error("Failed to update customer report");

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

  async generateReportPDF(data: GenerateReportInput) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    let yPosition = height - 50;

    const drawText = (text, x, y, bold = false) => {
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    };

    drawText("Informasi Pelanggan", 50, yPosition);
    yPosition -= 20;
    drawText(`Nama: ${data.customer.name}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Alamat: ${data.customer.address}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Email: ${data.customer.email || "-"}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Telepon: ${data.customer.phone}`, 50, yPosition);
    yPosition -= 30;

    drawText("Detail Layanan", 50, yPosition);
    yPosition -= 20;
    drawText(`Tanggal: ${data.service.date}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Tipe Layanan: ${data.service.type}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Durasi: ${data.service.duration} jam`, 50, yPosition);
    yPosition -= 30;

    drawText("Deskripsi Masalah & Resolusi", 50, yPosition);
    yPosition -= 20;
    drawText(`Masalah: ${data.problem.problem || "-"}`, 50, yPosition);
    yPosition -= 20;
    drawText(`Solusi: ${data.problem.resolution || "-"}`, 50, yPosition);
    yPosition -= 30;

    drawText("Bagian yang Digunakan", 50, yPosition);
    yPosition -= 20;
    if (data.partsUsed && data.partsUsed.length > 0) {
      data.partsUsed.forEach((part) => {
        drawText(`Nama Part: ${part.name}`, 50, yPosition);
        yPosition -= 20;
        drawText(`Jumlah: ${part.quantity}`, 50, yPosition);
        yPosition -= 20;
        drawText(
          `Harga: ${part.price ? `Rp ${part.price}` : "-"}`,
          50,
          yPosition
        );
        yPosition -= 30;
      });
    } else {
      drawText("Tidak ada part digunakan", 50, yPosition);
      yPosition -= 20;
    }
    yPosition -= 30;

    drawText("Tanda Tangan", 50, yPosition);
    yPosition -= 20;
    if (data.signature) {
      const signatureImage = await pdfDoc.embedPng(data.signature);
      page.drawImage(signatureImage, {
        x: 50,
        y: yPosition - 50,
        width: 100,
        height: 50,
      });
    } else {
      drawText("Tidak ada tanda tangan", 50, yPosition);
    }

    const pdfBytes = await pdfDoc.save();
    
    const directory = 'uploads/reports';
    const directoryPublic = `public/${directory}`;
    const filename = `report-${Math.random().toString(36).substring(2, 15)}.pdf`;
    const filePathFull = path.join(process.cwd(), directoryPublic, filename);
    const filePath = `/${directory}/${filename}`;

    if (!fs.existsSync(directoryPublic)) {
      fs.mkdirSync(directoryPublic, { recursive: true });
    }

    fs.writeFileSync(filePathFull, pdfBytes);

    return filePath
  }
}

export default new ReportService();
