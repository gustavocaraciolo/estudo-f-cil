import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ModelStatus() {
  // Mock data - will be replaced with real data from API
  const currentStatus = {
    status: "training", // training, completed, failed
    currentEpoch: 2,
    totalEpochs: 3,
    accuracy: 0.89,
    loss: 0.23,
  };

  const trainingHistory = [
    {
      id: 1,
      date: "2024-11-29",
      epochs: 3,
      batchSize: 16,
      finalAccuracy: 0.92,
      status: "completed",
    },
    {
      id: 2,
      date: "2024-11-28",
      epochs: 5,
      batchSize: 32,
      finalAccuracy: 0.88,
      status: "completed",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      training: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Status do Modelo</h1>
          <p className="text-muted-foreground">
            Acompanhe o status e o desempenho do modelo
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {getStatusBadge(currentStatus.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Progresso:</span>
                  <span>
                    Epoch {currentStatus.currentEpoch} de {currentStatus.totalEpochs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Acurácia:</span>
                  <span>{(currentStatus.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Loss:</span>
                  <span>{currentStatus.loss.toFixed(4)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Treinamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Epochs</TableHead>
                    <TableHead>Batch Size</TableHead>
                    <TableHead>Acurácia Final</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingHistory.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>{training.date}</TableCell>
                      <TableCell>{training.epochs}</TableCell>
                      <TableCell>{training.batchSize}</TableCell>
                      <TableCell>
                        {(training.finalAccuracy * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell>{getStatusBadge(training.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
