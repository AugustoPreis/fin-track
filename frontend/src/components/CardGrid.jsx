import { Card, Col, Row } from 'antd';

export default function CardGrid({ title, style, children, value, color, ...props }) {

  return (
    <Card.Grid {...props}
      style={{
        ...style,
        width: '100%',
        padding: 0,
        border: '1px solid #a4b0be',
        textAlign: 'center',
      }}>
      <Row align='center'
        justify='center'>
        <Col span={24}
          style={{
            backgroundColor: color,
            color: '#fff',
            fontSize: 20,
            padding: 15,
            fontWeight: 600,
          }}>
          {title}
        </Col>
        <Col span={24}
          style={{ padding: 15, fontSize: 22, borderTop: '1px solid #a4b0be' }}>
          {value || children}
        </Col>
      </Row>
    </Card.Grid>
  )
}