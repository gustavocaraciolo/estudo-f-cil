export const routes = {
  dashboard: "/",
  perguntas: {
    list: "/perguntas/list",
    create: "/perguntas/create",
  },
  certificacoes: {
    list: "/certificacoes/list",
    create: "/certificacoes/create",
  },
  usuarios: {
    list: "/usuarios/list",
    create: "/usuarios/create",
  },
  fineTuning: {
    jsonl: "/fine-tuning/jsonl",
    train: "/fine-tuning/train",
    status: "/fine-tuning/status",
  },
  campanhas: {
    list: "/campanhas/list",
    create: "/campanhas/create",
  },
  mensagens: {
    historico: "/mensagens/historico",
  },
} as const;
