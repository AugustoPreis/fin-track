import { Col, Row, Typography } from 'antd';
import { DatePicker } from '../../components/DateFnsPicker';
import Label from '../../components/Label';
import { useAnaliseContext } from './Context';

export default function SituacaoAtual() {
  const { filtro, setFiltro } = useAnaliseContext();

  const changeFiltro = (value, key) => {
    setFiltro((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Row gutter={[10, 5]}>
      <Col span={24}>
        <Typography.Title level={4}
          style={{ marginTop: 0 }}>
          Informe o período para análise
        </Typography.Title>
      </Col>
      <Col span={24}
        style={{ marginBottom: 32 }}>
        <Typography.Paragraph>
          O sistema irá buscar por todas as transações dentro do período informado e analisar oportunidades de economia.
        </Typography.Paragraph>
      </Col>
      <Col xxl={4}
        xl={5}
        md={8}
        xs={12}>
        <Label text='Data Inicial' />
        <DatePicker allowClear={false}
          value={filtro.dataInicial}
          format='dd/MM/yyyy'
          style={{ width: '100%' }}
          placeholder='Início'
          onChange={(value) => changeFiltro(value, 'dataInicial')} />
      </Col>
      <Col xxl={4}
        xl={5}
        md={8}
        xs={12}>
        <Label text='Data Final' />
        <DatePicker allowClear={false}
          value={filtro.dataFinal}
          format='dd/MM/yyyy'
          style={{ width: '100%' }}
          placeholder='Fim'
          onChange={(value) => changeFiltro(value, 'dataFinal')} />
      </Col>
    </Row>
  );
}