import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { formataReal } from '../../../utils/real';
import CardGrid from '../../../components/CardGrid';
import { useExtratoContext } from './Context';

export default function Cards() {
  const { data } = useExtratoContext();
  const totais = useMemo(() => {
    const result = {
      receitas: 0,
      despesas: 0,
      categoriaMaisAparente: null,
      saldoFinal: 0,
    };

    if (!Array.isArray(data) || data.length === 0) {
      return result;
    }

    //Salva a chave com o (id + nome) de cada categoria, e soma +1 toda vez que ela aparecer
    const qtdPorCategoria = {};

    data.forEach((item) => {
      if (item.tipo === 'D') {
        result.despesas += item.valor;
        result.saldoFinal -= item.valor;
      } else {
        result.receitas += item.valor;
        result.saldoFinal += item.valor;
      }

      const key = `${item.categoriaId}-${item.categoriaNome}`;

      if (qtdPorCategoria[key]) {
        qtdPorCategoria[key] += 1;
      } else {
        qtdPorCategoria[key] = 1;
      }
    });

    //Ordena pelo maior número de transacoes
    const categoriasOrdenadas = Object.entries(qtdPorCategoria).sort((a, b) => b[1] - a[1]);
    const [categoriaMaisAparente, qtdAparicoes] = categoriasOrdenadas[0];

    //Remove o ID do nome
    result.categoriaMaisAparente = `${categoriaMaisAparente.substring(categoriaMaisAparente.indexOf('-') + 1)} (${qtdAparicoes} vezes)`;

    return result;
  }, [data]);

  return (
    <Row gutter={[10, 10]}>
      <Col lg={5}
        md={8}
        sm={12}
        xs={24}>
        <CardGrid color='#43A047'
          value={formataReal(totais.receitas)}
          title='Receitas' />
      </Col>
      <Col lg={5}
        md={8}
        sm={12}
        xs={24}>
        <CardGrid color='#E53935'
          value={formataReal(totais.despesas)}
          title='Despesas' />
      </Col>
      <Col lg={5}
        md={8}
        xs={24}>
        <CardGrid color='#FBC02D'
          value={formataReal(totais.saldoFinal)}
          title='Saldo Final' />
      </Col>
      <Col lg={9}
        xs={24}>
        <CardGrid color='#FBC02D'
          value={totais.categoriaMaisAparente || '-'}
          title='Categoria mais aparente' />
      </Col>
    </Row>
  )
}