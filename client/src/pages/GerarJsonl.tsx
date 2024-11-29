import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import type { Certificacao, Pergunta, Resposta } from "@db/schema";

export default function GerarJsonl() {
  const [selectedCertificacao, setSelectedCertificacao] = useState<string>();
  const [selectedPerguntas, setSelectedPerguntas] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: certificacoes = [] } = useQuery<Certificacao[]>({
    queryKey: ["certificacoes"],
    queryFn: async () => {
      const response = await fetch("/api/certificacoes");
      if (!response.ok) throw new Error("Erro ao carregar certificações");
      return response.json();
    },
  });

  const { data: perguntas = [] } = useQuery<(Pergunta & { respostas: Resposta[] })[]>({
    queryKey: ["perguntas", selectedCertificacao],
    queryFn: async () => {
      const response = await fetch(`/api/perguntas/certificacao/${selectedCertificacao}`);
      if (!response.ok) throw new Error("Erro ao carregar perguntas");
      return response.json();
    },
    enabled: !!selectedCertificacao,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setProgress(0);
    
    try {
      const selectedPerguntasData = perguntas.filter(p => 
        selectedPerguntas.includes(p.id)
      );

      const jsonlContent = selectedPerguntasData
        .map(p => JSON.stringify({
          id: p.id,
          pergunta: p.enunciado,
          explicacao: p.explicacao,
          respostas: p.respostas
        }))
        .join("\n");

      // Simular progresso
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Salvar no banco
      await fetch("/api/jsonl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificacao_id: selectedCertificacao,
          content: jsonlContent,
          filename: `perguntas_${selectedCertificacao}_${Date.now()}.jsonl`
        })
      });

      clearInterval(interval);
      setProgress(100);
      
      // Limpar após 1 segundo
      setTimeout(() => {
        setIsSaving(false);
        setProgress(0);
        setSelectedPerguntas([]);
      }, 1000);

    } catch (error) {
      console.error('Erro ao salvar arquivo JSONL:', error);
      setIsSaving(false);
      setProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Gerar JSONL</h1>
          <p className="text-muted-foreground">
            Selecione uma certificação e as perguntas para gerar o arquivo JSONL
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-full max-w-xs">
            <Select
              value={selectedCertificacao}
              onValueChange={setSelectedCertificacao}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma certificação" />
              </SelectTrigger>
              <SelectContent>
                {certificacoes.map((cert) => (
                  <SelectItem key={cert.id} value={cert.id.toString()}>
                    {cert.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCertificacao && (
            <>
              <div className="border rounded-lg">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {perguntas.map((pergunta) => (
                      <div key={pergunta.id} className="flex items-start space-x-3 hover:bg-accent/50 p-2 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`pergunta-${pergunta.id}`}
                            checked={selectedPerguntas.includes(pergunta.id)}
                            onCheckedChange={(checked) => {
                              setSelectedPerguntas(prev =>
                                checked
                                  ? [...prev, pergunta.id]
                                  : prev.filter(id => id !== pergunta.id)
                              );
                            }}
                            className="border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <label
                            htmlFor={`pergunta-${pergunta.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Selecionar
                          </label>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {pergunta.enunciado}
                          </p>
                          {pergunta.explicacao && (
                            <p className="text-sm text-muted-foreground">
                              {pergunta.explicacao}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {isSaving && (
                <Card>
                  <CardContent className="pt-6">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {progress}% completo
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleSave}
                disabled={selectedPerguntas.length === 0 || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Gerar JSONL"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
