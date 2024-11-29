import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Componente principal do painel de controle
export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel de Controle</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1.234</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">856</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificações Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">342</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Última Atualização</span>
                <span>2 horas atrás</span>
              </div>
              <div className="flex justify-between">
                <span>Desempenho</span>
                <span>98,5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Em Andamento</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span>Agendadas</span>
                <span>5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
