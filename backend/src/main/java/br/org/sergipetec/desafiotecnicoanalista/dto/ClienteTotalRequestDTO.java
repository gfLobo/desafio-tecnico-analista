package br.org.sergipetec.desafiotecnicoanalista.dto;

import java.math.BigDecimal;

public class ClienteTotalRequestDTO extends ClienteRequestDTO {
    private Long id;
    private String nome;
    private String email;
    private BigDecimal valorTotalPedidos;

    public ClienteTotalRequestDTO(Long id, String nome, String email, BigDecimal valorTotalPedidos) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.valorTotalPedidos = valorTotalPedidos;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public BigDecimal getValorTotalPedidos() { return valorTotalPedidos; }
}
