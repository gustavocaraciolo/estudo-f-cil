import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { insertCertificacaoSchema, type InsertCertificacao } from "@db/schema";
import { useLocation } from "wouter";

interface FormCertificacaoProps {
  certificacao?: InsertCertificacao;
  onSubmit: (data: InsertCertificacao) => Promise<void>;
  title: string;
}

export default function FormCertificacao({ certificacao, onSubmit, title }: FormCertificacaoProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<InsertCertificacao>({
    resolver: zodResolver(insertCertificacaoSchema),
    defaultValues: certificacao || {
      nome: "",
      descricao: "",
    },
  });

  const handleSubmit = async (data: InsertCertificacao) => {
    try {
      await onSubmit(data);
      toast({
        title: "Sucesso",
        description: "Certificação salva com sucesso!",
      });
      setLocation("/certificacoes/list");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar certificação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            Preencha os dados da certificação abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/certificacoes/list")}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}