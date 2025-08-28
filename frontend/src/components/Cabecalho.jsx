import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Card, Col, Menu, Row, Typography, Space, Dropdown, Tag } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Alteracao from '../pages/usuario/Alteracao';
import { useAuth } from '../providers/AuthProvider';
import { useFeedback } from '../providers/FeedbackProvider';

export default function AppHeader() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const feedback = useFeedback();
  const menuItems = [
    { key: '/transacoes', label: 'Transações' },
    { key: '/categorias', label: 'Categorias' },
  ];

  if (auth.user?.plano === 'PREMIUM') {
    menuItems.push({ key: '/analises', label: 'Análises' });
  }

  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeItem = menuItems.find(item => item.key === currentPath);

    setSelectedKeys([activeItem?.key || '/transacoes']);
  }, []);

  const handleLogout = (confirm) => {
    if (confirm) {
      return feedback.modal.confirm({
        title: 'Confirmar saída',
        content: 'Você tem certeza que deseja sair?',
        okText: 'Sim',
        onOk: () => handleLogout(false),
      });
    }

    //Remove o token do servidor
    axios.delete('/v1/usuarios/logout').catch((err) => {
      feedback.notification.error({
        message: 'Erro ao deslogar no servidor!',
        description: err.response?.data?.message,
      });
    }).finally(() => {
      auth.logout();
      navigate('/login');
    });
  }

  const onSelect = (key) => {
    setSelectedKeys([key]);
    navigate(key);
  }

  if (!auth.isAuthenticated()) {
    handleLogout();

    return null;
  }

  return (
    <Card style={{ marginBottom: 10 }}>
      <Row align='middle'
        gutter={[10, 10]}>
        <Col md={0}
          sm={2}
          xs={4}>
          <Dropdown trigger={['click']}
            open={menuOpen}
            menu={{ items: menuItems, onClick: (e) => navigate(e.key) }}
            onOpenChange={setMenuOpen}>
            <Button icon={<MenuOutlined />} />
          </Dropdown>
        </Col>
        <Col md={6}
          sm={16}
          xs={13}>
          <Alteracao usuarioId={auth.user.id}>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Typography.Text strong ellipsis>
                {auth.user.nome}
              </Typography.Text>
              {auth.user.plano === 'PREMIUM' ? (
                <Tag color='gold'
                  style={{ fontWeight: 600 }}>
                  PREMIUM
                </Tag>
              ) : null}
            </Space>
          </Alteracao>
        </Col>
        <Col md={12}
          xs={0}>
          <Menu mode='horizontal'
            items={menuItems}
            selectedKeys={selectedKeys}
            onClick={(e) => onSelect(e.key)}
            style={{ borderBottom: 'none', justifyContent: 'center' }} />
        </Col>
        <Col sm={6}
          xs={7}
          style={{ textAlign: 'right' }}>
          <Button danger
            icon={<LogoutOutlined />}
            onClick={() => handleLogout(true)}>
            Sair
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
