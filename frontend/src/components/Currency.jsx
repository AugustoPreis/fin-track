import { InputNumber } from 'antd';

export default function Currency(props) {

  return (
    <InputNumber {...props}
      precision={2}
      prefix='R$'
      controls={false}
      decimalSeparator=','
      style={{ width: '100%' }} />
  );
}