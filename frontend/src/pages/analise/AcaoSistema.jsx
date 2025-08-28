import React from 'react';
import { Col, Input, Row, Spin, Typography } from 'antd';
import { useAnaliseContext } from './Context';
import { useFeedback } from '../../providers/FeedbackProvider';

export default function AcaoSistema() {
  const feedback = useFeedback();
  const { loading, analise } = useAnaliseContext();

  return (
    <Row gutter={[10, 5]}>
      <Col span={24}>
        <Typography.Title level={4}>
          Geração do plano de economia
        </Typography.Title>
      </Col>
      <Col span={24}
        style={{ marginBottom: 32 }}>
        <Typography.Paragraph>
          O sistema irá buscar por todas as transações dentro do período informado e analisar oportunidades de economia, utilizando inteligência artificial.
        </Typography.Paragraph>
      </Col>
      <Col span={24}>
        {loading ? (
          <Row justify='center'>
            <Col>
              <Spin spinning
                size='large' />
            </Col>
            <Col span={24}
              style={{ textAlign: 'center' }}>
              <Typography.Title level={4}
                style={{ marginTop: 16 }}>
                Gerando plano de economia...
              </Typography.Title>
            </Col>
          </Row>
        ) : (
          <React.Fragment>
            <Typography.Paragraph copyable={{
              text: analise?.resultado,
              onCopy: () => feedback.message.success('Resultado copiado para a área de transferência!'),
            }}>
              Resultado da Análise:&nbsp;
            </Typography.Paragraph>
            <Input.TextArea value={analise?.resultado}
              autoSize={{ minRows: 5, maxRows: 15 }} />
          </React.Fragment>
        )}
      </Col>
    </Row>
  );
}