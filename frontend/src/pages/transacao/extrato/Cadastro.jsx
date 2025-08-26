import { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, message, Modal, Row, } from 'antd';
import TipoTransacaoDataSelect from '../../../components/dataSelect/TipoTransacao';
import CategoriaDataSelect from '../../../components/dataSelect/Categoria';
import { DatePicker } from '../../../components/DateFnsPicker';
import Currency from '../../../components/Currency';

export default function Cadastro({ children, onClose, transacaoId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const tipoWatch = Form.useWatch('tipo', form);

  useEffect(() => {
    form.resetFields(['categoria']);
  }, [tipoWatch]);

  const modal = () => {
    setOpen(true);

    if (transacaoId) {
      fetchData();
    }
  }

  const fetchData = () => {
    setLoading(true);

    axios.get(`/v1/transacoes/${transacaoId}`).then((response) => {
      form.setFieldsValue({
        nome: response.data.nome,
        tipo: response.data.tipo,
        cor: response.data.cor,
      });
    }).catch((err) => {
      Modal.error({
        title: 'Erro ao buscar transação!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    const body = {
      tipo: values.tipo,
      valor: values.valor,
      dataTransacao: values.dataTransacao,
      categoriaId: values.categoria?.id,
      descricao: values.descricao,
    };

    if (transacaoId) {
      axios.put(`/v1/transacoes/${transacaoId}`, {
        ...body,
      }).then(() => {
        message.success('Transação editada com sucesso!');
        onClose?.();
        handleClear();
      }).catch((err) => {
        Modal.error({
          title: 'Erro ao editar transação',
          content: err.response?.data?.message,
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      axios.post('/v1/transacoes', {
        ...body,
      }).then(() => {
        message.success('Transação salva com sucesso!');
        onClose?.();
        handleClear();
      }).catch((err) => {
        Modal.error({
          title: 'Erro ao salvar transação',
          content: err.response?.data?.message,
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleClear = () => {
    form.resetFields();
    setOpen(false);
    setLoading(false);
  }

  return (
    <span>
      <div onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </div>
      <Modal destroyOnHidden
        open={open}
        width={600}
        okText={'Salvar ' + (transacaoId ? 'Alterações' : '')}
        title={(transacaoId ? 'Alteração' : 'Cadastro') + ' de transação'}
        loading={loading}
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{ tipo: 'R', dataTransacao: new Date() }}>
          <Row gutter={[10, 5]}>
            <Col sm={8}
              xs={12}>
              <Form.Item name='tipo'
                label='Tipo'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <TipoTransacaoDataSelect ambos={false} />
              </Form.Item>
            </Col>
            <Col sm={8}
              xs={12}>
              <Form.Item name='valor'
                label='Valor'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <Currency />
              </Form.Item>
            </Col>
            <Col sm={8}
              xs={24}>
              <Form.Item name='dataTransacao'
                label='Data Transação'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <DatePicker showTime
                  allowClear={false}
                  format='dd/MM/yyyy HH:mm'
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='categoria'
                label='Categoria'>
                <CategoriaDataSelect disabled={!tipoWatch}
                  params={{ tipo: tipoWatch }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='descricao'
                label='Descrição'>
                <Input maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </span>
  );
}