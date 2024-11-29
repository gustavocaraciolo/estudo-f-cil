import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Certificacao } from "@db/schema";

export default function ListCertificacoes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [certificacaoParaExcluir, setCertificacaoParaExcluir] = useState<Certificacao | null>(null);
  
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
                    <div className="flex gap-2">
                      <Link href={`/certificacoes/edit/${certificacao.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCertificacaoParaExcluir(certificacao)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={!!certificacaoParaExcluir} onOpenChange={() => setCertificacaoParaExcluir(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a certificação "{certificacaoParaExcluir?.nome}"?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCertificacaoParaExcluir(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!certificacaoParaExcluir) return;
                  
                  try {
                    const response = await fetch(
                      `/api/certificacoes/${certificacaoParaExcluir.id}`,
                      { method: "DELETE" }
                    );
                    
                    if (!response.ok) {
                      throw new Error("Erro ao excluir certificação");
                    }

                    toast({
                      title: "Sucesso",
                      description: "Certificação excluída com sucesso!",
                    });

                    queryClient.invalidateQueries({ queryKey: ["certificacoes"] });
                  } catch (error) {
                    toast({
                      title: "Erro",
                      description: "Erro ao excluir certificação. Tente novamente.",
                      variant: "destructive",
                    });
                  } finally {
                    setCertificacaoParaExcluir(null);
                  }
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
