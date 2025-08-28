import { lazy, Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Typography, Steps, Card, Divider, Row, Col, Grid, Button } from 'antd';
import { useFeedback } from '../../providers/FeedbackProvider';
import { AnaliseContext } from './Context';

const SituacaoAtual = lazy(() => import('./SituacaoAtual'));
const AcaoSistema = lazy(() => import('./AcaoSistema'));

export default function Analise() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState({ dataInicial: startOfMonth(new Date()), dataFinal: endOfMonth(new Date()) });
  const [analise, setAnalise] = useState({});
  const breakpoint = Grid.useBreakpoint();
  const feedback = useFeedback();
  const steps = [
    {
      title: 'Situação Atual',
      description: 'Análise das transações.',
    },
    {
      title: 'Ação do Sistema',
      description: 'Geração do plano de economia.',
    },
  ];
  const pages = [
    <SituacaoAtual key='situacaoAtual' />,
    <AcaoSistema key='acaoSistema' />,
  ];

  useEffect(() => {
    setAnalise({}); //Limpa a análise ao alterar os filtros
  }, [filtro]);

  useEffect(() => {
    if (current === 1 && !analise.resultado) {
      handleAnalise();
    }
  }, [current]);

  const handleAnalise = () => {
    setLoading(true);

    const body = {
      dataInicial: filtro.dataInicial,
      dataFinal: filtro.dataFinal,
    };

    axios.post('/v1/analises', {
      ...body,
    }).then((response) => {
      setAnalise(response.data);
    }).catch((err) => {
      setCurrent(0);
      feedback.modal.error({
        title: 'Erro ao gerar análise!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const next = () => {
    if (current === 0) {
      const { dataInicial, dataFinal } = filtro;

      if (!dataInicial || !dataFinal) {
        return feedback.notification.warning({
          message: 'Período inválido',
          description: 'Por favor, selecione um período válido.',
        });
      }
    }

    setCurrent(current + 1);
  }

  return (
    <Card>
      <Typography.Title level={3}>
        Plano de Economia
      </Typography.Title>
      <Typography.Paragraph>
        A partir desta página você poderá gerar um plano de economia baseado nas suas transações financeiras.
        O sistema utilizará inteligência artificial para identificar oportunidades de economia.
      </Typography.Paragraph>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xxl={6}
          xl={7}
          lg={8}
          xs={24}>
          <Card>
            <Steps current={current}
              direction={breakpoint.lg || !breakpoint.md ? 'vertical' : 'horizontal'}
              items={steps}
              style={{ marginBottom: 24 }} />
          </Card>
        </Col>
        <Col xxl={18}
          xl={17}
          lg={16}
          xs={24}>
          <Card>
            <Suspense>
              <AnaliseContext.Provider value={{
                loading,
                analise,
                filtro,
                setFiltro,
                current,
                handleAnalise,
              }}>
                {pages[current] || null}
              </AnaliseContext.Provider>
            </Suspense>
            <Divider />
            <Row gutter={[10, 10]}
              justify='end'>
              <Col>
                <Button disabled={current <= 0}
                  onClick={() => setCurrent(current - 1)}>
                  Voltar
                </Button>
              </Col>
              <Col>
                <Button type='primary'
                  onClick={next}
                  disabled={current >= (pages.length - 1)}>
                  Avançar
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
