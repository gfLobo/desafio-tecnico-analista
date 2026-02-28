package br.org.sergipetec.desafiotecnicoanalista.repository;

import br.org.sergipetec.desafiotecnicoanalista.dto.ClienteTotalRequestDTO;
import br.org.sergipetec.desafiotecnicoanalista.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    @Query("""
       SELECT c FROM Cliente c
       WHERE (:search IS NULL OR
              LOWER(c.nome) LIKE LOWER(CONCAT('%', :search, '%')) OR
              CAST(c.id AS string) = :search)
       """)
    Page<Cliente> buscarPorIdOuNomeUnico(
            @Param("search") String search,
            Pageable pageable);

    Page<Cliente> findAll(Pageable pageable);

    @Query("""
    SELECT new br.org.sergipetec.desafiotecnicoanalista.dto.ClienteTotalRequestDTO(        
        c.id,
        c.nome,
        c.email,
        COALESCE(SUM(i.valor * i.quantidade), 0)
    )
    FROM Cliente c
    LEFT JOIN Pedido p ON p.cliente = c
    LEFT JOIN p.itens i
    WHERE (:search IS NULL OR
           LOWER(c.nome) LIKE LOWER(CONCAT('%', :search, '%')) OR
           CAST(c.id AS string) = :search)
    GROUP BY c.id, c.nome, c.email
""")
    Page<ClienteTotalRequestDTO> buscarClientesComTotal(
            @Param("search") String search,
            Pageable pageable);
}
