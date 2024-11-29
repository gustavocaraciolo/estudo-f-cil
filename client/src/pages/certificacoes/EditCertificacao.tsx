import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";
import FormCertificacao from "./FormCertificacao";
import type { InsertCertificacao, Certificacao } from "@db/schema";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EditCertificacao() {
  const [, params] = useRoute<{ id: string }>("/certificacoes/edit/:id");
  const { toast } = useToast();

  const { data: certificacao, isLoading } = useQuery<Certificacao>({
    queryKey: ["certificacao", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/certificacoes/${params?.id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar certificação");
      }
      return response.json();
    },
    enabled: !!params?.id,
  });

  const updateCertificacao = useMutation({
    mutationFn: async (data: InsertCertificacao) => {
      console.log('Enviando dados para atualização:', data);
      const response = await fetch(`/api/certificacoes/${params?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar certificação");
      }
      
      const result = await response.json();
      console.log('Resposta da atualização:', result);
      return result;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <FormCertificacao
      title="Editar Certificação"
      certificacao={certificacao}
      onSubmit={updateCertificacao.mutateAsync}
    />
  );
}
