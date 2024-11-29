import { Router } from "express";
import { db } from "db";
import { jsonl_files } from "@db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { certificacao_id, content, filename } = req.body;
    const result = await db.insert(jsonl_files)
      .values({ certificacao_id, content, filename })
      .returning();
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar arquivo JSONL" });
  }
});

router.get("/certificacao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query.jsonl_files.findMany({
      where: eq(jsonl_files.certificacao_id, parseInt(id)),
      orderBy: [desc(jsonl_files.created_at)],
    });
    res.json(result[0]); // Retorna o arquivo mais recente
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar arquivo JSONL" });
  }
});

export default router;
