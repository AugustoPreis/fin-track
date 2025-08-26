CREATE TABLE usuarios (
	id serial NOT NULL PRIMARY KEY,
	nome varchar(100) NOT NULL,
	plano varchar(10) NOT NULL,
	email varchar(150) NOT NULL UNIQUE,
	senha varchar(255) NOT NULL,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL
);

CREATE TABLE categorias (
	id serial NOT NULL PRIMARY KEY,
	nome varchar(100) NOT NULL,
	tipo char(1) NOT NULL,
	cor varchar(7),
	usuario_id int NOT NULL REFERENCES usuarios,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL
);

CREATE TABLE transacoes (
	id serial NOT NULL PRIMARY KEY,
	usuario_id int NOT NULL REFERENCES usuarios,
	categoria_id int REFERENCES categorias,
	tipo char(1) NOT NULL,
	valor numeric(10, 2) NOT NULL,
	data_transacao timestamp NOT NULL,
	descricao text,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL
);

CREATE TABLE analises (
	id serial NOT NULL PRIMARY KEY,
	usuario_id int NOT NULL REFERENCES usuarios,
	data_inicio date NOT NULL,
	data_final date NOT NULL,
	resultado text NOT NULL,
	ativo bool NOT NULL,
	data_cadastro timestamp NOT NULL
);

CREATE INDEX idx_transacoes_usuario ON transacoes(usuario_id);