import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  HelpCircle,
  Award,
  Users,
  Settings,
  MessageSquare,
  Zap,
  History,
  FileJson,
  Brain,
  Activity,
  ListPlus,
  Plus,
  List,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const menuSections: MenuSection[] = [
  {
    title: "Perguntas",
    items: [
      { name: "Listar", path: "/perguntas/list", icon: <List size={20} /> },
      { name: "Criar", path: "/perguntas/create", icon: <Plus size={20} /> },
    ],
  },
  {
    title: "Certificações",
    items: [
      { name: "Listar", path: "/certificacoes/list", icon: <List size={20} /> },
      { name: "Criar", path: "/certificacoes/create", icon: <Plus size={20} /> },
    ],
  },
  {
    title: "Usuários",
    items: [
      { name: "Listar", path: "/usuarios/list", icon: <List size={20} /> },
      { name: "Criar", path: "/usuarios/create", icon: <Plus size={20} /> },
    ],
  },
  {
    title: "Fine-Tuning",
    items: [
      { name: "Gerar JSONL", path: "/fine-tuning/jsonl", icon: <FileJson size={20} /> },
      { name: "Treinar Modelo", path: "/fine-tuning/train", icon: <Brain size={20} /> },
      { name: "Status do Modelo", path: "/fine-tuning/status", icon: <Activity size={20} /> },
    ],
  },
  {
    title: "Campanhas",
    items: [
      { name: "Listar", path: "/campanhas/list", icon: <List size={20} /> },
      { name: "Criar", path: "/campanhas/create", icon: <Plus size={20} /> },
    ],
  },
  {
    title: "Mensagens",
    items: [
      { name: "Histórico", path: "/mensagens/historico", icon: <History size={20} /> },
    ],
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(
    menuSections.map((section) => section.title)
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="w-64 min-h-screen bg-card border-r">
      <div className="p-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-lg font-semibold"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
      </div>

      <nav className="space-y-1 px-2">
        {menuSections.map((section) => (
          <Collapsible
            key={section.title}
            open={openSections.includes(section.title)}
            onOpenChange={() => toggleSection(section.title)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start font-medium"
              >
                <span className="flex items-center">
                  {section.title}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {section.items.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start pl-8",
                      location === item.path && "bg-accent"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    </div>
  );
}
