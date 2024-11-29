import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Certificacao } from "@db/schema";

export default function ListCertificacoes() {
  const { data: certificacoes, isLoading } = useQuery<Certificacao[]>({
    queryKey: ["certificacoes"],
    queryFn: async () => {
      const response = await fetch("/api/certificacoes");
      if (!response.ok) {
        throw new Error("Erro ao carregar certificações");
      }
      return response.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Certificações</h1>
          <Link href="/certificacoes/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Certificação
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificacoes?.map((certificacao) => (
                <TableRow key={certificacao.id}>
                  <TableCell>{certificacao.nome}</TableCell>
                  <TableCell>{certificacao.descricao}</TableCell>
                  <TableCell>
                    {new Date(certificacao.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/certificacoes/edit/${certificacao.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
