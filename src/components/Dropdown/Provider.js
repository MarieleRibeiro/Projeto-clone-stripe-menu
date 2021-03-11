import React, { useCallback, useState, useEffect } from "react";

export const Context = React.createContext();

export function DropdownProvider({ children }) {
  const [options, setOptions] = useState([]);
  const [targetId, setTargetId] = useState([null]); // representa a opção que a pessoa colocou o mouse, por inicio é nulo
  const [cachedId, setCacheId] = useState([null]); // representa a ultima opção que a pessoa colocou o mouse em cima/ é uma memoria vai guardar o ultimo id

  const registerOption = useCallback(
    // FUNCAO E CHAMADA QUANDO ALGUMA COISA MUDA, EU QUERO RECALCULAR A FUNCAO
    ({
      id, //SE MUDAR O ID
      optionDimensions, // SE MUDAR AS DIMENSOES
      optionCenterX, // PARA O ITEM SABER ONDE VAI SE POSICIONAR NO CENTRO, CENTRO DA OPCAO
      WrappedContent,
      backgroundHeight,
    }) => {
      setOptions((items) => [
        ...items,
        {
          id,
          optionDimensions,
          optionCenterX,
          WrappedContent,
          backgroundHeight,
        },
      ]);
    },
    [setOptions]
  );

  const updateOptionProps = useCallback(
    //FUNCAO PARA ATUALIZAR QUANDO REDIMENSIONA A TELA
    (optionId, props) => {
      setOptions((items) =>
        items.map((item) => {
          // PARA CADA ITEM INDIVIDUAL EU VOU RETORNAR ELE MESMO
          if (item.id === optionId) {
            // CASO O ITEM SEJA EXATAMENTE DA OPCAO QUE A PESSOA ESTA PASSANDO
            item = { ...item, ...props }; //O ITEM VAI SER ELE MESMO MAIS COM AS NOVAS PROPRIEDADES QUE FORAM SETADAS
          }
          return item;
        })
      );
    },
    [setOptions] // QUANDO O SETOPTIONS MUDAR
  );

  // RECEBER UM ID E VOU RETORNAR JUSTAMENTE AQUELE OPCAO QUE TEM O ID
  const getOptionById = useCallback(
    // BUSCANDO UM VALOR, ACESSANDO UM VALOR
    (id) => options.find((item) => item.id === id), // VOU RECEBER UM ID E COM BASE NESSE ID
    [options] // VOU RETORNAR O ITEM QUE TEM O ID IGUAL O ID QUE A PESSOA PASSOU
  );

  const deleteOptionById = useCallback(
    (id) => {
      setOptions((items) => items.filter((item) => item.id !== id));
    }, // EU VOU FILTRAR O ITEM QUE TIVER O ID DIFERENTE DO ID QUE A PESSOA PASSAR E VAI SER DELETADO
    [setOptions]
  );

  useEffect(() => {
    // é um hook baseado em efeitos colaterais
    if (targetId !== null) setCacheId(targetId);
  }, [targetId]); // receber o que vai sofrer esse efeito colateral [];

  return (
    <Context.Provider // o provider so pode repassar para os seus filhos oque estiver dentro do value
      value={{
        // o value é justamente oque vai sair daqui para o mundo
        registerOption,
        updateOptionProps,
        getOptionById,
        deleteOptionById,
        options,
        targetId,
        setTargetId,
        cachedId,
        setCacheId,
      }}
    >
      {children}
    </Context.Provider>
  );
}
