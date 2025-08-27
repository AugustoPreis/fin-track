import { Avatar, Button, Card, Col, Menu, Modal, Row, Typography, Space, Dropdown, Tag } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';

export default function AppHeader() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (confirm) => {
    if (confirm) {
      return Modal.confirm({
        title: 'Confirmar saída',
        content: 'Você tem certeza que deseja sair?',
        okText: 'Sim',
        onOk: () => handleLogout(false),
      });
    }

    auth.logout();
    navigate('/login');
  };

  if (!auth.isAuthenticated()) {
    handleLogout();

    return null;
  }

  const menuItems = [
    { key: '/transacoes', label: 'Transações' },
    { key: '/categorias', label: 'Categorias' },
  ];

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
        </Col>
        <Col md={12}
          xs={0}>
          <Menu mode='horizontal'
            defaultSelectedKeys={['/transacoes']}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
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
