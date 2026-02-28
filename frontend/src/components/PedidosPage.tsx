import { Fragment, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { ItemPedido, Pedido } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ShoppingCart, X, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function PedidosPage() {
  const {
    pedidos,
    addPedido,
    loadPedidos,
    produtos,
    dataInicio,
    dataFim,
    pedidoPage,
    pedidoTotalPages,
    pedidoTotalElements,
    getProdutoById,
    setPedidoPage
  } = useStore();

  const { toast } = useToast();

  const [filterCliente, setFilterCliente] = useState("");
  const [filterProduto, setFilterProduto] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState(dataInicio);
  const [filterDataFim, setFilterDataFim] = useState(dataFim);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [formClienteId, setFormClienteId] = useState<number | null>(null);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [novoProdutoId, setNovoProdutoId] = useState<number | null>(null);
  const [novaQtd, setNovaQtd] = useState(1);
  const [novoDesconto, setNovoDesconto] = useState(0);

  function calcTotal(p: Pedido) {
    return p.itens.reduce((sum, i) => sum + i.valor * i.quantidade * (1 - i.desconto / 100), 0);
  }


  async function addItem() {
    if (novoProdutoId === null) {
      toast({ title: "Selecione um produto para adicionar", variant: "destructive" });
      return;
    }
    const produto = await getProdutoById(novoProdutoId);
    if (!produto) {
      toast({ title: "Produto não encontrado", variant: "destructive" });
      return;
    }
    if (itens.find((i) => i.produtoId === novoProdutoId)) {
      toast({ title: "Produto já adicionado ao pedido", variant: "destructive" });
      return;
    }
    setItens([...itens, { produtoId: novoProdutoId, descricao: produto.descricao, valor: produto.valor, quantidade: novaQtd, desconto: novoDesconto }]);
    setNovaQtd(1);
    setNovoDesconto(0);
  }

  function removeItem(produtoId: number) {
    setItens(itens.filter((i) => i.produtoId !== produtoId));
  }

  function openNew() {
    setFormClienteId(null);
    setItens([]);
    setNovoProdutoId(null);
    setNovaQtd(1);
    setNovoDesconto(0);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formClienteId) {
      toast({ title: "Selecione um cliente", variant: "destructive" });
      return;
    }
    if (itens.length === 0) {
      toast({ title: "Adicione ao menos um produto", variant: "destructive" });
      return;
    }

    const result = await addPedido(formClienteId, itens);
    if (!result.success) {
      toast({ title: result.error || "Erro ao criar pedido", variant: "destructive" });
      return;
    }

    toast({ title: "Pedido criado com sucesso!" });
    setOpen(false);
    loadFilteredPedidos();
  }

  async function loadFilteredPedidos() {
    await loadPedidos(filterDataInicio, filterDataFim, filterCliente, filterProduto, pedidoPage);
  }

  useEffect(() => {
    loadFilteredPedidos();
  }, [filterCliente, filterProduto, filterDataInicio, filterDataFim, pedidoPage]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pedidos</h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie os pedidos dos clientes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew} className="gap-2" >
            <Plus size={16} /> Novo Pedido
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setFilterCliente(""); setFilterProduto(""); }}>
            <X size={14} /> Limpar filtros
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-4">
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Search size={14} /> Filtros
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs">Cliente</Label>
            <Input
              type="number"
              placeholder="ID do cliente"
              className="h-8 text-sm"
              min={1}
              value={filterCliente}
              onChange={(e) => setFilterCliente(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs">Produto</Label>
            <Input
              type="number"
              placeholder="ID do produto"
              className="h-8 text-sm"
              min={1}
              value={filterProduto}
              onChange={(e) => setFilterProduto(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Data início</Label>
            <Input type="date" className="h-8 text-sm" value={filterDataInicio} onChange={(e) => setFilterDataInicio(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Data fim</Label>
            <Input type="date" className="h-8 text-sm" value={filterDataFim} onChange={(e) => setFilterDataFim(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Pedidos Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        {pedidos.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const total = calcTotal(p);
                const isExpanded = expandedPedido === p.id;
                return (
                  <Fragment key={p.id}>
                    <tr className="cursor-pointer" onClick={() => setExpandedPedido(isExpanded ? null : p.id)}>
                      <td>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                      <td className="text-muted-foreground font-mono text-xs">{p.id}</td>
                      <td className="font-medium">{p.clienteId} - {p.clienteNome ?? "—"}</td>
                      <td className="text-muted-foreground">{p.dataPedido}</td>
                      <td><span className="badge-info">{p.itens.length} {p.itens.length === 1 ? "item" : "itens"}</span></td>
                      <td>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-success/10 text-green-800">
                          {formatCurrency(total)}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-accent/20 p-0">
                          <div className="px-8 py-3">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-muted-foreground text-xs">
                                  <th>Produto</th>
                                  <th>Valor Unit.</th>
                                  <th>Qtd</th>
                                  <th>Desconto</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.itens.map((item) => (
                                  <tr key={item.produtoId}>
                                    <td>{item.produtoId} - {item.descricao}</td>
                                    <td>{formatCurrency(item.valor)}</td>
                                    <td>{item.quantidade}</td>
                                    <td>{item.desconto}%</td>
                                    <td>{formatCurrency(item.valor * item.quantidade * (1 - item.desconto / 100))}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Paginação */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {pedidoPage + 1} de {pedidoTotalPages} • {pedidoTotalElements} registros
          </span>
          <div className="flex gap-2">
            <Button size="sm" disabled={pedidoPage === 0} onClick={() => setPedidoPage(pedidoPage - 1)}>
              Anterior
            </Button>
            <Button size="sm" disabled={pedidoPage + 1 >= pedidoTotalPages} onClick={() => setPedidoPage(pedidoPage + 1)}>
              Próxima
            </Button>
          </div>
        </div>
      </div>

      {/* New Order Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Cliente */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente *</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="ID do cliente"
                  value={formClienteId ?? ""}
                  onChange={(e) => setFormClienteId(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Produtos */}
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm font-semibold mb-3">Produtos</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {/* Produto ID */}
                <div className="col-span-2">
                  <Label>ID</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="ID do produto"
                    value={novoProdutoId ?? ""}
                    onChange={(e) => setNovoProdutoId(Number(e.target.value))}
                  />
                </div>

                {/* Quantidade */}
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qtd"
                    value={novaQtd}
                    onChange={(e) => setNovaQtd(Number(e.target.value))}
                  />
                </div>

                {/* Desconto */}
                <div>
                  <Label>Desconto (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Desc.%"
                    value={novoDesconto}
                    onChange={(e) => setNovoDesconto(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-2 mb-3"
              >
                <Plus size={14} /> Adicionar produto
              </Button>

              {/* Lista de itens adicionados */}
              {itens.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum produto adicionado.
                </p>
              ) : (
                <div className="space-y-2">
                  {itens.map((item) => {
                    const prod = produtos.find((p) => p.id === item.produtoId);
                    const subtotal = item.valor * item.quantidade * (1 - item.desconto / 100);
                    return (
                      <div
                        key={item.produtoId}
                        className="flex items-center justify-between bg-secondary/50 rounded px-3 py-2 text-sm"
                      >
                        <span className="font-medium">{prod?.descricao}</span>
                        <span className="text-muted-foreground">
                          {item.quantidade}x {formatCurrency(item.valor)} {item.desconto > 0 ? `(-${item.desconto}%)` : ""}
                        </span>
                        <span className="font-semibold text-primary">{formatCurrency(subtotal)}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.produtoId)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    );
                  })}
                  <div className="flex justify-end pt-2 border-t border-border text-sm font-bold">
                    Total: {formatCurrency(itens.reduce((s, i) => s + i.valor * i.quantidade * (1 - i.desconto / 100), 0))}
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Pedido</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}