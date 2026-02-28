package br.org.sergipetec.desafiotecnicoanalista.service;


import br.org.sergipetec.desafiotecnicoanalista.dto.ProdutoRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.exception.NaoEncontradoException;
import br.org.sergipetec.desafiotecnicoanalista.model.Produto;
import br.org.sergipetec.desafiotecnicoanalista.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public ProdutoRequestDTO salvar(ProdutoRequestDTO produto) {
        return new ProdutoRequestDTO(repository.save(new Produto(produto)));
    }



    public ProdutoRequestDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                    .orElseThrow(() -> new NaoEncontradoException("Produto ID = " + id + " não encontrado"));

        return new ProdutoRequestDTO(produto);
    }


    public Page<ProdutoRequestDTO> listarTodos(Pageable pageable) {
        return repository.findAll(pageable)
                .map(ProdutoRequestDTO::new);
    }


    public Page<ProdutoRequestDTO> buscarPorIdOuDescricao(String busca, Pageable pageable) {
        return repository.buscarPorIdOuDescricao(busca, pageable)
                .map(ProdutoRequestDTO::new);
    }
}
