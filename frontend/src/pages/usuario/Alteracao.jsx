import { useState } from 'react';
import axios from 'axios';
import { Col, Form, Input, Modal, Row, } from 'antd';
import { useFeedback } from '../../providers/FeedbackProvider';

export default function Cadastro({ children, onClose, usuarioId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const feedback = useFeedback();

  const modal = () => {
    setOpen(true);

    if (usuarioId) {
      fetchData();
    } else {
      handleClear();
    }
  }

  const fetchData = () => {
    setLoading(true);

    axios.get(`/v1/usuarios/${usuarioId}`).then((response) => {
      form.setFieldsValue({
        nome: response.data.nome,
        email: response.data.email,
      });
    }).catch((err) => {
      feedback.modal.error({
        title: 'Erro ao buscar usuário!',
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
      email: values.email,
      senha: values.senha,
    };

    axios.put(`/v1/usuarios/${usuarioId}`, {
      ...body,
    }).then(() => {
      feedback.notification.success({
        message: 'Usuário alterado com sucesso!',
        description: 'As informações do usuário foram atualizadas com sucesso. Pode ser necessário relogar no sistema para aplicar as alterações.',
      });

      onClose?.();
      handleClear();
    }).catch((err) => {
      feedback.modal.error({
        title: 'Erro ao editar usuário',
        content: err.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
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
        width={450}
        okText={'Salvar ' + (usuarioId ? 'Alterações' : '')}
        title={(usuarioId ? 'Alteração' : 'Cadastro') + ' de usuário'}
        loading={loading}
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Row gutter={[10, 5]}>
            <Col span={24}>
              <Form.Item name='nome'
                label='Nome'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <Input maxLength={100} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='email'
                label='Email'
                rules={[{ required: true, message: 'Campo obrigatório' }]}>
                <Input maxLength={150} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='senha'
                label='Senha'
                extra='Informe caso queira alterar'>
                <Input.Password maxLength={20} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </span>
  );
}