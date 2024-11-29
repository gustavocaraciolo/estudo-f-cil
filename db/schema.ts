import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
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

// Schema para perguntas
export const perguntas = pgTable("perguntas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  certificacao_id: integer("certificacao_id").references(() => certificacoes.id).notNull(),
  enunciado: text("enunciado").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Schema para respostas
export const respostas = pgTable("respostas", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  pergunta_id: integer("pergunta_id").references(() => perguntas.id).notNull(),
  texto: text("texto").notNull(),
  correta: boolean("correta").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas para perguntas
export const insertPerguntaSchema = createInsertSchema(perguntas);
export const selectPerguntaSchema = createSelectSchema(perguntas);
export type InsertPergunta = z.infer<typeof insertPerguntaSchema>;
export type Pergunta = z.infer<typeof selectPerguntaSchema>;

// Schemas para respostas
export const insertRespostaSchema = createInsertSchema(respostas);
export const selectRespostaSchema = createSelectSchema(respostas);
export type InsertResposta = z.infer<typeof insertRespostaSchema>;
export type Resposta = z.infer<typeof selectRespostaSchema>;

// Define relations
export const perguntasRelations = relations(perguntas, ({ one, many }) => ({
  certificacao: one(certificacoes, {
    fields: [perguntas.certificacao_id],
    references: [certificacoes.id],
  }),
  respostas: many(respostas),
}));

export const respostasRelations = relations(respostas, ({ one }) => ({
  pergunta: one(perguntas, {
    fields: [respostas.pergunta_id],
    references: [perguntas.id],
  }),
}));

export const certificacoesRelations = relations(certificacoes, ({ many }) => ({
  perguntas: many(perguntas),
}));
