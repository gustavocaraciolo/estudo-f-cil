import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { Pergunta, Certificacao } from "@db/schema";

interface PerguntaWithDetails extends Pergunta {
  certificacao?: Certificacao;
  total_respostas?: number;
}

export default function ListPerguntas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [perguntaParaExcluir, setPerguntaParaExcluir] = useState<Pergunta | null>(null);
  
  const { data: perguntas, isLoading } = useQuery<PerguntaWithDetails[]>({
    queryKey: ["perguntas"],
    queryFn: async () => {
      const response = await fetch("/api/perguntas");
      if (!response.ok) {
        throw new Error("Erro ao carregar perguntas");
      }
      return response.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Perguntas</h1>
          <Link href="/perguntas/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Pergunta
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificação</TableHead>
                <TableHead>Enunciado</TableHead>
                <TableHead>Explicação</TableHead>
                <TableHead>Total de Respostas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perguntas?.map((pergunta) => (
                <TableRow key={pergunta.id}>
                  <TableCell>{pergunta.certificacao?.nome}</TableCell>
                  <TableCell>{pergunta.enunciado}</TableCell>
                  <TableCell>{pergunta.explicacao || '-'}</TableCell>
                  <TableCell>{pergunta.total_respostas || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/perguntas/edit/${pergunta.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPerguntaParaExcluir(pergunta)}
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

        <Dialog open={!!perguntaParaExcluir} onOpenChange={() => setPerguntaParaExcluir(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPerguntaParaExcluir(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!perguntaParaExcluir) return;
                  
                  try {
                    const response = await fetch(
                      `/api/perguntas/${perguntaParaExcluir.id}`,
                      { method: "DELETE" }
                    );
                    
                    if (!response.ok) {
                      throw new Error("Erro ao excluir pergunta");
                    }

                    toast({
                      title: "Sucesso",
                      description: "Pergunta excluída com sucesso!",
                    });
                  } catch (error) {
                    toast({
                      title: "Erro",
                      description: "Erro ao excluir pergunta. Tente novamente.",
                      variant: "destructive",
                    });
                  } finally {
                    setPerguntaParaExcluir(null);
                    queryClient.invalidateQueries({ queryKey: ["perguntas"] });
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
