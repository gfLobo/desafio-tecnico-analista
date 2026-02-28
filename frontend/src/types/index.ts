export interface Cliente {
  id: number;
  nome: string;
  email: string;
  dataCadastro: string;
  valorTotalPedidos: number;
}

export interface Produto {
  id: number;
  descricao: string;
  valor: number;
  quantidadeEstoque: number;
  dataCadastro: string;
}

export interface ItemPedido {
  produtoId: number;
  descricao:string;
  valor: number;
  quantidade: number;
  desconto: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome: string;
  itens: ItemPedido[];
  dataPedido: string;
}
