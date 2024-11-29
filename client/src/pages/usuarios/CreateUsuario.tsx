import { useMutation } from "@tanstack/react-query";
import FormUsuario from "./FormUsuario";
import type { InsertUser } from "@db/schema";

export default function CreateUsuario() {
  const createUsuario = useMutation({
    mutationFn: async (data: InsertUser) => {
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
    },
  });

  return (
    <FormUsuario
      title="Novo Usuário"
      onSubmit={createUsuario.mutateAsync}
    />
  );
}
