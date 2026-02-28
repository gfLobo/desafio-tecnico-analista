-- ============================================
-- DESAFIO TÉCNICO - SCRIPT ORACLE
-- ============================================

-- ============================================
-- USUÁRIO: sergipetec
-- ============================================
CREATE USER sergipetec IDENTIFIED BY sergipetec;

GRANT CREATE SESSION TO sergipetec;
GRANT CREATE TABLE TO sergipetec;
GRANT CREATE SEQUENCE TO sergipetec;
GRANT CREATE VIEW TO sergipetec;
GRANT CREATE TRIGGER TO sergipetec;

ALTER USER sergipetec QUOTA UNLIMITED ON USERS;

-- =========================
-- TABELA: CLIENTE
-- =========================
CREATE TABLE CLIENTE (
                         ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         NOME VARCHAR2(150) NOT NULL,
                         EMAIL VARCHAR2(150) NOT NULL,
                         DATA_CADASTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                         CONSTRAINT UK_CLIENTE_EMAIL UNIQUE (EMAIL)
);



-- =========================
-- TABELA: PRODUTO
-- =========================
CREATE TABLE PRODUTO (
                         ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         DESCRICAO VARCHAR2(200) NOT NULL,
                         VALOR NUMBER(15,2) NOT NULL,
                         QUANTIDADE_ESTOQUE NUMBER(10) NOT NULL,
                         DATA_CADASTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

                         CONSTRAINT CK_PRODUTO_VALOR CHECK (VALOR >= 0),
                         CONSTRAINT CK_PRODUTO_ESTOQUE CHECK (QUANTIDADE_ESTOQUE >= 0)
);



-- =========================
-- TABELA: PEDIDO
-- =========================
CREATE TABLE PEDIDO (
                        ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        CLIENTE_ID NUMBER NOT NULL,
                        DATA_PEDIDO TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

                        CONSTRAINT FK_PEDIDO_CLIENTE
                            FOREIGN KEY (CLIENTE_ID)
                                REFERENCES CLIENTE (ID)
                                ON DELETE RESTRICT
);




-- =========================
-- TABELA: PEDIDO_ITEM
-- =========================
CREATE TABLE PEDIDO_ITEM (
                             ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                             PEDIDO_ID NUMBER NOT NULL,
                             PRODUTO_ID NUMBER NOT NULL,
                             VALOR NUMBER(15,2) NOT NULL,
                             QUANTIDADE NUMBER(10) NOT NULL,
                             DESCONTO NUMBER(15,2) DEFAULT 0 NOT NULL,

                             CONSTRAINT CK_ITEM_VALOR CHECK (VALOR >= 0),
                             CONSTRAINT CK_ITEM_QTD CHECK (QUANTIDADE > 0),
                             CONSTRAINT CK_ITEM_DESCONTO CHECK (DESCONTO >= 0),

                             CONSTRAINT FK_ITEM_PEDIDO
                                 FOREIGN KEY (PEDIDO_ID)
                                     REFERENCES PEDIDO (ID)
                                     ON DELETE CASCADE,

                             CONSTRAINT FK_ITEM_PRODUTO
                                 FOREIGN KEY (PRODUTO_ID)
                                     REFERENCES PRODUTO (ID)
                                     ON DELETE RESTRICT
);

