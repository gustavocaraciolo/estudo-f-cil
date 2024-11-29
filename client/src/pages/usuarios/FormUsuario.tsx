import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertUser, User, Certificacao } from "@db/schema";

interface FormUsuarioProps {
  title: string;
  usuario?: User;
  onSubmit: (data: InsertUser & { certificacoes?: number[] }) => Promise<any>;
}

export default function FormUsuario({
  title,
  usuario,
  onSubmit,
}: FormUsuarioProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCertificacoes, setSelectedCertificacoes] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch certificações
  const { data: certificacoes = [] } = useQuery<Certificacao[]>({
    queryKey: ["certificacoes"],
    queryFn: async () => {
      const response = await fetch("/api/certificacoes");
      if (!response.ok) {
        throw new Error("Erro ao carregar certificações");
      }
      return response.json();
    },
  });

  // Fetch user's certificações if editing
  const { data: userCertificacoes = [] } = useQuery<Certificacao[]>({
    queryKey: ["usuario-certificacoes", usuario?.id],
    queryFn: async () => {
      const response = await fetch(`/api/usuarios/${usuario?.id}/certificacoes`);
      if (!response.ok) {
        throw new Error("Erro ao carregar certificações do usuário");
      }
      return response.json();
    },
    enabled: !!usuario?.id,
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

  useEffect(() => {
    if (userCertificacoes.length > 0) {
      setSelectedCertificacoes(userCertificacoes.map(cert => cert.id));
    }
  }, [userCertificacoes]);

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
      await onSubmit({ ...data, certificacoes: selectedCertificacoes });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({
        title: "Sucesso",
        description: "Usuário salvo com sucesso!",
      });
      setLocation("/usuarios/list");
    } catch (error: any) {
      console.error('Erro completo:', error);
      
      let errorMessage = "Erro ao salvar usuário. Tente novamente.";
      
      // Verifica se é um erro da API com resposta
      if (error instanceof Error && 'response' in error) {
        const response = error.response as Response;
        const errorData = await response.json();
        errorMessage = errorData.error;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Erro ao salvar usuário:", errorMessage);
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

            <FormItem>
              <FormLabel>Certificações</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <span>
                      {selectedCertificacoes.length > 0
                        ? `${selectedCertificacoes.length} selecionada(s)`
                        : "Selecione as certificações"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar certificação..." />
                    <CommandEmpty>Nenhuma certificação encontrada.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {certificacoes.map((cert) => (
                        <CommandItem
                          key={cert.id}
                          onSelect={() => {
                            setSelectedCertificacoes((prev) =>
                              prev.includes(cert.id)
                                ? prev.filter((id) => id !== cert.id)
                                : [...prev, cert.id]
                            );
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {selectedCertificacoes.includes(cert.id) && "✓"}
                            {cert.nome}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCertificacoes.map((certId) => {
                  const cert = certificacoes.find((c) => c.id === certId);
                  return (
                    cert && (
                      <Badge
                        key={cert.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {cert.nome}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            setSelectedCertificacoes((prev) =>
                              prev.filter((id) => id !== cert.id)
                            )
                          }
                        />
                      </Badge>
                    )
                  );
                })}
              </div>
            </FormItem>

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
