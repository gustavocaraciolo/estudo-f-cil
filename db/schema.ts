import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome_completo: text("nome_completo").notNull(),
  email: text("email").unique().notNull(),
  ddi: text("ddi").notNull(),
  whatsapp: text("whatsapp").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const certificacoes = pgTable("certificacoes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const usuarios_certificacoes = pgTable("usuarios_certificacoes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  usuario_id: integer("usuario_id").references(() => users.id).notNull(),
  certificacao_id: integer("certificacao_id").references(() => certificacoes.id).notNull(),
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

// Schema para relacionamento usuarios_certificacoes
export const insertUsuarioCertificacaoSchema = createInsertSchema(usuarios_certificacoes);
export const selectUsuarioCertificacaoSchema = createSelectSchema(usuarios_certificacoes);
export type InsertUsuarioCertificacao = z.infer<typeof insertUsuarioCertificacaoSchema>;
export type UsuarioCertificacao = z.infer<typeof selectUsuarioCertificacaoSchema>;
