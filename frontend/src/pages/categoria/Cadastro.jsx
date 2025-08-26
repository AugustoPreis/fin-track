import { useState } from 'react';
import axios from 'axios';
import { Col, ColorPicker, Form, Input, message, Modal, Row } from 'antd';
import TipoTransacaoDataSelect from '../../components/dataSelect/TipoTransacao';

export default function Cadastro({ children, onClose, categoriaId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const modal = (e) => {
    setOpen(true);

    if (categoriaId) {
      fetchData();
    }
  }

  const fetchData = () => {
    setLoading(true);

    axios.get(`/v1/categorias/${categoriaId}`).then((response) => {
      form.setFieldsValue({
        nome: response.data.nome,
        tipo: response.data.tipo,
        cor: response.data.cor,
      });
    }).catch((err) => {
      Modal.error({
        title: 'Erro ao buscar categoria!',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    const body = {
      nome: values.nome,
      tipo: values.tipo,
      cor: values.cor?.toUpperCase?.(),
    };

    if (categoriaId) {
      axios.put(`/v1/categorias/${categoriaId}`, {
        ...body,
      }).then(() => {
        message.success('Categoria editada com sucesso!');
        onClose?.();
        handleClear();
      }).catch((err) => {
        Modal.error({
          title: 'Erro ao editar categoria',
          content: err.response?.data?.message,
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      axios.post('/v1/categorias', {
        ...body,
      }).then(() => {
        message.success('Categoria salva com sucesso!');
        onClose?.();
        handleClear();
      }).catch((err) => {
        Modal.error({
          title: 'Erro ao salvar categoria',
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
        width={800}
        okText={'Salvar ' + (categoriaId ? 'Alterações' : '')}
        title={(categoriaId ? 'Alteração' : 'Cadastro') + ' de categoria'}
        loading={loading}
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{ tipo: 'A', cor: '#000000' }}>
          <Row gutter={[10, 5]}>
            <Col sm={16}
              xs={24}>
              <Form.Item name='nome'
                label='Nome'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <Input maxLength={100} />
              </Form.Item>
            </Col>
            <Col sm={8}
              xs={24}>
              <Form.Item name='tipo'
                label='Tipo'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <TipoTransacaoDataSelect allowClear={false} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name='cor'
                label='Cor'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <ColorPicker showText
                  format='hex'
                  //Não achei outra maneira de resolver isso
                  onChange={(value) => form.setFieldValue('cor', value?.toHexString?.())} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </span>
  );
}