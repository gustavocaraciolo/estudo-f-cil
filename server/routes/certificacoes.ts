import { Router } from "express";
import { db } from "../../db";
import { certificacoes, jsonl_files } from "@db/schema";
import { eq, exists } from "drizzle-orm";

const router = Router();

// Listar certificações
router.get("/", async (req, res) => {
  try {
    const listaCertificacoes = await db.query.certificacoes.findMany();
    res.json(listaCertificacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar certificações" });
  }
});
// Buscar certificação por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const certificacao = await db.query.certificacoes.findFirst({
      where: eq(certificacoes.id, parseInt(id))
    });
    
    if (!certificacao) {
      return res.status(404).json({ error: "Certificação não encontrada" });
    }
    
    res.json(certificacao);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar certificação" });
  }
});


// Criar certificação
router.post("/", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const novaCertificacao = await db.insert(certificacoes).values({
      nome,
      descricao,
    }).returning();
    res.status(201).json(novaCertificacao[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar certificação" });
  }
});

// Atualizar certificação
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const certificacaoAtualizada = await db.update(certificacoes)
      .set({
        nome,
        descricao,
        updated_at: new Date(),
      })
      .where(eq(certificacoes.id, parseInt(id)))
      .returning();
    
    if (certificacaoAtualizada.length === 0) {
      return res.status(404).json({ error: "Certificação não encontrada" });
    }
    
    res.json(certificacaoAtualizada[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar certificação" });
  }
});

// Excluir certificação
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const certificacaoExcluida = await db.delete(certificacoes)
      .where(eq(certificacoes.id, parseInt(id)))
      .returning();
    
    if (certificacaoExcluida.length === 0) {
      return res.status(404).json({ error: "Certificação não encontrada" });
    }
    
    res.json({ message: "Certificação excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir certificação" });
  }
});

export default router;
// Listar certificações que possuem arquivos JSONL
router.get("/with-jsonl", async (_req, res) => {
  try {
    const result = await db.query.certificacoes.findMany({
      where: (certificacoes, { exists }) =>
        exists(
          db.select()
            .from(jsonl_files)
            .where(eq(jsonl_files.certificacao_id, certificacoes.id))
        )
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar certificações" });
  }
});
