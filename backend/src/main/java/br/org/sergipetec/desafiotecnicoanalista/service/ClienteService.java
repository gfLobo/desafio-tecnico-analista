package br.org.sergipetec.desafiotecnicoanalista.service;

import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteTotalRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.exception.NaoEncontradoException;
import br.org.sergipetec.desafiotecnicoanalista.model.Cliente;
import br.org.sergipetec.desafiotecnicoanalista.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public ClienteRequestDTO salvar(ClienteRequestDTO cliente) {
        return new ClienteRequestDTO(repository.save(new Cliente(cliente)));
    }



    public ClienteRequestDTO buscarPorId(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Cliente ID = " + id + " não encontrado"));
        return new ClienteRequestDTO(cliente);
    }

    public Page<ClienteTotalRequestDTO> listarComTotal(String search, Pageable pageable) {
        return repository.buscarClientesComTotal(search, pageable);
    }
}
