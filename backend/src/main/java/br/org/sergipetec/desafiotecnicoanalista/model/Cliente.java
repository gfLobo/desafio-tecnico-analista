package br.org.sergipetec.desafiotecnicoanalista.model;

import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteRequestDTO;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CLIENTE",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_CLIENTE_EMAIL", columnNames = "EMAIL")
        },
        indexes = {
                @Index(name = "IDX_CLIENTE_NOME", columnList = "NOME")
        })
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NOME", length = 150, nullable = false)
    private String nome;

    @Column(name = "EMAIL", length = 150, nullable = false)
    private String email;

    @Column(name = "DATA_CADASTRO", nullable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos;

    public Cliente() {
    }

    public Cliente(ClienteRequestDTO clienteRequestDTO){
        this.nome = clienteRequestDTO.getNome();
        this.email = clienteRequestDTO.getEmail();
    }

    public Cliente(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }
}
