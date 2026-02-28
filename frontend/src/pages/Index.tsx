import { useEffect, useState } from "react";
import { ClientesPage } from "@/components/ClientesPage";
import { ProdutosPage } from "@/components/ProdutosPage";
import { PedidosPage } from "@/components/PedidosPage";
import { useStore } from "@/store/useStore";
import { Users, Package, ShoppingCart } from "lucide-react";
import { Pedido } from "@/types";

type Tab =  "clientes" | "produtos" | "pedidos";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

const Index = () => {
  const [tab, setTab] = useState<Tab>("pedidos");



  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "clientes", label: "Clientes", icon: <Users size={18} /> },
    { id: "produtos", label: "Produtos", icon: <Package size={18} /> },
    { id: "pedidos", label: "Pedidos", icon: <ShoppingCart size={18} /> },
  ];



  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <ShoppingCart size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-header-foreground leading-none">GestãoPro</h1>
            <p className="text-xs text-header-foreground/60 leading-none mt-0.5">Sistema de Gestão</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-card border-r border-border flex-shrink-0">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {tab === "clientes" && <ClientesPage />}
          {tab === "produtos" && <ProdutosPage />}
          {tab === "pedidos" && <PedidosPage />}
        </main>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value, colorClass, onClick }: { icon: React.ReactNode; label: string; value: string; colorClass: string; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    "stat-blue": "bg-accent text-accent-foreground",
    "stat-green": "bg-accent text-accent-foreground",
    "stat-purple": "bg-accent text-accent-foreground",
    "stat-yellow": "bg-secondary text-secondary-foreground",
  };
  return (
    <button onClick={onClick} className="bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow w-full">
      <div className={`w-10 h-10 rounded-lg ${colorMap[colorClass] ?? "bg-accent text-accent-foreground"} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </button>
  );
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:shadow-lg transition-shadow duration-200">
      {/* ID */}
      <div className="text-gray-700 font-semibold sm:pr-4 sm:border-r sm:border-gray-300">
        <span className="text-sm">ID:</span> {pedido.id}
      </div>

      {/* Cliente */}
      <div className="text-gray-600 sm:px-4 sm:border-r sm:border-gray-300">
        <span className="text-sm font-medium">Cliente ID:</span> {pedido.clienteId}
      </div>

      {/* Nome do Cliente */}
      <div className="text-gray-800 sm:pl-4">
        <span className="text-sm font-medium">Nome:</span> {pedido.clienteNome ?? "—"}
      </div>
    </div>
  );
}

export default Index;