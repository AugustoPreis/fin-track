const { isValidString, isValidNumber } = require('node-backend-utils/validators');
const { BadRequestError, NotFoundError } = require('node-backend-utils/classes');
const categoriaRepository = require('../repositories/categoriaRepository');
const TipoCategoria = require('../enums/tipoCategoria');

async function listar(dados, usuarioLogado) {
  const { nome, tipo, pagina } = dados;
  const filtro = {
    nome: '',
    tipo: TipoCategoria.AMBOS,
    usuarioId: usuarioLogado.id,
    pular: 0,
  }

  if (isValidString(nome)) {
    filtro.nome = nome.trim();
  }

  if (Object.values(TipoCategoria).includes(tipo)) {
    filtro.tipo = tipo;
  }

  if (isValidNumber(parseInt(pagina), { integer: true, min: 1 })) {
    filtro.pular = (pagina - 1) * 10; // 10 itens por página
  }

  return await categoriaRepository.listar(filtro);
}

async function buscarPorId(categoriaId, usuarioLogado) {
  if (!isValidNumber(categoriaId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID da categoria não informado');
  }

  const categoriaDB = await categoriaRepository.buscarPorId({ id: categoriaId, usuarioId: usuarioLogado.id });

  if (!categoriaDB) {
    throw new NotFoundError('Categoria não encontrada');
  }

  return categoriaDB;
}

async function cadastrar(dados, usuarioLogado) {
  const { nome, tipo, cor } = dados;

  if (!isValidString(nome, { maxLength: 100 })) {
    throw new BadRequestError('Nome não informado/inválido');
  }

  if (!Object.values(TipoCategoria).includes(tipo)) {
    throw new BadRequestError('Tipo inválido/não informado');
  }

  if (isValidString(cor) && !isValidString(cor, { minLength: 5, maxLength: 7, contains: '#' })) {
    throw new BadRequestError('A cor deve ser um hexadecimal válido');
  }

  const categoria = {};

  categoria.nome = nome.trim();
  categoria.tipo = tipo;
  categoria.usuarioId = usuarioLogado.id;
  categoria.ativo = true;
  categoria.dataCadastro = new Date();
  categoria.cor = cor; //Hexadecimal
  categoria.repetida = await categoriaRepetida(categoria);

  categoria.id = await categoriaRepository.cadastrar(categoria);

  return categoria;
}

async function atualizar(categoriaId, dados, usuarioLogado) {
  const { nome, tipo, cor } = dados;

  if (!isValidString(nome, { maxLength: 100 })) {
    throw new BadRequestError('Nome não informado/inválido');
  }

  if (!Object.values(TipoCategoria).includes(tipo)) {
    throw new BadRequestError('Tipo inválido/não informado');
  }

  const categoriaDB = await categoriaRepository.buscarPorId({ id: categoriaId, usuarioId: usuarioLogado.id });

  if (!categoriaDB) {
    throw new NotFoundError('Categoria não encontrada');
  }

  categoriaDB.nome = nome.trim();
  categoriaDB.tipo = tipo;
  categoriaDB.cor = cor;
  categoriaDB.usuarioId = usuarioLogado.id;
  categoriaDB.repetida = await categoriaRepetida(categoriaDB);

  await categoriaRepository.atualizar(categoriaDB);

  return categoriaDB;
}

async function inativar(categoriaId, usuarioLogado) {
  if (!isValidNumber(categoriaId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID da categoria não informado');
  }

  const categoriaDB = await categoriaRepository.buscarPorId({ id: categoriaId, usuarioId: usuarioLogado.id });

  if (!categoriaDB) {
    throw new NotFoundError('Categoria não encontrada');
  }

  categoriaDB.usuarioId = usuarioLogado.id;
  categoriaDB.ativo = false;

  await categoriaRepository.alterarSituacao(categoriaDB);
}

async function categoriaRepetida(categoria) {
  const { nome, tipo, cor, usuarioId } = categoria;

  const categoriasRepetidas = await categoriaRepository.listar({ nome, tipo, usuarioId, cor });

  return categoriasRepetidas.data.some((categoriaRepetidas) => {
    return categoriaRepetidas.id !== categoria.id;
  });
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  atualizar,
  inativar,
}