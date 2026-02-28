package br.org.sergipetec.desafiotecnicoanalista.model;

import br.org.sergipetec.desafiotecnicoanalista.dto.ProdutoRequestDTO;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "PRODUTO",
        indexes = {
                @Index(name = "IDX_PRODUTO_DESCRICAO", columnList = "DESCRICAO")
        })
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DESCRICAO", length = 200, nullable = false)
    private String descricao;

    @Column(name = "VALOR", precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(name = "QUANTIDADE_ESTOQUE", nullable = false)
    private Integer quantidadeEstoque;

    @Column(name = "DATA_CADASTRO", nullable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @OneToMany(mappedBy = "produto")
    private List<PedidoItem> itens;


    public Produto() {
    }

    public Produto(ProdutoRequestDTO produto) {
        this.descricao = produto.getDescricao();
        this.valor = produto.getValor();
        this.quantidadeEstoque = produto.getQuantidadeEstoque();
    }





    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public List<PedidoItem> getItens() {
        return itens;
    }

    public void setItens(List<PedidoItem> itens) {
        this.itens = itens;
    }
}
