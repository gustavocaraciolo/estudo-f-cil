import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import FormPergunta from "./FormPergunta";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertPergunta, Pergunta, Resposta } from "@db/schema";

interface PerguntaWithRespostas extends Pergunta {
  respostas: Resposta[];
}

export default function EditPergunta() {
  const [, params] = useRoute<{ id: string }>("/perguntas/edit/:id");
  const queryClient = useQueryClient();

  const { data: pergunta, isLoading } = useQuery<PerguntaWithRespostas>({
    queryKey: ["pergunta", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/perguntas/${params?.id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar pergunta");
      }
      return response.json();
    },
    enabled: !!params?.id,
  });

  const updatePergunta = useMutation({
    mutationFn: async (data: InsertPergunta & { respostas: Array<{ texto: string; correta: boolean }> }) => {
      const response = await fetch(`/api/perguntas/${params?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar pergunta");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
      queryClient.invalidateQueries({ queryKey: ["pergunta", params?.id] });
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <FormPergunta
      title="Editar Pergunta"
      pergunta={pergunta}
      onSubmit={updatePergunta.mutateAsync}
    />
  );
}
