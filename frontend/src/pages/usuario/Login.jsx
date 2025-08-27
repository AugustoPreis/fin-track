import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Col, Divider, Form, Input, notification, Row, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const email = searchParams.get('email');
    const senha = searchParams.get('senha');

    if (email && senha) {
      form.setFieldsValue({ email, senha });

      setSearchParams({});
    }
  }, []);

  const handleSubmit = (values) => {
    const { email, senha } = values;

    setLoading(true);

    axios.post('/v1/usuarios/login', {
      email,
      senha,
    }).then((response) => {
      auth.login(response.data);

      if (response.data.reativado) {
        notification.success({
          message: 'Usuário reativado!',
          description: `Bem-vindo(a) de volta, ${response.data.nome}.\nSeu usuário foi reativado`,
          style: { whiteSpace: 'pre-wrap' },
        });

        auth.login(response.data);
      } else {
        notification.success({
          message: 'Login realizado com sucesso!',
          description: `Bem-vindo(a), ${response.data.nome}`,
        });
      }

      navigate('/transacoes');
    }).catch((error) => {
      notification.error({
        message: 'Erro ao realizar login!',
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
            Login
          </Typography.Title>
          <Divider />
          <Form form={form}
            layout='vertical'
            onFinish={handleSubmit}>
            <Form.Item name='email'
              label='E-mail'
              rules={[{ required: true, message: 'Campo obrigatório' }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name='senha'
              label='Senha'
              extra={<a>Esqueci minha senha</a>}
              rules={[{ required: true, message: 'Campo obrigatório' }]}>
              <Input.Password prefix={<LockOutlined />}
                onPressEnter={form.submit} />
            </Form.Item>
            <Button block
              type='primary'
              loading={loading}
              onClick={form.submit}>
              Entrar
            </Button>
            <Divider />
            Não possui uma conta? <a onClick={() => navigate('/cadastro')}>Cadastre-se</a>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}