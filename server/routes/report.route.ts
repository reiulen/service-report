import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import ReportController from "../controllers/report.controller";
import {
  customerReportSchema,
  generateReportResponseSchema,
  generateReportSchema,
  reportAllResponseSchema,
} from "../schemas/report.schema";
import { ContextVariables } from "@/types/context";
import { errorResponse } from "../utils/response.util";
import { formatZodError } from "../utils/format-zod-error.util";

const reportRoutes = new OpenAPIHono<{
  Variables: ContextVariables;
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        errorResponse("Validation failed", formatZodError(result.error)),
        422
      );
    }
  },
});

const getReportsRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: z.object({
      keyword: z.string().optional(),
      date: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      orderBy: z.string().optional(),
      orderDirection: z.string().optional()
    }),
  },
  responses: {
    200: {
      description: "Reports fetched successfully",
      content: {
        "application/json": {
          schema: reportAllResponseSchema.openapi("ReportAllResponseSchema")
        }
      }
    },
    400: {
      description: "Failed to fetch reports",
    },
  },
});

const validateCustomerRoute = createRoute({
  method: "post",
  path: "/validate-customer",
  request: {
    body: {
      content: {
        "application/json": {
          schema: customerReportSchema.openapi("CustomerReportSchema", {
            example: {
              name: "John Doe",
              address: "Jl. Raya No. 1",
              email: "dadan@gmail.com",
              phone: "081234567890",
            },
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Validation success",
      content: {
        "application/json": {
          schema: z.object({
            status: z.boolean(),
            message: z.string(),
            data: z.object({
              name: z.string(),
              address: z.string(),
              email: z.string().optional(),
              phone: z.string(),
            })
          }),
        }
      }
    },
    400: {
      description: "Validation failed",
    },
  },
});

const generateReportRoute = createRoute({
  method: "post",
  path: "/generate",
  request: {
    body: {
      content: {
        "application/json": {
          schema: generateReportSchema.openapi("GenerateReportSchema", {
            example: {
              customer: {
                name: "John Doe",
                address: "Jl. Raya No. 1",
                email: "dadan@gmail.com",
                phone: "081234567890",
              },
              service: {
                date: "2021-01-01",
                type: "Service Type",
                duration: 60,
              },
              problem: {
                problem: "Problem",
                resolution: "Resolution",
              },
              partsUsed: [
                {
                  name: "Part Name",
                  quantity: 1,
                  price: 100000,
                },
              ],
              signature: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
            },
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Report generated",
      content: {
        "application/json": {
          schema: generateReportResponseSchema.openapi("GenerateReportResponseSchema")
        }
      }
    },
    400: {
      description: "Report generation failed",
    },
  },
});

reportRoutes.openapi(getReportsRoute, ReportController.getReports);
reportRoutes.openapi(validateCustomerRoute, ReportController.validateCustomer);
reportRoutes.openapi(generateReportRoute, ReportController.generateReport);

export { reportRoutes };
