import { Col, Row } from 'antd';

export default function Page({ children }) {

  return (
    <Row style={{ padding: 20 }}>
      <Col span={24}>
        {children}
      </Col>
    </Row>
  );
}