const { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } = require('node-backend-utils/classes');
const { isValidNumber, isValidString } = require('node-backend-utils/validators');
const { signJWT } = require('node-backend-utils/auth');
const { Encrypt, EMAIL } = require('node-backend-utils/utils');
const { getEnv } = require('../config/dotenv');
const usuarioRepository = require('../repositories/usuarioRepository');

const env = getEnv();

async function buscarPorId(usuarioId, usuarioLogado) {
  if (!isValidNumber(usuarioId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID do usuário não informado');
  }

  if (usuarioId != usuarioLogado.id) {
    throw new ForbiddenError('Você não tem permissão para acessar este usuário');
  }

  const usuarioDB = await usuarioRepository.buscarPorId({ id: usuarioId });

  if (!usuarioDB) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return usuarioDB;
}

async function login(dados) {
  const { email, senha } = dados;

  if (!isValidString(email, { pattern: EMAIL })) {
    throw new BadRequestError('Email não informado/inválido');
  }

  if (!isValidString(senha)) {
    throw new BadRequestError('Senha não informada/inválida');
  }

  const usuarioDB = await usuarioRepository.buscarPorEmail({ email: email.toLowerCase(), inativos: true });

  if (!usuarioDB || !Encrypt.compare(senha, usuarioDB.senha)) {
    throw new UnauthorizedError('Login inválido');
  }

  //Caso esteja inativo, ele reativa e adiciona a propriedade "reativado"
  //Para que o frontend possa mostrar um feedback de reativação
  if (usuarioDB.ativo === false) {
    usuarioDB.ativo = true;
    usuarioDB.reativado = true;

    await usuarioRepository.alterarSituacao(usuarioDB);
  }

  delete usuarioDB.senha;

  usuarioDB.token = signJWT(usuarioDB, env.jwtSecret, {
    expiresIn: '1d',
  });

  return usuarioDB;
}

async function cadastrar(dados) {
  const { nome, email, senha } = dados;

  if (!isValidString(nome, { maxLength: 100 })) {
    throw new BadRequestError('Nome não informado/inválido');
  }

  if (!isValidString(email, { maxLength: 150, pattern: EMAIL })) {
    throw new BadRequestError('Email não informado/inválido');
  }

  if (!isValidString(senha, { minLength: 6, maxLength: 20 })) {
    throw new BadRequestError('Senha não informada/inválida. Deve conter entre 6 e 20 caracteres');
  }

  const usuarioComEmail = await usuarioRepository.buscarPorEmail({ email: email.toLowerCase(), inativos: true });

  if (usuarioComEmail) {
    throw new BadRequestError('Já existe um usuário cadastrado com este email');
  }

  const usuario = {};

  usuario.nome = nome.trim();
  usuario.email = email.trim().toLowerCase();
  usuario.senha = Encrypt.hash(senha);
  usuario.plano = 'PADRAO';
  usuario.ativo = true;
  usuario.dataCadastro = new Date();

  usuario.id = await usuarioRepository.cadastrar(usuario);

  delete usuario.senha;

  return usuario;
}

async function atualizar(usuarioId, dados, usuarioLogado) {
  if (!isValidNumber(usuarioId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID do usuário não informado');
  }

  if (usuarioId != usuarioLogado.id) {
    throw new ForbiddenError('Você não tem permissão para acessar este usuário');
  }

  const usuarioDB = await usuarioRepository.buscarPorId({ id: usuarioId });

  if (!usuarioDB) {
    throw new NotFoundError('Usuário não encontrado');
  }

  const { nome, email, senha } = dados;

  if (!isValidString(nome, { maxLength: 100 })) {
    throw new BadRequestError('Nome não informado/inválido');
  }

  if (!isValidString(email, { maxLength: 150, pattern: EMAIL })) {
    throw new BadRequestError('Email não informado/inválido');
  }

  let atualizaSenha = isValidString(senha, { minLength: 6, maxLength: 20 });

  usuarioDB.nome = nome.trim();
  usuarioDB.email = email.trim().toLowerCase();
  usuarioDB.senha = atualizaSenha ? Encrypt.hash(senha) : null;

  await usuarioRepository.atualizar(usuarioDB);

  delete usuarioDB.senha;

  return usuarioDB;
}

async function inativar(usuarioId, usuarioLogado) {
  if (!isValidNumber(usuarioId, { integer: true, min: 1 })) {
    throw new BadRequestError('ID do usuário não informado');
  }

  if (usuarioId != usuarioLogado.id) {
    throw new ForbiddenError('Você não tem permissão para acessar este usuário');
  }

  const usuarioDB = await usuarioRepository.buscarPorId({ id: usuarioId });

  if (!usuarioDB) {
    throw new NotFoundError('Usuário não encontrado');
  }

  usuarioDB.ativo = false;

  await usuarioRepository.alterarSituacao(usuarioDB);
}

module.exports = {
  buscarPorId,
  login,
  cadastrar,
  atualizar,
  inativar,
}