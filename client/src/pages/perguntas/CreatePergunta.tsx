import { useMutation } from "@tanstack/react-query";
import FormPergunta from "./FormPergunta";
import type { InsertPergunta } from "@db/schema";

export default function CreatePergunta() {
  const createPergunta = useMutation({
    mutationFn: async (data: InsertPergunta & { respostas: Array<{ texto: string; correta: boolean }> }) => {
      const response = await fetch("/api/perguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao criar pergunta");
      }
    },
  });

  return (
    <FormPergunta
      title="Nova Pergunta"
      onSubmit={createPergunta.mutateAsync}
    />
  );
}
