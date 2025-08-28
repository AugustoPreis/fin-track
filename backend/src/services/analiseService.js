const { GoogleGenAI } = require('@google/genai');
const { format, startOfDay, endOfDay } = require('date-fns');
const { ForbiddenError, NotFoundError, BadRequestError } = require('node-backend-utils/classes');
const { isValidDate } = require('node-backend-utils/validators');
const { formataReal } = require('../utils/real');
const Planos = require('../enums/planos');
const transacaoRepository = require('../repositories/transacaoRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const analiseRepository = require('../repositories/analiseRepository');

const ai = new GoogleGenAI({});

async function gerar(dados, usuarioLogado) {
  const usuarioDB = await usuarioRepository.buscarPorId({ id: usuarioLogado.id });

  if (!usuarioDB) {
    throw new NotFoundError('Usuário não encontrado');
  }

  if (usuarioDB.plano != Planos.PREMIUM) {
    throw new ForbiddenError('Apenas usuários premium podem gerar análises.');
  }

  const filtro = {
    usuarioId: usuarioLogado.id,
    dataInicial: startOfDay(new Date(dados.dataInicial)),
    dataFinal: endOfDay(new Date(dados.dataFinal)),
  };

  if (!isValidDate(filtro.dataInicial) || !isValidDate(filtro.dataFinal)) {
    throw new BadRequestError('O período informado é inválido');
  }

  const transacoes = await transacaoRepository.listarParaAnalise(filtro);

  if (!transacoes.length) {
    throw new NotFoundError('Nenhuma transação encontrada no período');
  }

  const { text: resultado } = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: criaPromptIA(dados, usuarioDB, transacoes),
  });

  const id = await analiseRepository.cadastrar({
    usuarioId: usuarioLogado.id,
    dataInicio: filtro.dataInicial,
    dataFinal: filtro.dataFinal,
    resultado,
    ativo: true,
    dataCadastro: new Date(),
  });

  return { id, resultado, transacoes };
}

function criaPromptIA(dados, usuarioLogado, transacoes) {
  const dataInicialFormatada = format(new Date(dados.dataInicial), 'dd/MM/yyyy');
  const dataFinalFormatada = format(new Date(dados.dataFinal), 'dd/MM/yyyy');
  const transacoesFormatadas = JSON.stringify(transacoes.map((transacao) => {
    transacao.tipo = transacao.tipo === 'R' ? 'Receita' : 'Despesa';
    transacao.data = format(new Date(transacao.data), 'dd/MM/yyyy HH:mm');
    transacao.valor = formataReal(transacao.valor);

    return transacao;
  }));

  return `
    Você é um assistente financeiro, dentro de um sistema de controle financeiro, especializado em ajudar pessoas a economizar.
    O usuário ${usuarioLogado.nome} tem o seguinte histórico financeiro (gastos e recebimentos).

    Período analisado: ${dataInicialFormatada} a ${dataFinalFormatada}

    Transações:
    ${transacoesFormatadas}

    Objetivo: Gerar um plano detalhado de economia adaptado ao padrão de gastos e recebimentos deste usuário.
    Leve em consideração:
    - Quais categorias têm maiores gastos.
    - Onde é possível reduzir despesas sem afetar necessidades essenciais.
    - Sugestões práticas e realistas, de fácil aplicação no dia a dia.
    - Estratégias para aumentar a receita, se possível.
    - Um resumo final motivador.

    Formato da resposta:
    1. **Resumo da situação atual** (pontos-chave dos gastos e recebimentos)
    2. **Áreas para redução de gastos** (lista com porcentagens ou valores estimados de economia)
    3. **Sugestões de hábitos e estratégias**
    4. **Plano mensal de economia**
    5. **Resumo motivacional final**

    Sua resposta deve ser direcionada para o usuário, como se estivesse falando com ele.
  `;
}

module.exports = { gerar }