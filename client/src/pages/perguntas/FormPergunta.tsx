import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { InsertPergunta, Pergunta, Certificacao, Resposta } from "@db/schema";

interface FormPerguntaProps {
  title: string;
  pergunta?: Pergunta & { respostas?: Resposta[] };
  onSubmit: (data: InsertPergunta & { respostas: Array<{ texto: string; correta: boolean }> }) => Promise<any>;
}

export default function FormPergunta({
  title,
  pergunta,
  onSubmit,
}: FormPerguntaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [respostas, setRespostas] = useState<Array<{ texto: string; correta: boolean }>>([
    { texto: "", correta: false },
    { texto: "", correta: false },
    { texto: "", correta: false },
  ]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const form = useForm<InsertPergunta>({
    defaultValues: {
      certificacao_id: undefined,
      enunciado: "",
      explicacao: "",
    },
  });

  useEffect(() => {
    if (pergunta) {
      form.reset({
        certificacao_id: pergunta.certificacao_id,
        enunciado: pergunta.enunciado,
        explicacao: pergunta.explicacao || "",
      });
      if (pergunta.respostas) {
        setRespostas(pergunta.respostas.map(r => ({
          texto: r.texto,
          correta: r.correta,
        })));
      }
    }
  }, [pergunta, form]);

  const handleAddResposta = () => {
    setRespostas([...respostas, { texto: "", correta: false }]);
  };

  const handleRemoveResposta = (index: number) => {
    if (respostas.length <= 3) {
      toast({
        title: "Erro",
        description: "É necessário ter no mínimo 3 respostas",
        variant: "destructive",
      });
      return;
    }
    setRespostas(respostas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: InsertPergunta) => {
    // Validate certificacao_id
    if (!data.certificacao_id) {
      toast({
        title: "Erro de validação",
        description: "Selecione uma certificação",
        variant: "destructive",
      });
      return;
    }

    // Validate enunciado
    if (!data.enunciado?.trim()) {
      toast({
        title: "Erro de validação",
        description: "O enunciado é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum responses
    if (respostas.length < 3) {
      toast({
        title: "Erro de validação",
        description: "É necessário ter no mínimo 3 respostas",
        variant: "destructive",
      });
      return;
    }

    // Validate if all responses have text
    if (respostas.some(r => !r.texto.trim())) {
      toast({
        title: "Erro de validação",
        description: "Todas as respostas devem ter um texto",
        variant: "destructive",
      });
      return;
    }

    // Validate if there is exactly one correct answer
    if (respostas.filter(r => r.correta).length !== 1) {
      toast({
        title: "Erro de validação",
        description: "Deve haver exatamente uma resposta correta",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, respostas });
      toast({
        title: "Sucesso",
        description: "Pergunta salva com sucesso!",
      });
      setLocation("/perguntas/list");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar pergunta. Tente novamente.",
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
            Preencha os dados da pergunta abaixo
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="certificacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificação</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma certificação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {certificacoes.map((cert) => (
                        <SelectItem key={cert.id} value={cert.id.toString()}>
                          {cert.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enunciado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enunciado</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explicacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explicação</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="Explicação da resposta correta (opcional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Respostas</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddResposta}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Resposta
                </Button>
              </div>

              <div className="space-y-4">
                {respostas.map((resposta, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <FormItem>
                        <FormControl>
                          <Textarea
                            value={resposta.texto}
                            onChange={(e) => {
                              const newRespostas = [...respostas];
                              newRespostas[index].texto = e.target.value;
                              setRespostas(newRespostas);
                            }}
                            placeholder={`Resposta ${index + 1}`}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={resposta.correta}
                          onCheckedChange={(checked: boolean) => {
                            const newRespostas = respostas.map((r, i) => ({
                              ...r,
                              correta: i === index ? checked : false
                            }));
                            setRespostas(newRespostas);
                          }}
                          id={`correct-${index}`}
                        />
                        <label
                          htmlFor={`correct-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Resposta Correta
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveResposta(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/perguntas/list")}
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
