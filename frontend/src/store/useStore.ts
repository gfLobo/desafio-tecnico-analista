import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cliente, Produto, Pedido, ItemPedido } from "@/types";
import moment from "moment";


const API_URL = "http://localhost:8080";

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return response.json();
}



interface StoreState {
  clientes: Cliente[];
  produtos: Produto[];
  pedidos: Pedido[];

  // =========================
  // PAGINAÇÃO CLIENTES
  // =========================
  clientePage: number;
  clienteSize: number;
  clienteTotalPages: number;
  clienteTotalElements: number;

  setClientePage: (page: number) => void;
  setClienteSize: (size: number) => void;

  // =========================
  // PAGINAÇÃO PRODUTOS
  // =========================
  produtoPage: number;
  produtoSize: number;
  produtoTotalPages: number;
  produtoTotalElements: number;

  setProdutoPage: (page: number) => void;
  setProdutoSize: (size: number) => void;

  // =========================
  // PAGINAÇÃO PEDIDOS
  // =========================
  pedidoPage: number;
  pedidoSize: number;
  pedidoTotalPages: number;
  pedidoTotalElements: number;

  setPedidoPage: (page: number) => void;
  setPedidoSize: (size: number) => void;

  // =========================
  dataInicio: string;
  dataFim: string;
  setDataInicio: (date: string) => void;
  setDataFim: (date: string) => void;

  addCliente: (data: Omit<Cliente, "id" | "dataCadastro" | "valorTotalPedidos">) => void;
  addProduto: (data: Omit<Produto, "id" | "dataCadastro">) => void;

  searchClientes: (search?: string, page?: number, size?: number) => Promise<void>;
  searchProdutos: (search?: string, page?: number, size?: number) => Promise<void>;
  getClienteById: (id: number) => Promise<Cliente | null>;
  getProdutoById: (id: number) => Promise<Produto | null>;

  loadPedidos: (
    inicio: string,
    fim: string,
    cliente?: string,
    produto?: string,
    page?: number,
    size?: number
  ) => Promise<void>;

  addPedido: (
    clienteId: number,
    itens: ItemPedido[]
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      const today = moment().format("YYYY-MM-DD");

      // =========================
      // CLIENTES
      // =========================
      const searchClientes = async (
        search?: string,
        page = get().clientePage,
        size = get().clienteSize
      ) => {
        try {
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          params.append("page", String(page));
          params.append("size", String(size));

          const res = await apiRequest<any>(`/clientes?${params.toString()}`);
          if (!res.success) return;

          const paged = res.data;

          set({
            clientes: paged.content.map((c: any) => ({
              id: c.id,
              nome: c.nome,
              email: c.email,
              dataCadastro: new Date(c.dataCadastro).toLocaleString("pt-BR"),
              valorTotalPedidos: c.valorTotalPedidos
            })),
            clientePage: paged.page.number,
            clienteSize: paged.page.size,
            clienteTotalPages: paged.page.totalPages,
            clienteTotalElements: paged.page.totalElements,
          });
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        }
      };

      const getClienteById = async (id: number) => {
        try {
          const res = await apiRequest<any>(`/clientes/${id}`);
          if (!res.success) return null;

          const c = res.data;
          const cliente: Cliente = {
            id: c.id,
            nome: c.nome,
            email: c.email,
            dataCadastro: new Date(c.dataCadastro).toLocaleString("pt-BR"),
            valorTotalPedidos: c.valorTotalPedidos,
          };

          // Atualiza a lista local se quiser
          set((state) => ({
            clientes: state.clientes.some((cl) => cl.id === id)
              ? state.clientes.map((cl) => (cl.id === id ? cliente : cl))
              : [...state.clientes, cliente],
          }));

          return cliente;
        } catch (error) {
          console.error("Erro ao buscar cliente por ID:", error);
          return null;
        }
      };




      // =========================
      // PRODUTOS
      // =========================
      const searchProdutos = async (
        search?: string,
        page = get().produtoPage,
        size = get().produtoSize
      ) => {
        try {
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          params.append("page", String(page));
          params.append("size", String(size));

          const res = await apiRequest<any>(`/produtos?${params.toString()}`);
          if (!res.success) return;

          const paged = res.data;

          set({
            produtos: paged.content.map((p: any) => ({
              id: p.id,
              descricao: p.descricao,
              valor: p.valor,
              quantidadeEstoque: p.quantidadeEstoque,
              dataCadastro: new Date(p.dataCadastro).toLocaleString("pt-BR"),
            })),
            produtoPage: paged.page.number,
            produtoSize: paged.page.size,
            produtoTotalPages: paged.page.totalPages,
            produtoTotalElements: paged.page.totalElements,
          });
        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
        }
      };

      const getProdutoById = async (id: number) => {
        try {
          const res = await apiRequest<any>(`/produtos/${id}`);
          if (!res.success) return null;

          const p = res.data;
          const produto: Produto = {
            id: p.id,
            descricao: p.descricao,
            valor: p.valor,
            quantidadeEstoque: p.quantidadeEstoque,
            dataCadastro: new Date(p.dataCadastro).toLocaleString("pt-BR"),
          };

          // Atualiza a lista local se quiser
          set((state) => ({
            produtos: state.produtos.some((pr) => pr.id === id)
              ? state.produtos.map((pr) => (pr.id === id ? produto : pr))
              : [...state.produtos, produto],
          }));

          return produto;
        } catch (error) {
          console.error("Erro ao buscar produto por ID:", error);
          return null;
        }
      };

      // =========================
      // PEDIDOS
      // =========================
      const loadPedidos = async (
        inicio: string,
        fim: string,
        cliente?: string,
        produto?: string,
        page = get().pedidoPage,
        size = get().pedidoSize
      ) => {
        try {
          const params = new URLSearchParams();
          params.append("inicio", inicio);
          params.append("fim", fim);
          params.append("page", String(page));
          params.append("size", String(size));

          if (cliente) params.append("clienteId", cliente);
          if (produto) params.append("produtoId", produto);

          const res = await apiRequest<any>(`/pedidos?${params.toString()}`);
          if (!res.success) return;

          const paged = res.data;

          set({
            pedidos: paged.content.map((p: any) => ({
              id: p.id,
              clienteId: p.clienteId,
              clienteNome: p.clienteNome,
              itens: p.itens,
              dataPedido: new Date(p.dataPedido).toLocaleString("pt-BR"),
            })),
            pedidoPage: paged.page.number,
            pedidoSize: paged.page.size,
            pedidoTotalPages: paged.page.totalPages,
            pedidoTotalElements: paged.page.totalElements,
          });
        } catch (error) {
          console.error("Erro ao buscar pedidos:", error);
        }
      };

      // =========================
      // RETURN STORE
      // =========================
      return {
        clientes: [],
        produtos: [],
        pedidos: [],
        dataInicio: today,
        dataFim: today,

        // CLIENTES
        clientePage: 0,
        clienteSize: 10,
        clienteTotalPages: 0,
        clienteTotalElements: 0,
        setClientePage: (page) => {
          set({ clientePage: page });
          searchClientes(undefined, page, get().clienteSize);
        },
        setClienteSize: (size) => {
          set({ clienteSize: size, clientePage: 0 });
          searchClientes(undefined, 0, size);
        },

        // PRODUTOS
        produtoPage: 0,
        produtoSize: 10,
        produtoTotalPages: 0,
        produtoTotalElements: 0,
        setProdutoPage: (page) => {
          set({ produtoPage: page });
          searchProdutos(undefined, page, get().produtoSize);
        },
        setProdutoSize: (size) => {
          set({ produtoSize: size, produtoPage: 0 });
          searchProdutos(undefined, 0, size);
        },

        // PEDIDOS
        pedidoPage: 0,
        pedidoSize: 10,
        pedidoTotalPages: 0,
        pedidoTotalElements: 0,
        setPedidoPage: (page) => {
          set({ pedidoPage: page });
          loadPedidos(get().dataInicio, get().dataFim, undefined, undefined, page, get().pedidoSize);
        },
        setPedidoSize: (size) => {
          set({ pedidoSize: size, pedidoPage: 0 });
          loadPedidos(get().dataInicio, get().dataFim, undefined, undefined, 0, size);
        },

        setDataInicio: (date) => set({ dataInicio: date }),
        setDataFim: (date) => set({ dataFim: date }),

        // =========================
        // CLIENTES
        // =========================
        addCliente: (data) => {
          apiRequest<any>("/clientes", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((res) => {
            if (!res.success) throw new Error(res.message);
            set((state) => ({
              clientes: [...state.clientes, res.data]
            }))
          });
        },

        // =========================
        // PRODUTOS
        // =========================
        addProduto: (data) => {
          apiRequest<any>("/produtos", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((res) => {
            if (!res.success) throw new Error(res.message);
            set((state) => ({
              produtos: [...state.produtos, res.data]
            }))
          });
        },

        // =========================
        // PEDIDOS
        // =========================
        addPedido: async (clienteId, itens) => {
          try {
            const res = await apiRequest<any>("/pedidos", {
              method: "POST",
              body: JSON.stringify({
                clienteId,
                itens: itens.map((i) => ({
                  produtoId: i.produtoId,
                  quantidade: i.quantidade,
                  desconto: i.desconto ?? 0,
                })),
              }),
            });

            if (!res.success) return { success: false, error: res.message };

            const novo = res.data;

            set((state) => ({
              pedidos: [
                ...state.pedidos,
                {
                  id: novo.id,
                  clienteId: novo.clienteId,
                  clienteNome: novo.clienteNome,
                  itens: novo.itens,
                  dataPedido: new Date(novo.dataPedido).toLocaleString("pt-BR"),
                },
              ],
            }));

            searchProdutos();

            return { success: true };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        },


        // =========================
        // FUNÇÕES DE BUSCA
        // =========================
        searchClientes,
        getClienteById,
        searchProdutos,
        getProdutoById,
        loadPedidos,
      };
    },
    { name: "sistema-gestao-storage" }
  )
);