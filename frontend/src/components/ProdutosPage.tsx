import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Produto } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ArrowLeft, ArrowRight, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function ProdutosPage() {
  const {
    produtos,
    addProduto,
    searchProdutos,
    produtoPage,
    produtoTotalPages,
    produtoTotalElements,
    setProdutoPage,
  } = useStore();

  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState({ descricao: "", valor: "", quantidadeEstoque: "" });

  function openNew() {
    setEditing(null);
    setForm({ descricao: "", valor: "", quantidadeEstoque: "" });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descricao.trim() || !form.valor || !form.quantidadeEstoque) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const data = {
      descricao: form.descricao,
      valor: parseFloat(form.valor),
      quantidadeEstoque: parseInt(form.quantidadeEstoque),
    };

    addProduto(data);
    toast({ title: "Produto cadastrado com sucesso!" });
    setOpen(false);
  }

  function stockBadge(qty: number) {
    if (qty === 0) return <span className="badge-danger">Sem estoque</span>;
    if (qty <= 5) return <span className="badge-warning">{qty} un.</span>;
    return <span className="badge-success">{qty} un.</span>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie o catálogo de produtos e estoque</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={16} />
          Novo Produto
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative w-96 flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Buscar por descrição ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            <Button
              onClick={async () => await searchProdutos(search)}
              className="ml-2"
            >
              Buscar
            </Button>
          </div>
        </div>

        {produtos.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Estoque</th>
                <th>Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td className="text-muted-foreground font-mono text-xs">{p.id}</td>
                  <td className="font-medium">{p.descricao}</td>
                  <td>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-blue-800">
                      {formatCurrency(p.valor)}
                    </span>
                  </td>
                  <td>{stockBadge(p.quantidadeEstoque)}</td>
                  <td className="text-muted-foreground">{p.dataCadastro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginação */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {produtoPage + 1} de {produtoTotalPages} • {produtoTotalElements} registros
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={produtoPage === 0}
              onClick={() => setProdutoPage(produtoPage - 1)}
            >
              <ArrowLeft size={16} />
              Anterior
            </Button>

            <Button
              size="sm"
              disabled={produtoPage + 1 >= produtoTotalPages}
              onClick={() => setProdutoPage(produtoPage + 1)}
            >
              Próxima
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogo de Cadastro */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                required
                id="descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Nome/descrição do produto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  required
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="estoque">Qtd. em Estoque *</Label>
                <Input
                  required
                  id="estoque"
                  type="number"
                  min="1"
                  value={form.quantidadeEstoque}
                  onChange={(e) => setForm({ ...form, quantidadeEstoque: e.target.value })}
                  placeholder="1"
                />
              </div>
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