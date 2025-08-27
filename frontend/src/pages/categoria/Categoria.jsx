import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Input, Popconfirm, Row, Table } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFeedback } from '../../providers/FeedbackProvider';
import Label from '../../components/Label';
import Cadastro from './Cadastro';

export default function Categoria() {
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState({});
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const feedback = useFeedback();
  const columns = [
    {
      title: 'Nome',
      key: 'nome',
      dataIndex: 'nome',
      render: (value, row) => (
        <span style={{ color: row.cor }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Tipo',
      key: 'tipo',
      dataIndex: 'tipo',
      width: 150,
      render: (value) => {
        if (value === 'D') {
          return 'Débito';
        }

        if (value === 'R') {
          return 'Receita';
        }

        if (value === 'A') {
          return 'Ambos';
        }
      },
    },
    {
      title: <SettingOutlined />,
      key: 'id',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      render: (value) => (
        <Row justify='space-evenly'>
          <Col>
            <Cadastro categoriaId={value}
              onClose={() => fetchData(pagination.current)}>
              <EditOutlined style={{ fontSize: 18 }} />
            </Cadastro>
          </Col>
          <Col>
            <Popconfirm title='Deseja remover?'
              onConfirm={() => handleDelete(value)}>
              <DeleteOutlined style={{ fontSize: 18, color: 'red' }} />
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filtro]);

  const fetchData = (novaPagina = 1) => {
    setLoading(true);

    const params = {
      nome: filtro.nome,
      pagina: novaPagina,
    }

    axios.get('/v1/categorias', {
      params,
    }).then((response) => {
      setData(response.data.data);
      setPagination((prev) => ({ ...prev, current: novaPagina, total: response.data.total }));
    }).catch((err) => {
      feedback.modal.error({
        title: 'Erro ao buscar categorias!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleDelete = (categoriaId) => {
    setLoading(true);

    axios.delete(`/v1/categorias/${categoriaId}`).then(() => {
      feedback.message.success('Categoria removida com sucesso!');
      fetchData();
    }).catch((err) => {
      feedback.modal.error({
        title: 'Erro ao remover categoria!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const changeFiltro = (value, key) => {
    setFiltro((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <React.Fragment>
      <Card>
        <Row gutter={[10, 10]}
          justify='space-between'
          align='bottom'>
          <Col xxl={4}
            xl={5}
            lg={6}
            md={8}
            sm={14}
            xs={24}>
            <Label text='Nome da Categoria' />
            <Input value={filtro.nome}
              maxLength={100}
              onChange={(e) => changeFiltro(e.target.value, 'nome')} />
          </Col>
          <Col xxl={2}
            xl={3}
            lg={4}
            md={6}
            sm={10}
            xs={24}>
            <Cadastro onClose={() => fetchData()}>
              <Button block
                type='primary'>
                Cadastrar
              </Button>
            </Cadastro>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: 20 }}>
        <Table size='small'
          columns={columns}
          bordered
          rowKey='id'
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={(pag) => fetchData(pag.current)} />
      </Card>
    </React.Fragment>
  );
}