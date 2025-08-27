import { Select } from 'antd';

export default function TipoTransacaoDataSelect({ ambos = true, ...props }) {
  const options = [
    { value: 'A', label: 'Ambos' },
    { value: 'R', label: 'Receita' },
    { value: 'D', label: 'Débito' },
  ];

  if (!ambos) {
    options.splice(0, 1);
  }

  return (
    <Select {...props}
      style={{ width: '100%' }}
      options={options} />
  );
}