import { db } from "db";
import { perguntas, respostas } from "@db/schema";
import { eq } from "drizzle-orm";
import { Router } from "express";

const router = Router();

// Listar todas as perguntas
router.get("/", async (_req, res) => {
  try {
    const allPerguntas = await db.query.perguntas.findMany({
      with: {
        respostas: true,
        certificacao: true,
      },
    });
    res.json(allPerguntas);
  } catch (error) {
    console.error('Erro ao listar perguntas:', error);
    res.status(500).json({ error: "Erro ao listar perguntas" });
  }
});

// Listar perguntas por certificação
router.get("/certificacao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const perguntasResult = await db.query.perguntas.findMany({
      where: eq(perguntas.certificacao_id, parseInt(id)),
      with: {
        respostas: true,
      },
    });

    res.json(perguntasResult);
  } catch (error) {
    console.error('Erro ao listar perguntas por certificação:', error);
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
        certificacao: true,
      },
    });

    if (!pergunta) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    res.json(pergunta);
  } catch (error) {
    console.error('Erro ao buscar:', error);
    res.status(500).json({ error: "Erro ao buscar pergunta" });
  }
});

// Criar pergunta
router.post("/", async (req, res) => {
  try {
    const { certificacao_id, enunciado, explicacao, respostas: respostasData } = req.body;
    
    const novaPergunta = await db
      .insert(perguntas)
      .values({
        certificacao_id,
        enunciado,
        explicacao,
      })
      .returning();

    if (respostasData && respostasData.length > 0) {
      await db.insert(respostas).values(
        respostasData.map((resposta: { texto: string; correta: boolean }) => ({
          pergunta_id: novaPergunta[0].id,
          texto: resposta.texto,
          correta: resposta.correta,
        }))
      );
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
    const { certificacao_id, enunciado, explicacao, respostas: respostasData } = req.body;

    const perguntaAtualizada = await db
      .update(perguntas)
      .set({
        certificacao_id,
        enunciado,
        explicacao,
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
    console.error('Erro ao atualizar:', error);
    res.status(500).json({ error: "Erro ao atualizar pergunta" });
  }
});

// Excluir pergunta
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // With CASCADE delete, we don't need to manually delete respostas
    const perguntaExcluida = await db
      .delete(perguntas)
      .where(eq(perguntas.id, parseInt(id)))
      .returning();

    if (perguntaExcluida.length === 0) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    res.json({ message: "Pergunta excluída com sucesso" });
  } catch (error) {
    console.error('Erro ao excluir:', error);
    res.status(500).json({ error: "Erro ao excluir pergunta" });
  }
});

export default router;
