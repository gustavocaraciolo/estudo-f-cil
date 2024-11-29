import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";

import ListCertificacoes from "./pages/certificacoes/ListCertificacoes";
import CreateCertificacao from "./pages/certificacoes/CreateCertificacao";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/certificacoes/list" component={ListCertificacoes} />
      <Route path="/certificacoes/create" component={CreateCertificacao} />
      <Route>404 - Página Não Encontrada</Route>
    </Switch>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
