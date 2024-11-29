import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function TrainModel() {
  const [file, setFile] = useState<File | null>(null);
  const [epochs, setEpochs] = useState([3]);
  const [batchSize, setBatchSize] = useState([16]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsTraining(true);
    setProgress(0);

    // Simulated progress for now
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 1;
      });
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Treinar Modelo</h1>
          <p className="text-muted-foreground">
            Configure e inicie o treinamento do modelo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquivo de Treinamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="jsonl">Arquivo JSONL</Label>
                <Input
                  id="jsonl"
                  type="file"
                  accept=".jsonl"
                  onChange={handleFileChange}
                  disabled={isTraining}
                />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {file.name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Treinamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Epochs: {epochs[0]}</Label>
                  <Slider
                    value={epochs}
                    onValueChange={setEpochs}
                    min={1}
                    max={10}
                    step={1}
                    disabled={isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Batch Size: {batchSize[0]}</Label>
                  <Slider
                    value={batchSize}
                    onValueChange={setBatchSize}
                    min={8}
                    max={64}
                    step={8}
                    disabled={isTraining}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {isTraining && (
            <Card>
              <CardHeader>
                <CardTitle>Progresso do Treinamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {progress}% completo
                </p>
              </CardContent>
            </Card>
          )}

          <Button type="submit" disabled={!file || isTraining}>
            {isTraining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Treinando...
              </>
            ) : (
              "Iniciar Treinamento"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
