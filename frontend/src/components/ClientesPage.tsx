import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Cliente } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ArrowLeft, ArrowRight, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}


export function ClientesPage() {
  const {
    clientes,
    addCliente,
    searchClientes,
    clientePage,
    clienteTotalPages,
    clienteTotalElements,
    setClientePage,
  } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: "", email: "" });



  function openNew() {
    setEditing(null);
    setForm({ nome: "", email: "" });
    setOpen(true);
  }


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    addCliente(form);
    toast({ title: "Cliente cadastrado com sucesso!" });

    setOpen(false);
  }


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie o cadastro de clientes</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={16} />
          Novo Cliente
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative w-96 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Buscar por nome ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            <Button
              onClick={async () => {
                await searchClientes(search);
              }}
              className="ml-2"
            >
              Buscar
            </Button>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <User size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Data de Cadastro</th>
                <th>Valor Total de Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td className="text-muted-foreground font-mono text-xs">{c.id}</td>
                  <td className="font-medium">{c.nome}</td>
                  <td className="text-muted-foreground">{c.email}</td>
                  <td className="text-muted-foreground">{c.dataCadastro}</td>
                  <td>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-success/10 text-green-800">
                      {formatCurrency(c.valorTotalPedidos)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {clientePage + 1} de {clienteTotalPages} • {clienteTotalElements} registros
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={clientePage === 0}
              onClick={() => setClientePage(clientePage - 1)}
            >
              <ArrowLeft size={16} />
              Anterior
            </Button>

            <Button
              size="sm"
              disabled={clientePage + 1 >= clienteTotalPages}
              onClick={() => setClientePage(clientePage + 1)}
            >
              Próxima
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
