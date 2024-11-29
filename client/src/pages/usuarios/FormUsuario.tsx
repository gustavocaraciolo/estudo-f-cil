import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertUser, User, Certificacao } from "@db/schema";

interface FormUsuarioProps {
  title: string;
  usuario?: User;
  onSubmit: (data: InsertUser) => Promise<any>;
}

export default function FormUsuario({
  title,
  usuario,
  onSubmit,
}: FormUsuarioProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certificacoes } = useQuery<Certificacao[]>({
    queryKey: ["certificacoes"],
    queryFn: async () => {
      const response = await fetch("/api/certificacoes");
      if (!response.ok) {
        throw new Error("Erro ao carregar certificações");
      }
      return response.json();
    },
  });

  const form = useForm<InsertUser>({
    defaultValues: {
      nome_completo: "",
      email: "",
      ddi: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    if (usuario) {
      form.reset({
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        ddi: usuario.ddi,
        whatsapp: usuario.whatsapp,
      });
    }
  }, [usuario, form]);

  const handleSubmit = async (data: InsertUser) => {
    if (!data.nome_completo?.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome completo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({
        title: "Sucesso",
        description: "Usuário salvo com sucesso!",
      });
      setLocation("/usuarios/list");
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao salvar usuário. Tente novamente.";
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
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
            Preencha os dados do usuário abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ddi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DDI</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o DDI" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="55">+55 (Brasil)</SelectItem>
                        <SelectItem value="351">+351 (Portugal)</SelectItem>
                        <SelectItem value="1">+1 (EUA/Canadá)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/usuarios/list")}
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
