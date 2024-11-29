import type { Express } from "express";
import certificacoesRouter from "./routes/certificacoes";

export function registerRoutes(app: Express) {
  // Prefix all routes with /api
  app.use("/api/certificacoes", certificacoesRouter);
}
