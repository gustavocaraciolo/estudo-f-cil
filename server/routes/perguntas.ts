import { Router } from "express";
import { db } from "db";
import { eq, sql } from "drizzle-orm";
import { perguntas, respostas, certificacoes } from "@db/schema";

const router = Router();

// Listar todas as perguntas
router.get("/", async (req, res) => {
  try {
    const listaPerguntas = await db
      .select({
        id: perguntas.id,
        enunciado: perguntas.enunciado,
        certificacao_id: perguntas.certificacao_id,
        created_at: perguntas.created_at,
        updated_at: perguntas.updated_at,
        certificacao: certificacoes,
        total_respostas: sql<number>`count(${respostas.id})::int`,
      })
      .from(perguntas)
      .leftJoin(certificacoes, eq(perguntas.certificacao_id, certificacoes.id))
      .leftJoin(respostas, eq(respostas.pergunta_id, perguntas.id))
      .groupBy(perguntas.id, certificacoes.id);

    res.json(listaPerguntas);
  } catch (error) {
    console.error('Erro ao listar perguntas:', error);
    res.status(500).json({ error: "Erro ao listar perguntas" });
  }
});

// Buscar pergunta por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pergunta = await db.query.perguntas.findFirst({
      where: eq(perguntas.id, parseInt(id)),
      with: {
        respostas: true,
      },
    });

    if (!pergunta) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    res.json(pergunta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pergunta" });
  }
});

// Criar pergunta
router.post("/", async (req, res) => {
  try {
    const { certificacao_id, enunciado, respostas: respostasData } = req.body;
    console.log('Dados recebidos:', { certificacao_id, enunciado, respostasData });

    // Criar pergunta
    const novaPergunta = await db
      .insert(perguntas)
      .values({
        certificacao_id,
        enunciado,
      })
      .returning();
    console.log('Pergunta criada:', novaPergunta[0]);

    // Criar respostas
    if (respostasData && respostasData.length > 0) {
      const novasRespostas = await db.insert(respostas).values(
        respostasData.map((resposta: { texto: string; correta: boolean }) => ({
          pergunta_id: novaPergunta[0].id,
          texto: resposta.texto,
          correta: resposta.correta,
        }))
      ).returning();
      console.log('Respostas criadas:', novasRespostas);
    }

    res.status(201).json(novaPergunta[0]);
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ error: "Erro ao criar pergunta" });
  }
});

// Atualizar pergunta
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { certificacao_id, enunciado, respostas: respostasData } = req.body;

    // Atualizar pergunta
    const perguntaAtualizada = await db
      .update(perguntas)
      .set({
        certificacao_id,
        enunciado,
        updated_at: new Date(),
      })
      .where(eq(perguntas.id, parseInt(id)))
      .returning();

    if (perguntaAtualizada.length === 0) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    // Atualizar respostas
    if (respostasData && respostasData.length > 0) {
      // Primeiro, remover todas as respostas antigas
      await db
        .delete(respostas)
        .where(eq(respostas.pergunta_id, parseInt(id)));

      // Depois, criar as novas respostas
      await db.insert(respostas).values(
        respostasData.map((resposta: { texto: string; correta: boolean }) => ({
          pergunta_id: parseInt(id),
          texto: resposta.texto,
          correta: resposta.correta,
        }))
      );
    }

    res.json(perguntaAtualizada[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pergunta" });
  }
});

// Excluir pergunta
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Primeiro excluir todas as respostas relacionadas
    await db
      .delete(respostas)
      .where(eq(respostas.pergunta_id, parseInt(id)));

    // Depois excluir a pergunta
    const perguntaExcluida = await db
      .delete(perguntas)
      .where(eq(perguntas.id, parseInt(id)))
      .returning();

    if (perguntaExcluida.length === 0) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    res.json({ message: "Pergunta excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir pergunta" });
  }
});

export default router;
