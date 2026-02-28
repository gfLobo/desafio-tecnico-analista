package br.org.sergipetec.desafiotecnicoanalista.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "PEDIDO_ITEM",
        indexes = {
                @Index(name = "IDX_ITEM_PEDIDO", columnList = "PEDIDO_ID"),
                @Index(name = "IDX_ITEM_PRODUTO", columnList = "PRODUTO_ID")
        })
public class PedidoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "PEDIDO_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_ITEM_PEDIDO"))
    private Pedido pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "PRODUTO_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_ITEM_PRODUTO"))
    private Produto produto;

    @Column(name = "VALOR", precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(name = "QUANTIDADE", nullable = false)
    private Integer quantidade;

    @Column(name = "DESCONTO", precision = 15, scale = 2, nullable = false)
    private BigDecimal desconto = BigDecimal.ZERO;


    public PedidoItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
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
