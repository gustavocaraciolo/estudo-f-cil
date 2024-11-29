import type { Express } from "express";
import certificacoesRouter from "./routes/certificacoes";
import usuariosRouter from "./routes/usuarios";

export function registerRoutes(app: Express) {
  // Prefix all routes with /api
  app.use("/api/certificacoes", certificacoesRouter);
  app.use("/api/usuarios", usuariosRouter);
}
