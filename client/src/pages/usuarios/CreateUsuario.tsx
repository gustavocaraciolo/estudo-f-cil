import { useMutation } from "@tanstack/react-query";
import FormUsuario from "./FormUsuario";
import type { InsertUser } from "@db/schema";

export default function CreateUsuario() {
  const createUsuario = useMutation({
    mutationFn: async (data: InsertUser & { certificacoes?: number[] }) => {
      // First create the user
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const newUser = await response.json();

      // Then associate certifications if any were selected
      if (data.certificacoes?.length) {
        for (const certId of data.certificacoes) {
          const certResponse = await fetch(`/api/usuarios/${newUser.id}/certificacoes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ certificacao_id: certId }),
          });

          if (!certResponse.ok) {
            throw new Error("Erro ao associar certificação ao usuário");
          }
        }
      }

      return newUser;
    },
  });

  return (
    <FormUsuario
      title="Novo Usuário"
      onSubmit={createUsuario.mutateAsync}
    />
  );
}
