package br.org.sergipetec.desafiotecnicoanalista.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "PEDIDO",
        indexes = {
                @Index(name = "IDX_PEDIDO_CLIENTE", columnList = "CLIENTE_ID"),
                @Index(name = "IDX_PEDIDO_DATA", columnList = "DATA_PEDIDO")
        })
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "CLIENTE_ID",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_PEDIDO_CLIENTE"))
    private Cliente cliente;

    @Column(name = "DATA_PEDIDO", nullable = false)
    private LocalDateTime dataPedido = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens;


    public Pedido() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public List<PedidoItem> getItens() {
        return itens;
    }

    public void setItens(List<PedidoItem> itens) {
        this.itens = itens;
    }
}
