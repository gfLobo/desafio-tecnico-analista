package br.org.sergipetec.desafiotecnicoanalista.controller;

import br.org.sergipetec.desafiotecnicoanalista.dto.ApiResponseDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.ProdutoRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.service.ProdutoService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ProdutoRequestDTO>> criar(@RequestBody @Valid ProdutoRequestDTO produto) {
        try{
            return ResponseEntity.created(new URI("")).body(ApiResponseDTO.ok(service.salvar(produto)));
        }
        catch(Exception e){
            return ResponseEntity.internalServerError().body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<PagedModel<ProdutoRequestDTO>>> listar(
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(sort = "id") Pageable pageable) {

        try {

            Page<ProdutoRequestDTO> produtos =
                    (search != null && !search.isBlank())
                            ? service.buscarPorIdOuDescricao(search, pageable)
                            : service.listarTodos(pageable);

            return ResponseEntity.ok(
                    ApiResponseDTO.ok(new PagedModel<>(produtos))
            );

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponseDTO.error("Erro interno no servidor: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ProdutoRequestDTO>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.ok(service.buscarPorId(id)));
    }
}