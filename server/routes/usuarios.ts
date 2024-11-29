import { Router } from "express";
import { db } from "db";
import { eq, and } from "drizzle-orm";
import { users, usuarios_certificacoes, certificacoes } from "@db/schema";

const router = Router();

// Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const listaUsuarios = await db.query.users.findMany();
    res.json(listaUsuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await db.query.users.findFirst({
      where: eq(users.id, parseInt(id)),
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Criar usuário
router.post("/", async (req, res) => {
  try {
    // Primeiro verifica se já existe um usuário com este email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, req.body.email)
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: "Já existe um usuário cadastrado com este email" 
      });
    }

    const { nome_completo, email, ddi, whatsapp } = req.body;
    console.log('Tentando criar usuário:', { nome_completo, email, ddi, whatsapp });
    
    const novoUsuario = await db
      .insert(users)
      .values({
        nome_completo,
        email,
        ddi,
        whatsapp,
      })
      .returning();

    console.log('Usuário criado:', novoUsuario[0]);
    res.status(201).json(novoUsuario[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Atualizar usuário
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, email, ddi, whatsapp } = req.body;
    
    const usuarioAtualizado = await db
      .update(users)
      .set({
        nome_completo,
        email,
        ddi,
        whatsapp,
        updated_at: new Date(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (usuarioAtualizado.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuarioAtualizado[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Excluir usuário
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro removemos todas as certificações associadas
    await db
      .delete(usuarios_certificacoes)
      .where(eq(usuarios_certificacoes.usuario_id, parseInt(id)));
    
    // Depois removemos o usuário
    const usuarioExcluido = await db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (usuarioExcluido.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

// Listar certificações do usuário
router.get("/:id/certificacoes", async (req, res) => {
  try {
    const { id } = req.params;
    const certificacoesDoUsuario = await db
      .select({
        id: certificacoes.id,
        nome: certificacoes.nome,
        descricao: certificacoes.descricao,
      })
      .from(usuarios_certificacoes)
      .innerJoin(certificacoes, eq(usuarios_certificacoes.certificacao_id, certificacoes.id))
      .where(eq(usuarios_certificacoes.usuario_id, parseInt(id)));

    res.json(certificacoesDoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar certificações do usuário" });
  }
});

// Adicionar certificação ao usuário
router.post("/:id/certificacoes", async (req, res) => {
  try {
    const { id } = req.params;
    const { certificacao_id } = req.body;

    const novaRelacao = await db
      .insert(usuarios_certificacoes)
      .values({
        usuario_id: parseInt(id),
        certificacao_id: parseInt(certificacao_id),
      })
      .returning();

    res.status(201).json(novaRelacao[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar certificação ao usuário" });
  }
});

// Remover certificação do usuário
router.delete("/:id/certificacoes/:certId", async (req, res) => {
  try {
    const { id, certId } = req.params;
    
    const relacaoExcluida = await db
      .delete(usuarios_certificacoes)
      .where(
        and(
          eq(usuarios_certificacoes.usuario_id, parseInt(id)),
          eq(usuarios_certificacoes.certificacao_id, parseInt(certId))
        )
      )
      .returning();

    if (relacaoExcluida.length === 0) {
      return res.status(404).json({ error: "Relação não encontrada" });
    }

    res.json({ message: "Certificação removida do usuário com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover certificação do usuário" });
  }
});

export default router;
