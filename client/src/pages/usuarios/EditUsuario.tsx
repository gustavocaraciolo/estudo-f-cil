import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import FormUsuario from "./FormUsuario";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertUser, User } from "@db/schema";

export default function EditUsuario() {
  const [, params] = useRoute<{ id: string }>("/usuarios/edit/:id");
  const queryClient = useQueryClient();

  const { data: usuario, isLoading } = useQuery<User>({
    queryKey: ["usuario", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/usuarios/${params?.id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar usuário");
      }
      return response.json();
    },
    enabled: !!params?.id,
  });

  const updateUsuario = useMutation({
    mutationFn: async (data: InsertUser & { certificacoes?: number[] }) => {
      // First update the user
      const response = await fetch(`/api/usuarios/${params?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      // Then update certifications if provided
      if (data.certificacoes !== undefined) {
        // Get current certifications
        const currentCertsResponse = await fetch(`/api/usuarios/${params?.id}/certificacoes`);
        if (!currentCertsResponse.ok) {
          throw new Error("Erro ao carregar certificações atuais");
        }
        const currentCerts = await currentCertsResponse.json();
        const currentCertIds = currentCerts.map((cert: any) => cert.id);

        // Calculate differences
        const toAdd = data.certificacoes.filter(id => !currentCertIds.includes(id));
        const toRemove = currentCertIds.filter(id => !data.certificacoes?.includes(id));

        // Add new certifications
        for (const certId of toAdd) {
          const addResponse = await fetch(`/api/usuarios/${params?.id}/certificacoes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificacao_id: certId }),
          });

          if (!addResponse.ok) {
            throw new Error("Erro ao adicionar certificação");
          }
        }

        // Remove old certifications
        for (const certId of toRemove) {
          const removeResponse = await fetch(`/api/usuarios/${params?.id}/certificacoes/${certId}`, {
            method: "DELETE",
          });

          if (!removeResponse.ok) {
            throw new Error("Erro ao remover certificação");
          }
        }
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", params?.id] });
      queryClient.invalidateQueries({ queryKey: ["usuario-certificacoes", params?.id] });
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
    <FormUsuario
      title="Editar Usuário"
      usuario={usuario}
      onSubmit={updateUsuario.mutateAsync}
    />
  );
}
