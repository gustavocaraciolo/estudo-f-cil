import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertCertificacao, Certificacao } from "@db/schema";

interface FormCertificacaoProps {
  title: string;
  certificacao?: Certificacao;
  onSubmit: (data: InsertCertificacao) => Promise<any>;
}

export default function FormCertificacao({
  title,
  certificacao,
  onSubmit,
}: FormCertificacaoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCertificacao>({
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (certificacao) {
      console.log('Certificação recebida:', certificacao);
      form.reset({
        nome: certificacao.nome,
        descricao: certificacao.descricao
      });
    }
  }, [certificacao, form]);

  const handleSubmit = async (data: InsertCertificacao) => {
    console.log('Dados do formulário:', data);
    
    if (!data.nome?.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome da certificação é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // Invalidate queries after successful submission
      queryClient.invalidateQueries({ queryKey: ["certificacoes"] });
      toast({
        title: "Sucesso",
        description: "Certificação salva com sucesso!",
      });
      setLocation("/certificacoes/list");
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao salvar certificação. Tente novamente.";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Erro ao salvar certificação:", error);
    } finally {
      setIsSubmitting(false);
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
