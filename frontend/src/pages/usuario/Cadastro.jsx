import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Col, Divider, Form, Input, Row, Typography } from 'antd';
import { useFeedback } from '../../providers/FeedbackProvider';
import { useAuth } from '../../providers/AuthProvider';

export default function Cadastro() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const feedback = useFeedback();
  const auth = useAuth();

  const handleSubmit = (values) => {
    const { nome, email, senha } = values;

    setLoading(true);

    axios.post('/v1/usuarios', {
      nome,
      email,
      senha,
    }).then(() => {
      feedback.notification.success({
        message: 'Cadastro realizado com sucesso!',
        description: 'Realize o login para continuar',
      });
      navigate(`/login?email=${email}&senha=${senha}`);
    }).catch((error) => {
      feedback.notification.error({
        message: 'Erro ao realizar cadastro!',
        description: error.response?.data?.message,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  if (auth.isAuthenticated()) {
    return (
      <Navigate to='/transacoes' />
    );
  }

  return (
    <Row justify='center'
      align='middle'
      style={{ height: '100vh' }}>
      <Col xxl={6}
        lg={8}
        md={14}
        xs={22}>
        <Card>
          <Typography.Title level={2}
            style={{ textAlign: 'center', margin: 0, padding: '24px 0' }}>
            Cadastro
          </Typography.Title>
          <Divider />
          <Form form={form}
            layout='vertical'
            onFinish={handleSubmit}>
            <Form.Item name='nome'
              label='Nome'
              rules={[{ required: true, message: 'Campo obrigatório' }]}>
              <Input />
            </Form.Item>
            <Form.Item name='email'
              label='E-mail'
              rules={[{ required: true, message: 'Campo obrigatório' }]}>
              <Input />
            </Form.Item>
            <Form.Item name='senha'
              label='Senha'
              extra={<a>Esqueci minha senha</a>}
              rules={[{ required: true, message: 'Campo obrigatório' }]}>
              <Input.Password onPressEnter={form.submit} />
            </Form.Item>
            <Button block
              type='primary'
              loading={loading}
              onClick={form.submit}>
              Entrar
            </Button>
            <Divider />
            Já possui uma conta? <a onClick={() => navigate('/login')}>Login</a>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}