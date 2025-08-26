import DataSelect from './DataSelect';

export default function CategoriaDataSelect(props) {

  return (
    <DataSelect {...props}
      searchKey='nome'
      url='/v1/categorias'
      view={(item) => item?.nome}
      onResult={(result) => result?.data} />
  );
}