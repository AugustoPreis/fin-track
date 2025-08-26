import { format } from 'date-fns';
import axios from 'axios';
import { Col, Modal, notification, Row, Table } from 'antd';
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import { formataReal } from '../../../utils/real';
import { useExtratoContext } from './Context';

export default function Listagem() {
  const { data, loading, fetchData, removeItem } = useExtratoContext();
  const columns = [
    {
      title: 'Valor',
      key: 'valor',
      dataIndex: 'valor',
      width: 150,
      render: (_, row) => (
        <span style={{ color: row.tipo === 'D' ? 'red' : 'green' }}>
          {formataReal(row.valor)}
        </span>
      ),
    },
    {
      title: 'Data',
      key: 'dataTransacao',
      dataIndex: 'dataTransacao',
      width: 140,
      render: (value) => format(new Date(value), 'dd/MM/yyyy HH:mm'),
    },
    {
      title: 'Categoria',
      key: 'categoriaNome',
      dataIndex: 'categoriaNome',
      width: 250,
    },
    {
      title: 'Descrição',
      key: 'descricao',
      dataIndex: 'descricao',
    },
    {
      title: <SettingOutlined />,
      key: 'id',
      dataIndex: 'id',
      align: 'center',
      width: 60,
      render: (_, row) => (
        <Row justify='space-evenly'>
          <Col>
            <DeleteOutlined style={{ fontSize: 18, color: 'red' }}
              onClick={() => handleConfirmDelete(row)} />
          </Col>
        </Row>
      ),
    },
  ];

  const handleConfirmDelete = (transacao) => {
    Modal.confirm({
      title: 'Atenção',
      content: `Deseja remover a transação "${transacao.descricao}"? Esta ação é irreversível`,
      okText: 'Confirmar',
      onOk: () => handleDelete(transacao.id),
    });
  }

  const handleDelete = (transacaoId) => {
    axios.delete(`/v1/transacoes/${transacaoId}`).then(() => {
      notification.success({
        message: 'Sucesso!',
        description: 'Transação removida com sucesso.',
      });
      removeItem(transacaoId);
    }).catch((err) => {
      Modal.error({
        title: 'Erro ao remover a transação!',
        content: err.response?.data?.message,
      });
    });
  }

  const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    const isBottom = scrollTop + clientHeight >= scrollHeight;

    if (isBottom) {
      fetchData('scroll');
    }
  }

  return (
    <Table size='small'
      bordered
      rowKey='id'
      loading={!!loading}
      columns={columns}
      pagination={false}
      dataSource={data}
      scroll={{ x: 850, y: 700 }}
      onScroll={data.length > 0 ? onScroll : undefined} />
  );
}