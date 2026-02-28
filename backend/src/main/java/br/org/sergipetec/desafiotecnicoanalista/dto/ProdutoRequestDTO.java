package br.org.sergipetec.desafiotecnicoanalista.dto;

import br.org.sergipetec.desafiotecnicoanalista.model.Produto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProdutoRequestDTO {
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        private Long id;
        private String descricao;
        @PositiveOrZero(message = "O valor do produto deve ser zero ou positivo")
        private BigDecimal valor;
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        private LocalDateTime dataCadastro;
        @Positive(message = "A quantidade em estoque deve ser maior que zero")
        private Integer quantidadeEstoque;

        public ProdutoRequestDTO() {
        }

        public ProdutoRequestDTO(Produto produto) {
                this.id = produto.getId();
                this.descricao = produto.getDescricao();
                this.valor = produto.getValor();
                this.quantidadeEstoque = produto.getQuantidadeEstoque();
                this.dataCadastro = produto.getDataCadastro();
        }

        public Long getId() {
                return id;
        }

        public LocalDateTime getDataCadastro() {
                return dataCadastro;
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
}
