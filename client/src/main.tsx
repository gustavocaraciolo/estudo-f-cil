import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";

import ListCertificacoes from "./pages/certificacoes/ListCertificacoes";
import CreateCertificacao from "./pages/certificacoes/CreateCertificacao";
import EditCertificacao from "./pages/certificacoes/EditCertificacao";

import ListUsuarios from "./pages/usuarios/ListUsuarios";
import CreateUsuario from "./pages/usuarios/CreateUsuario";
import EditUsuario from "./pages/usuarios/EditUsuario";

import ListPerguntas from "./pages/perguntas/ListPerguntas";
import CreatePergunta from "./pages/perguntas/CreatePergunta";
import EditPergunta from "./pages/perguntas/EditPergunta";
import GerarJsonl from "./pages/GerarJsonl";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/certificacoes/list" component={ListCertificacoes} />
      <Route path="/certificacoes/create" component={CreateCertificacao} />
      <Route path="/certificacoes/edit/:id" component={EditCertificacao} />
      <Route path="/usuarios/list" component={ListUsuarios} />
      <Route path="/usuarios/create" component={CreateUsuario} />
      <Route path="/usuarios/edit/:id" component={EditUsuario} />
      <Route path="/perguntas/list" component={ListPerguntas} />
      <Route path="/perguntas/create" component={CreatePergunta} />
      <Route path="/perguntas/edit/:id" component={EditPergunta} />
      <Route path="/fine-tuning/jsonl" component={GerarJsonl} />
      <Route>404 - Página Não Encontrada</Route>
    </Switch>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
