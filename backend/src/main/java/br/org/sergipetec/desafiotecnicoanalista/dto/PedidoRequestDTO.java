package br.org.sergipetec.desafiotecnicoanalista.dto;

import br.org.sergipetec.desafiotecnicoanalista.model.Pedido;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.executable.ValidateOnExecution;

import java.time.LocalDateTime;
import java.util.List;

public class PedidoRequestDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataPedido;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String clienteNome;
    private Long clienteId;
    @Valid
    private List<PedidoItemRequestDTO> itens;

    public PedidoRequestDTO() {
    }

    public PedidoRequestDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.clienteId = pedido.getCliente().getId();
        this.dataPedido = pedido.getDataPedido();
        this.clienteNome = pedido.getCliente().getNome();
        this.itens = pedido.getItens().stream().map(PedidoItemRequestDTO::new).toList();
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public Long getId() {
        return id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public List<PedidoItemRequestDTO> getItens() {
        return itens;
    }

    public void setItens(List<PedidoItemRequestDTO> itens) {
        this.itens = itens;
    }
}
