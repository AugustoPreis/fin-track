import { Col, Collapse, Input, Row } from 'antd';
import Label from '../../../components/Label';
import Currency from '../../../components/Currency';
import { useExtratoContext } from './Context';

export default function MaisFiltros() {
  const { filtro, changeFiltro, fetchData } = useExtratoContext();

  if (!filtro || !changeFiltro) {
    return null;
  }

  return (
    <Collapse items={[{
      key: 'mais-filtros',
      label: 'Mais Filtros',
      children: (
        <Row gutter={[10, 5]}>
          <Col xxl={5}
            xl={6}
            lg={8}
            md={10}
            xs={24}>
            <Label text='Descrição' />
            <Input value={filtro.descricao}
              maxLength={100}
              onPressEnter={() => fetchData('mais-filtros')}
              onChange={(e) => changeFiltro(e.target.value, 'descricao')} />
          </Col>
          <Col xxl={2}
            xl={3}
            lg={4}
            md={5}
            sm={12}
            xs={12}>
            <Label text='Valor Mínimo' />
            <Currency value={filtro.valorMinimo}
              onPressEnter={() => fetchData('mais-filtros')}
              onChange={(value) => changeFiltro(value, 'valorMinimo')} />
          </Col>
          <Col xxl={2}
            xl={3}
            lg={4}
            md={5}
            sm={12}
            xs={12}>
            <Label text='Valor Máximo' />
            <Currency value={filtro.valorMaximo}
              onPressEnter={() => fetchData('mais-filtros')}
              onChange={(value) => changeFiltro(value, 'valorMaximo')} />
          </Col>
        </Row>
      ),
    }]} />
  );
}