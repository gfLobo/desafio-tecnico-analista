package br.org.sergipetec.desafiotecnicoanalista.repository;

import br.org.sergipetec.desafiotecnicoanalista.model.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {
}
