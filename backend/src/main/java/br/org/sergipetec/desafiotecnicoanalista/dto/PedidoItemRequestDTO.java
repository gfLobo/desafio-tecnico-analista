package br.org.sergipetec.desafiotecnicoanalista.dto;

import br.org.sergipetec.desafiotecnicoanalista.model.PedidoItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class PedidoItemRequestDTO {

    private Long produtoId;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String descricao;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal valor;
    @Positive(message = "A quantidade deve ser maior que zero")
    private Integer quantidade;
    @PositiveOrZero(message = "O desconto deve ser maior ou igual a zero")
    @DecimalMax(value = "99.99", inclusive = true, message = "O desconto deve ser menor que 100")
    private BigDecimal desconto;

    public PedidoItemRequestDTO() {
    }

    public PedidoItemRequestDTO(PedidoItem pedidoItem) {
        this.produtoId = pedidoItem.getProduto().getId();
        this.descricao = pedidoItem.getProduto().getDescricao();
        this.valor = pedidoItem.getValor();
        this.quantidade = pedidoItem.getQuantidade();
        this.desconto = pedidoItem.getDesconto();
    }

    public String getDescricao() {
        return descricao;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getDesconto() {
        return desconto;
    }

    public void setDesconto(BigDecimal desconto) {
        this.desconto = desconto;
    }
}
