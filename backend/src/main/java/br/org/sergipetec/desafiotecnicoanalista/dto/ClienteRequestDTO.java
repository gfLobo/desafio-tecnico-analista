package br.org.sergipetec.desafiotecnicoanalista.dto;

import br.org.sergipetec.desafiotecnicoanalista.model.Cliente;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;

import java.time.LocalDateTime;

public class ClienteRequestDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    private String nome;
    @Email(message = "O email deve ser válido")
    private String email;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataCadastro;

    public ClienteRequestDTO() {
    }

    public ClienteRequestDTO(Cliente cliente) {
        this.id = cliente.getId();
        this.nome = cliente.getNome();
        this.email = cliente.getEmail();
        this.dataCadastro = cliente.getDataCadastro();
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public Long getId() {
        return id;
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
}
