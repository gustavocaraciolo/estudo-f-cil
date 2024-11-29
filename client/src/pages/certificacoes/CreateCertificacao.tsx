import { useMutation } from "@tanstack/react-query";
import FormCertificacao from "./FormCertificacao";
import type { InsertCertificacao } from "@db/schema";

export default function CreateCertificacao() {
  const createCertificacao = useMutation({
    mutationFn: async (data: InsertCertificacao) => {
      const response = await fetch("/api/certificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao criar certificação");
      }
    },
  });

  return (
    <FormCertificacao
      title="Nova Certificação"
      onSubmit={createCertificacao.mutateAsync}
    />
  );
}
