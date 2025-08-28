import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';
import { Button, Card, Col, Divider, FloatButton, Row, Tooltip } from 'antd';
import { BulbOutlined, SearchOutlined } from '@ant-design/icons';
import { DatePicker } from '../../../components/DateFnsPicker';
import Label from '../../../components/Label';
import { useAuth } from '../../../providers/AuthProvider';
import { useFeedback } from '../../../providers/FeedbackProvider';
import Listagem from './Listagem';
import { ExtratoContext } from './Context';
import MaisFiltros from './MaisFiltros';
import Cards from './Cards';
import Cadastro from './Cadastro';

export default function Extrato() {
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState({ dataInicial: startOfMonth(new Date()), dataFinal: endOfMonth(new Date()) });
  const [data, setData] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();
  const feedback = useFeedback();

  useEffect(() => {
    fetchData('abriu-pagina');
  }, []);

  const fetchData = (origem) => {
    setLoading(true);

    const params = {
      categoriaId: filtro.categoria?.id,
      tipo: filtro.tipo,
      valorMinimo: filtro.valorMinimo,
      valorMaximo: filtro.valorMaximo,
      dataInicial: filtro.dataInicial,
      dataFinal: filtro.dataFinal,
      descricao: filtro.descricao,
    };

    //Quando não for scroll, reseta a lista
    if (origem === 'scroll') {
      params.pular = data.length;
    }

    axios.get('/v1/transacoes', {
      params,
    }).then((response) => {
      if (origem === 'scroll') {
        setData((prev) => ([...prev, ...response.data]));
      } else {
        setData(response.data);
      }
    }).catch((err) => {
      feedback.modal.error({
        title: 'Erro ao buscar transações!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const removeItem = (transacaoId) => {
    const nData = data.filter((item) => item.id !== transacaoId);

    setData([...nData]);
  }

  const changeFiltro = (value, key) => {
    setFiltro((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <React.Fragment>
      <ExtratoContext.Provider value={{
        data,
        filtro,
        loading,
        fetchData,
        removeItem,
        changeFiltro,
      }}>
        <Card>
          <Tooltip placement='left'
            title='Gerar Análise com IA'>
            {auth.user?.plano === 'PREMIUM' ? (
              <FloatButton icon={<BulbOutlined />}
                onClick={() => navigate('/analises')} />
            ) : null}
          </Tooltip>
          <Row gutter={[10, 5]}
            align='bottom'>
            <Col xxl={3}
              xl={4}
              md={6}
              xs={12}>
              <Label text='Data Inicial' />
              <DatePicker showTime
                value={filtro.dataInicial}
                format='dd/MM/yyyy HH:mm'
                style={{ width: '100%' }}
                placeholder='Início'
                onChange={(value) => changeFiltro(value, 'dataInicial')} />
            </Col>
            <Col xxl={3}
              xl={4}
              md={6}
              xs={12}>
              <Label text='Data Final' />
              <DatePicker showTime
                value={filtro.dataFinal}
                format='dd/MM/yyyy HH:mm'
                style={{ width: '100%' }}
                placeholder='Fim'
                onChange={(value) => changeFiltro(value, 'dataFinal')} />
            </Col>
            <Col xxl={{ span: 2, offset: 14 }}
              xl={{ span: 3, offset: 10 }}
              lg={{ span: 4, offset: 4 }}
              md={{ span: 5, offset: 2 }}
              sm={12}
              xs={12}>
              <Button block
                icon={<SearchOutlined />}
                onClick={() => fetchData('pesquisar')}>
                Pesquisar
              </Button>
            </Col>
            <Col xxl={2}
              xl={3}
              lg={4}
              md={5}
              sm={12}
              xs={12}>
              <Cadastro onClose={() => fetchData('cadastro')}>
                <Button block
                  type='primary'>
                  Cadastrar
                </Button>
              </Cadastro>
            </Col>
            <Divider />
            <Col span={24}>
              <MaisFiltros />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <Row gutter={[10, 5]}>
            <Col span={24}>
              <Cards />
            </Col>
            <Divider />
            <Col span={24}>
              <Listagem />
            </Col>
          </Row>
        </Card>
      </ExtratoContext.Provider>
    </React.Fragment>
  );
}