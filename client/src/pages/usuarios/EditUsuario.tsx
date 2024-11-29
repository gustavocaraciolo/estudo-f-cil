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
    mutationFn: async (data: InsertUser) => {
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", params?.id] });
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
