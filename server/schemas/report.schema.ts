import { z } from "zod";

export const customerReportSchema = z.object({
  name: z.string(),
  address: z.string(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(
      /^((\+62|62)|0)[8]{1}[0-9]{7,11}$/,
      "No Handphone tidak valid, contoh: 081234567890"
    ),
});

export const serviceReportSchema = z.object({
  date: z.string(),
  type: z.string(),
  duration: z.number().optional(),
});

export const problemReportSchema = z.object({
  problem: z.string().optional(),
  resolution: z.string().optional(),
});

export const partUsedReportSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const generateReportSchema = z.object({
  customer: customerReportSchema,
  service: serviceReportSchema,
  problem: problemReportSchema,
  partsUsed: z.array(partUsedReportSchema),
  signature: z.string().regex(/^[A-Za-z0-9+/=]*$/, "Invalid base64 format"),
});

export const reportAllResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    data: customerReportSchema.extend({
      id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      created_by_user_id: z.string(),
      service: serviceReportSchema.extend({
        id: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        created_by_user_id: z.string(),
      }),
      problem: problemReportSchema.extend({
        id: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        created_by_user_id: z.string(),
      }),
      partsUsedcustomer: z.array(
        partUsedReportSchema.extend({
          id: z.string(),
          created_at: z.string(),
          updated_at: z.string(),
          created_by_user_id: z.string(),
        })
      ),
    }),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
    }),
  })
});

export const generateReportResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    customerReport: customerReportSchema.extend({
      id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      created_by_user_id: z.string(),
    }),
    serviceReport: serviceReportSchema.extend({
      id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      created_by_user_id: z.string(),
    }),
    problemReport: problemReportSchema.extend({
      id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      created_by_user_id: z.string(),
    }),
    partUsedReports: z.array(
      partUsedReportSchema.extend({
        id: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        created_by_user_id: z.string(),
      })
    ),
  }),
});
