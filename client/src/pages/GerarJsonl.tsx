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
import type { Certificacao, Pergunta } from "@db/schema";

export default function GerarJsonl() {
  const [selectedCertificacao, setSelectedCertificacao] = useState<string>();
  const [selectedPerguntas, setSelectedPerguntas] = useState<number[]>([]);

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

  const handleDownload = () => {
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

    const blob = new Blob([jsonlContent], { type: "application/x-jsonlines" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perguntas.jsonl";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                      <div key={pergunta.id} className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedPerguntas.includes(pergunta.id)}
                          onCheckedChange={(checked) => {
                            setSelectedPerguntas(prev =>
                              checked
                                ? [...prev, pergunta.id]
                                : prev.filter(id => id !== pergunta.id)
                            );
                          }}
                        />
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

              <Button
                onClick={handleDownload}
                disabled={selectedPerguntas.length === 0}
              >
                Gerar JSONL
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
