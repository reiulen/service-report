import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { reportRoutes } from "./routes/report.route";
import { errorResponse } from "./utils/response.util";
import { OpenAPIHono } from "@hono/zod-openapi";
import { enableSwaggerUi, swaggerDocs } from "./docs/swagger";
import { ContextVariables } from "@/types/context";
import { db } from "./db";

const app = new OpenAPIHono<{ Variables: ContextVariables }>().basePath("/api");

app.use(async (c, next) => {
  c.set("db", db);
  return next();
});

app.route("/reports", reportRoutes);
app.notFound((c) => {
  return c.json(errorResponse("Not Found"), 404);
});

app.doc("/swagger.json", {
  openapi: "3.0.0",
  info: {
    title: "Service Report API",
    version: "1.0.0",
    description: "API documentation for service reports",
  },
});

enableSwaggerUi({ app, uiPath: "/docs", docPath: "/api/swagger.json" });

app.get("/docs", swaggerDocs);

export { app };
