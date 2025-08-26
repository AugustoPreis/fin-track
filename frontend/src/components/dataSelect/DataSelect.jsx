import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { AutoComplete, Input } from 'antd';
import { DownOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';

/**
 * Componente que busca dados de uma API ou de uma função customizada.
 * É altamente configurável, suportando busca com debounce, exibição customizada e gerenciamento de estado controlado.
 */
export default function DataSelect({
  value: controlledValue, //O valor controlado do componente, vindo do componente pai. Nomeado como `controlledValue` para evitar conflito.
  onChange, //Callback chamado quando um item é selecionado ou o valor é limpo. Recebe o item completo ou `null`.
  view, //Função que renderiza a aparência de cada item na lista de opções. É obrigatória.
  selectedView, //Função que renderiza a aparência do item selecionado. Se omitida, usa a função `view`.
  url, //A URL da API para buscar os dados.
  params, //Parâmetros estáticos a serem enviados em toda requisição à `url`.
  onResult, //Função para transformar a resposta da API antes de ser usada.
  customSearch, //Função de busca personalizada que substitui a busca via `url`. Deve retornar uma Promise.
  allowFreeText, // Se `true`, permite que o usuário insira texto que não está na lista de opções.
  style, // Objeto de estilo CSS para o container do AutoComplete.
  defaults, // Um array de opções padrão que sempre aparecerá no topo da lista.
  placeholder, // Texto a ser exibido quando o campo está vazio.
  disabled, // Desabilita o componente.
  size, // Tamanho do campo de input.
  onError, // Callback chamado se ocorrer um erro durante a busca de dados.
  showArrow = true, // Se `true`, exibe uma seta para baixo ou um ícone de carregamento.
  allowClear = true, // Se `true`, exibe um ícone "X" para limpar o valor.
  debounceTime = 350, // Tempo em milissegundos para o debounce da busca.
  searchKey = 'descricao', // A chave do parâmetro de busca a ser enviado na URL.
  autoFocus, // Se `true`, o campo receberá foco automaticamente.
  ...restProps
}) {
  const [inputValue, setInputValue] = useState(''); // O texto atualmente visível no campo de input.
  const [data, setData] = useState([]); // A lista de resultados da busca.
  const [loading, setLoading] = useState(false); // Controla o estado de carregamento (ex: durante uma chamada de API).
  const [isBlured, setIsBlured] = useState(true); // Indica se o componente está com foco (usado para mostrar/esconder as opções).
  const [lastValidSelection, setLastValidSelection] = useState(null); // Armazena o último item válido selecionado pelo usuário.

  const bounceTimeoutRef = useRef(null); // Ref para o timer do debounce.
  const autoCompleteRef = useRef(null); // Ref para o componente AutoComplete.

  /**
   * Efeito que sincroniza o estado interno do componente com a prop `value` (controlada) vinda de fora.
   * Executa sempre que o `controlledValue` mudar.
   */
  useEffect(() => {
    if (controlledValue) {
      // Usa selectedView se existir, senão usa a view padrão para formatar o valor.
      const displayValue = selectedView?.(controlledValue) || view(controlledValue);

      setInputValue(displayValue);
      setLastValidSelection(controlledValue);
    } else {
      // Limpa os valores internos se o valor controlado for nulo.
      setInputValue('');
      setLastValidSelection(null);
    }
  }, [controlledValue, view, selectedView]);

  /**
   * Realiza a busca de dados, seja via URL (axios) ou por uma função customizada.
   */
  const performSearch = useCallback(async (searchText = '') => {
    setLoading(true);

    let searchPromise;

    if (customSearch) {
      searchPromise = customSearch(searchText);
    } else if (url) {
      searchPromise = axios.get(url, {
        params: {
          ...params,
          [searchKey]: searchText, // Usa a chave de busca configurável.
        },
      });
    }

    try {
      let results = await searchPromise;

      results = results?.data || results;

      // Permite a transformação dos resultados brutos.
      if (onResult) {
        results = onResult(results);
      }

      if (!results) {
        results = [];
      }

      // Adiciona itens padrão no início da lista, se existirem.
      if (defaults?.length) {
        results = [...defaults, ...results];
      }

      setData(results);
      return results;
    } catch (error) {
      onError?.(error); // Notifica o componente pai sobre o erro.
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [url, params, customSearch, onResult, defaults, searchKey, onError]);

  /**
   * Manipulador para a digitação do usuário. Aplica um debounce para evitar buscas a cada tecla pressionada.
   */
  const handleSearch = (text) => {
    setInputValue(text);

    // Limpa o timeout anterior para reiniciar a contagem do debounce.
    if (bounceTimeoutRef.current) {
      clearTimeout(bounceTimeoutRef.current);
    }

    setLoading(true);

    // Agenda a busca para ocorrer após o tempo de debounce.
    bounceTimeoutRef.current = setTimeout(() => {
      performSearch(text);
    }, debounceTime);
  }

  /**
   * Manipulador para a seleção de um item da lista.
   */
  const handleSelect = (_, option) => {
    const selectedItem = data[option['data-index']];

    if (!selectedItem) {
      return;
    }

    const displayValue = selectedView?.(selectedItem) || view(selectedItem);

    setInputValue(displayValue);
    setLastValidSelection(selectedItem);
    onChange?.(selectedItem); // Notifica o componente pai sobre a nova seleção.

    autoCompleteRef.current?.blur(); // Tira o foco do componente.
  }

  /**
   * Manipulador para quando o componente perde o foco (blur).
   * Garante que, se `allowFreeText` for falso, o valor do input reverta para a última seleção válida.
   */
  const handleBlur = () => {
    setIsBlured(true);

    if (!allowFreeText) {
      // Se o usuário digitou algo inválido e saiu, restaura o último valor válido.
      if (lastValidSelection) {
        const displayValue = selectedView?.(lastValidSelection) || view(lastValidSelection);
        setInputValue(displayValue);
      } else {
        // Se não havia seleção anterior, limpa o campo.
        setInputValue('');
      }
    }
    // Nota: A lógica de onChange para texto livre foi omitida aqui,
    // mas poderia ser adicionada para notificar o pai sobre o valor digitado.
  }

  /**
   * Manipulador para quando o componente ganha foco.
   * Reabre a lista de opções e realiza uma busca com o valor atual.
   */
  const handleFocus = () => {
    setIsBlured(false);
    performSearch(inputValue);
  }

  /**
   * Manipulador para o botão de limpar.
   */
  const handleClear = (e) => {
    e.stopPropagation(); // Evita que o onFocus seja disparado e abra o dropdown.

    // Reseta todos os estados relevantes.
    setInputValue('');
    setData([]);
    setLastValidSelection(null);
    onChange?.(null); // Notifica o componente pai que o valor foi limpo.

    autoCompleteRef.current?.blur(); // Remove o foco do input.
  }

  /**
   * Determina qual ícone (sufixo) deve ser exibido no input.
   */
  const getSuffix = () => {
    // Prioridade 1: Botão de limpar.
    if (allowClear && inputValue && !disabled) {
      return (
        <CloseOutlined onClick={handleClear}
          style={{ fontSize: 11, cursor: 'pointer' }} />
      );
    }

    // Prioridade 2: Ícones de estado (loading ou seta).
    if (showArrow) {
      return loading ? (
        <LoadingOutlined style={{ fontSize: 11 }} />
      ) : (
        <DownOutlined style={{ fontSize: 11 }} />
      );
    }

    return null;
  }

  // Mapeia os dados da busca para o formato de `options` esperado pelo Ant Design.
  // Se o componente estiver "blured" (sem foco), a lista de opções fica vazia para escondê-la.
  const options = isBlured ? [] : data.map((item, index) => ({
    'data-index': index, // Guarda o índice para localizar o objeto original no `handleSelect`.
    value: view(item, index), // O valor usado para a seleção e preenchimento.
    label: <div key={index}>{view(item, index)}</div>, // O elemento React a ser renderizado na lista.
  }));

  return (
    <AutoComplete {...restProps}
      ref={autoCompleteRef}
      value={inputValue}
      options={options}
      onSelect={handleSelect}
      onSearch={handleSearch}
      onBlur={handleBlur}
      onFocus={handleFocus}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      defaultActiveFirstOption>
      <Input placeholder={placeholder}
        size={size}
        suffix={getSuffix()}
        autoFocus={autoFocus}
        spellCheck={false} />
    </AutoComplete>
  );
}