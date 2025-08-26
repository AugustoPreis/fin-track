const { isValidNumber, isValidDate, isValidString } = require('node-backend-utils/validators');
const { BadRequestError, NotFoundError } = require('node-backend-utils/classes');
const TipoCategoria = require('../enums/tipoCategoria');
const transacaoRepository = require('../repositories/transacaoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

async function listar(dados, usuarioLogado) {
  const { categoriaId, ordem, tipo, valorMinimo, valorMaximo, dataInicial, dataFinal, descricao, pular } = dados;
  const filtro = {
    pular: 0,
    descricao: '',
    ordem: 'DESC',
    tipo: TipoCategoria.AMBOS,
    usuarioId: usuarioLogado.id,
  };

  if (isValidNumber(parseInt(categoriaId), { integer: true, min: 1 })) {
    filtro.categoriaId = parseInt(categoriaId);
  }

  if (['ASC', 'DESC'].includes(ordem)) {
    filtro.ordem = ordem;
  }

  if (Object.values(TipoCategoria).includes(tipo)) {
    filtro.tipo = tipo;
  }

  if (isValidNumber(parseFloat(valorMinimo), { min: 0 })) {
    filtro.valorMinimo = parseFloat(valorMinimo);
  }

  if (isValidNumber(parseFloat(valorMaximo), { min: 0 })) {
    filtro.valorMaximo = parseFloat(valorMaximo);
  }

  if (dataInicial) {
    filtro.dataInicial = new Date(dataInicial);
  }

  if (dataFinal) {
    filtro.dataFinal = new Date(dataFinal);
  }

  if (isValidString(descricao)) {
    filtro.descricao = descricao.trim();
  }

  if (isValidNumber(parseInt(pular), { integer: true, min: 1 })) {
    filtro.pular = parseInt(pular);
  }

  return await transacaoRepository.listar(filtro);
}

async function buscarPorId(transacaoId, usuarioLogado) {
  if (!isValidNumber(transacaoId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID da transação inválido');
  }

  const transacaoDB = await transacaoRepository.buscarPorId({ id: transacaoId, usuarioId: usuarioLogado.id });

  if (!transacaoDB) {
    throw new NotFoundError('Transação não encontrada');
  }

  return transacaoDB;
}

async function cadastrar(dados, usuarioLogado) {
  const { categoriaId, tipo, valor, dataTransacao, descricao } = dados;

  if (!Object.values(TipoCategoria).includes(tipo) || tipo === TipoCategoria.AMBOS) {
    throw new BadRequestError('Tipo inválido/não informado');
  }

  if (!isValidNumber(valor, { min: 0.01 })) {
    throw new BadRequestError('Valor inválido/não informado');
  }

  if (!dataTransacao || !isValidDate(new Date(dataTransacao))) {
    throw new BadRequestError('Data da transação inválida/não informada');
  }

  if (categoriaId) {
    const categoriaDB = await categoriaRepository.buscarPorId({ id: categoriaId, usuarioId: usuarioLogado.id });

    //Caso tenha informado uma categoria de outro usuário, não vai encontrar
    if (!categoriaDB) {
      throw new NotFoundError('Categoria não encontrada');
    }

    if (categoriaDB.tipo != TipoCategoria.AMBOS && categoriaDB.tipo != tipo) {
      throw new BadRequestError('Tipo de categoria não corresponde ao tipo da transação');
    }
  }

  const transacao = {};

  transacao.tipo = tipo;
  transacao.valor = valor;
  transacao.categoriaId = categoriaId;
  transacao.dataTransacao = new Date(dataTransacao);
  transacao.descricao = isValidString(descricao) ? descricao.trim() : null;
  transacao.usuarioId = usuarioLogado.id;
  transacao.ativo = true;
  transacao.dataCadastro = new Date();

  transacao.id = await transacaoRepository.cadastrar(transacao);

  return transacao;
}

async function atualizar(transacaoId, dados, usuarioLogado) {
  const { categoriaId, tipo, valor, dataTransacao, descricao } = dados;

  if (!isValidNumber(transacaoId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID da transação inválido');
  }

  if (!Object.values(TipoCategoria).includes(tipo) || tipo === TipoCategoria.AMBOS) {
    throw new BadRequestError('Tipo inválido/não informado');
  }

  if (!isValidNumber(valor, { min: 0.01 })) {
    throw new BadRequestError('Valor inválido/não informado');
  }

  if (!dataTransacao || !isValidDate(new Date(dataTransacao))) {
    throw new BadRequestError('Data da transação inválida/não informada');
  }

  if (categoriaId) {
    const categoriaDB = await categoriaRepository.buscarPorId({ id: categoriaId, usuarioId: usuarioLogado.id });

    //Caso tenha informado uma categoria de outro usuário, não vai encontrar
    if (!categoriaDB) {
      throw new NotFoundError('Categoria não encontrada');
    }

    if (categoriaDB.tipo != TipoCategoria.AMBOS && categoriaDB.tipo != tipo) {
      throw new BadRequestError('Tipo de categoria não corresponde ao tipo da transação');
    }
  }

  const transacaoDB = await transacaoRepository.buscarPorId({ id: transacaoId, usuarioId: usuarioLogado.id });

  if (!transacaoDB) {
    throw new NotFoundError('Transação não encontrada');
  }

  transacaoDB.tipo = tipo;
  transacaoDB.valor = valor;
  transacaoDB.categoriaId = categoriaId;
  transacaoDB.dataTransacao = new Date(dataTransacao);
  transacaoDB.descricao = isValidString(descricao) ? descricao.trim() : null;
  transacaoDB.usuarioId = usuarioLogado.id;

  await transacaoRepository.atualizar(transacaoDB);

  return transacaoDB;
}

async function inativar(transacaoId, usuarioLogado) {
  if (!isValidNumber(transacaoId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID da transação inválido');
  }

  const transacaoDB = await transacaoRepository.buscarPorId({ id: transacaoId, usuarioId: usuarioLogado.id });

  if (!transacaoDB) {
    throw new NotFoundError('Transação não encontrada');
  }

  transacaoDB.ativo = false;
  transacaoDB.usuarioId = usuarioLogado.id;

  await transacaoRepository.alterarSituacao(transacaoDB);
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  atualizar,
  inativar,
}