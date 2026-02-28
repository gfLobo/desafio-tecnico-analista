package br.org.sergipetec.desafiotecnicoanalista.controller;

import br.org.sergipetec.desafiotecnicoanalista.dto.ApiResponseDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteTotalRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.service.ClienteService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ClienteRequestDTO>> criar(@RequestBody @Valid ClienteRequestDTO cliente) {
        try{
            return ResponseEntity.created(new URI("")).body(ApiResponseDTO.ok(service.salvar(cliente)));
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<PagedModel<ClienteTotalRequestDTO>>> listar(
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        try {

            Page<ClienteTotalRequestDTO> clientes =
                    service.listarComTotal(search, pageable);

            return ResponseEntity.ok(
                    ApiResponseDTO.ok(new PagedModel<>(clientes))
            );

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponseDTO.error("Erro interno no servidor: " + e.getMessage()));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ClienteRequestDTO>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.ok(service.buscarPorId(id)));
    }
}
