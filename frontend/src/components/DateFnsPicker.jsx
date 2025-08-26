import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/es/date-picker/generatePicker';
import ptBR from 'antd/es/date-picker/locale/pt_BR';
import 'antd/es/date-picker/style/index';

const DateFnsPicker = generatePicker(dateFnsGenerateConfig);

export function DatePicker(props) {

  return (
    <DateFnsPicker {...props}
      locale={ptBR} />
  );
}

export default DateFnsPicker;