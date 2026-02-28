package br.org.sergipetec.desafiotecnicoanalista.controller;

import br.org.sergipetec.desafiotecnicoanalista.dto.ApiResponseDTO;
import br.org.sergipetec.desafiotecnicoanalista.dto.PedidoRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.exception.ForaDeEstoqueException;
import br.org.sergipetec.desafiotecnicoanalista.exception.NaoEncontradoException;
import br.org.sergipetec.desafiotecnicoanalista.service.PedidoService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<PedidoRequestDTO>> criar(@RequestBody @Valid PedidoRequestDTO request) {
        try{
            return ResponseEntity.created(new URI("")).body(ApiResponseDTO.ok(service.criarPedido(request.getClienteId(), request.getItens())));
        }
        catch(NaoEncontradoException | ForaDeEstoqueException e){
            return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
        }
        catch(Exception e){
            return ResponseEntity.internalServerError().body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<PedidoRequestDTO>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.ok(service.buscarPorId(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<PagedModel<PedidoRequestDTO>>> buscarComFiltros(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long produtoId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate inicio,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fim,
            @ParameterObject @PageableDefault(sort = "dataPedido", direction = Sort.Direction.DESC)
            Pageable pageable) {

        try {

            LocalDateTime inicioDateTime = inicio.atStartOfDay();
            LocalDateTime fimDateTime = fim.atTime(23, 59, 59);

            Page<PedidoRequestDTO> pedidos =
                    service.buscarComFiltros(clienteId, produtoId, inicioDateTime, fimDateTime, pageable);

            return ResponseEntity.ok(
                    ApiResponseDTO.ok(new PagedModel<>(pedidos))
            );

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponseDTO.error("Erro interno no servidor: " + e.getMessage()));
        }
    }


}