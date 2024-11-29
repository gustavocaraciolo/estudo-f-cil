import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const certificacoes = pgTable("certificacoes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas para usuários
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

// Schemas para certificações
export const insertCertificacaoSchema = createInsertSchema(certificacoes);
export const selectCertificacaoSchema = createSelectSchema(certificacoes);
export type InsertCertificacao = z.infer<typeof insertCertificacaoSchema>;
export type Certificacao = z.infer<typeof selectCertificacaoSchema>;
