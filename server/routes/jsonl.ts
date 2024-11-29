import { Router } from "express";
import { db } from "db";
import { jsonl_files } from "@db/schema";

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

export default router;
