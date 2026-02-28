package br.org.sergipetec.desafiotecnicoanalista.repository;

import br.org.sergipetec.desafiotecnicoanalista.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query(value = """
    SELECT DISTINCT p
    FROM Pedido p
    LEFT JOIN p.itens i
    LEFT JOIN i.produto pr
    WHERE (:clienteId IS NULL OR p.cliente.id = :clienteId)
    AND (:produtoId IS NULL OR pr.id = :produtoId)
    AND (
        (:inicio IS NULL OR :fim IS NULL)
        OR p.dataPedido BETWEEN :inicio AND :fim
    )
    """,
            countQuery = """
    SELECT COUNT(DISTINCT p)
    FROM Pedido p
    LEFT JOIN p.itens i
    LEFT JOIN i.produto pr
    WHERE (:clienteId IS NULL OR p.cliente.id = :clienteId)
    AND (:produtoId IS NULL OR pr.id = :produtoId)
    AND (
        (:inicio IS NULL OR :fim IS NULL)
        OR p.dataPedido BETWEEN :inicio AND :fim
    )
    """)
    Page<Pedido> buscarComFiltros(
            Long clienteId,
            Long produtoId,
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable
    );
}
