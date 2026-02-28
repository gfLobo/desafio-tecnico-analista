package br.org.sergipetec.desafiotecnicoanalista.repository;

import br.org.sergipetec.desafiotecnicoanalista.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Query("SELECT p FROM Produto p " +
            "WHERE (:search IS NULL OR " +
            "LOWER(p.descricao) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "CAST(p.id AS string) = :search)")
    Page<Produto> buscarPorIdOuDescricao(
            @Param("search") String search,
            Pageable pageable);
}
