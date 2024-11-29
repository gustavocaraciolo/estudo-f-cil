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
import type { User } from "@db/schema";

export default function ListUsuarios() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<User | null>(null);
  
  const { data: usuarios, isLoading } = useQuery<User[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await fetch("/api/usuarios");
      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }
      return response.json();
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <Link href="/usuarios/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios?.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome_completo}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{`+${usuario.ddi} ${usuario.whatsapp}`}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/usuarios/edit/${usuario.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setUsuarioParaExcluir(usuario)}
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

        <Dialog open={!!usuarioParaExcluir} onOpenChange={() => setUsuarioParaExcluir(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o usuário "{usuarioParaExcluir?.nome_completo}"?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUsuarioParaExcluir(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!usuarioParaExcluir) return;
                  
                  try {
                    const response = await fetch(
                      `/api/usuarios/${usuarioParaExcluir.id}`,
                      { method: "DELETE" }
                    );
                    
                    if (!response.ok) {
                      throw new Error("Erro ao excluir usuário");
                    }

                    toast({
                      title: "Sucesso",
                      description: "Usuário excluído com sucesso!",
                    });

                    queryClient.invalidateQueries({ queryKey: ["usuarios"] });
                  } catch (error) {
                    toast({
                      title: "Erro",
                      description: "Erro ao excluir usuário. Tente novamente.",
                      variant: "destructive",
                    });
                  } finally {
                    setUsuarioParaExcluir(null);
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
