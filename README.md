# GestãoPro — Sistema de Clientes, Produtos e Pedidos

![alt text](/docs/images/clientes.png)
![alt text](/docs/images/produtos.png)
![alt text](/docs/images/pedidos.png)
---

## Parte 1 — Modelagem de Dados

Entidades principais:

* **CLIENTE**
* **PRODUTO**
* **PEDIDO**
* **PEDIDO_ITEM**

Relacionamentos:

![alt text](/docs/images/relacionamentos.png)



Scripts de criação das tabelas:

```
backend/db-init
```
> Obs: Tabelas auto geradas durante build do docker. Ver em: [Parte 4 - Execução via Docker](#parte-4--execução-via-docker)
---

## Parte 2 — API REST (Spring Boot)

Tecnologias:

* Java 21
* Spring Boot
* Spring Data JPA
* Spring Validation
* Native Query
* SpringDoc OpenAPI (Swagger)
* Oracle XE

### Endpoints principais

| Método | Endpoint       |
| ------ | -------------- |
| `GET`    | /clientes      |
| `GET`    | /clientes/{id} |
| `POST`   | /clientes      |
| `GET`    | /produtos      |
| `GET`    | /produtos/{id} |
| `POST`   | /produtos      |
| `GET`    | /pedidos       |
| `GET`    | /pedidos/{id}  |
| `POST`   | /pedidos       |



---

### Estrutura da aplicação

```
├─ config/
├─ controller/
├─ dto/
├─ service/
├─ repository/
├─ model/
├─ exception/
└─ DesafioTecnicoAnalistaApplication.java
```

---

### API Response

Todos os endpoints retornam um padrão único de resposta:

```json
{
  "success": true,
  "message": "Descrição da operação",
  "data": {}
}
```

Paginação:

```json
{
  "success": true,
  "data": {
    "content": [],
    "page": {
      "size": 10,
      "number": 0,
      "totalElements": 100,
      "totalPages": 10
    }
  }
}
```

Campos:

| Campo   | Tipo    | Descrição              |
| ------- | ------- | ---------------------- |
| success | boolean | Indica sucesso ou erro |
| message | String  | Mensagem informativa   |
| data    | T       | Dados retornados       |

**Decisão:** padronização facilita consumo no frontend e tratamento global de erros.

---

### Paginação

Aplicada em todas as listagens:

Parâmetros:

* `page`
* `size`
* `sort`
* `search`

Exemplo:

> `GET` 
<pre>/pedidos?clienteId=5&produtoId=3&inicio=2026-01-01&fim=2026-01-31&page=0&size=5&sort=dataPedido,DESC
</pre> 


---

### Logs de Requisições

Todos os endpoints da API registram automaticamente as requisições e respostas usando o `LoggingInterceptor`. Exemplo de log no console:

```cmd
2026-02-27T20:05:19.604-03:00  INFO --- Incoming Request: GET /produtos/3 from 0:0:0:0:0:0:0:1
2026-02-27T20:05:19.611-03:00  INFO --- Response: GET /produtos/3 -> status 200
2026-02-27T20:05:21.730-03:00  INFO --- Incoming Request: GET /produtos/1 from 0:0:0:0:0:0:0:1
2026-02-27T20:05:21.739-03:00  INFO --- Response: GET /produtos/1 -> status 200
```

> **Observação:** Em caso de exceções, o log também registra o erro:

```cmd
2026-02-27T20:06:00.123-03:00  ERROR --- Exception occurred: NullPointerException
```

---

### Swagger

Documentação disponível em:

```
http://localhost:8080/swagger-ui.html
```

---

## Parte 3 — Frontend (React)

Tecnologias:

* React 18 + Vite
* TypeScript
* React Query
* Zustand
* React Hook Form + Zod
* ShadCN + Tailwind

Decisões:

* Consumo padronizado via `ApiResponse<T>`
* Controle de cache e paginação com React Query

---

## Parte 4 — Execução via Docker
A aplicação foi embutida no docker para uma solução profissional e testes simplificados.

Perfeito! Aqui está uma versão resumida, focando apenas na instalação do Docker e Docker Compose para Windows, Mac e Linux:

---

## Parte 4 — Execução via Docker


**Pré-requisitos**

* Baixe e instale o [Docker Desktop](https://www.docker.com/get-started).

* Verifique a instalação com os comandos:

```bash
docker --version
docker-compose --version
```

---


Containers utilizados:

* gestaopro-frontend → React + Vite
* gestaopro-backend → API Spring Boot
* gestaopro-db → Oracle XE

Como executar:

```bash
docker compose up --build
```

URLs de acesso:

* Frontend: [http://localhost:8081](http://localhost:8081)
* Backend: [http://localhost:8080](http://localhost:8080)
* Swagger (Documentação API): [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Banco: `jdbc:oracle:thin:@localhost:1521/XEPDB1`
 - usuário: `sergipetec`
 - senha: `sergipetec`
