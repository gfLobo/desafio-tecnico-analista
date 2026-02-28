package br.org.sergipetec.desafiotecnicoanalista.service;

import br.org.sergipetec.desafiotecnicoanalista.dto.PedidoItemRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.PedidoRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.exception.ForaDeEstoqueException;
import br.org.sergipetec.desafiotecnicoanalista.exception.NaoEncontradoException;
import br.org.sergipetec.desafiotecnicoanalista.model.Cliente;
import br.org.sergipetec.desafiotecnicoanalista.model.Pedido;
import br.org.sergipetec.desafiotecnicoanalista.model.PedidoItem;
import br.org.sergipetec.desafiotecnicoanalista.model.Produto;
import br.org.sergipetec.desafiotecnicoanalista.repository.ClienteRepository;
import br.org.sergipetec.desafiotecnicoanalista.repository.PedidoRepository;
import br.org.sergipetec.desafiotecnicoanalista.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ClienteRepository clienteRepository,
                         ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public PedidoRequestDTO criarPedido(Long clienteId, List<PedidoItemRequestDTO> itensDTO) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NaoEncontradoException("Cliente ID = " + clienteId + " não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());

        List<PedidoItem> itensPedido = new ArrayList<>();

        for (PedidoItemRequestDTO itemDTO : itensDTO) {

            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new NaoEncontradoException("Produto ID = " + itemDTO.getProdutoId() + " não encontrado"));



            if (produto.getQuantidadeEstoque() < itemDTO.getQuantidade()) {
                throw new ForaDeEstoqueException("Estoque insuficiente para o produto: "
                        + produto.getId() + " - " + produto.getDescricao());
            }

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDTO.getQuantidade());
            produtoRepository.save(produto);

            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(pedido);
            pedidoItem.setProduto(produto);
            pedidoItem.setQuantidade(itemDTO.getQuantidade());
            pedidoItem.setValor(produto.getValor());
            pedidoItem.setDesconto(itemDTO.getDesconto() != null ? itemDTO.getDesconto() : BigDecimal.ZERO);

            itensPedido.add(pedidoItem);
        }

        pedido.setItens(itensPedido);

        pedido = pedidoRepository.save(pedido);

        return buscarPorId(pedido.getId());
    }

    public Page<PedidoRequestDTO> buscarComFiltros(
            Long clienteId,
            Long produtoId,
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable) {

        if (clienteId != null) {
            clienteRepository.findById(clienteId)
                    .orElseThrow(() -> new NaoEncontradoException("Cliente ID = " + clienteId + " não encontrado"));
        }

        if (produtoId != null) {
            produtoRepository.findById(produtoId)
                    .orElseThrow(() -> new NaoEncontradoException("Produto ID = " + produtoId + " não encontrado"));
        }

        return pedidoRepository
                .buscarComFiltros(clienteId, produtoId, inicio, fim, pageable)
                .map(PedidoRequestDTO::new);
    }

    public PedidoRequestDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Pedido ID = " + id + " não encontrado"));
        return new PedidoRequestDTO(pedido);
    }

}