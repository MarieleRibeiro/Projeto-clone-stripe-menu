import { useRef, useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";

import { useDimensions } from "./Dimensions";
import { Context } from "./Provider";

let lastOptionId = 0;

export function DropdownOption({ name, content: Content, backgroundHeight }) {
  const idRef = useRef(++lastOptionId); // opção de criar um id unico
  const id = idRef.current;

  const [optionHook, optionDimensions] = useDimensions();
  const [registered, setRegistered] = useState(false); // registrar as opções

  const {
    registerOption,
    updateOptionProps,
    deleteOptionByID,
    setTargetId,
    targetId,
  } = useContext(Context);

  useEffect(() => {
    if (!registered && optionDimensions) {
      // se o componente não foi registrado e ja tem suas dimensões calculadas pelo nosso hook
      const WrappedContent = () => {
        // todo o conteudo vai ser empacotado dentro do elemento wrappedcontent
        const contentRef = useRef(); //

        useEffect(() => {
          // vinculando as dimensões do conteudo ao proprio pai dele
          const contentDimensions = contentRef.current.getBoundingClientRect();
          updateOptionProps(id, { contentDimensions });
        }, []);

        return (
          <div ref={contentRef}>
            <Content />
          </div>
        );
      };

      registerOption({
        id,
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.width / 2, // onde é o centro da opção
        WrappedContent, // conteudo encapsulado
        backgroundHeight,
      });

      setRegistered(true);
    } else if (registered && optionDimensions) {
      // caso o componente ja esteja sido registrado e tenha novas dimensões
      updateOptionProps(id, {
        // vou fazer um update nas minhas props
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.width / 2,
      });
    }
  }, [
    registerOption,
    id,
    registered,
    optionDimensions,
    updateOptionProps,
    deleteOptionByID,
    backgroundHeight,
  ]);

  //ABRIR E FECHAR A MODAL
  const handleOpen = () => setTargetId(id);
  const handleClose = () => setTargetId(null);
  const handleTouch = () => (window.isMobile = true); //QUANDO ESTIVER NO CELULAR

  // CHAMANDO UM EVENTO SE O ID FOR O MESMO QUE ESTOU COM O MOUSE ELE IRA APARECER SE NAO FECHAR
  const handleClick = (e) => {
    e.preventDefault();

    return targetId === id ? handleClose() : handleOpen();
  };

  return (
    <motion.button
      className="dropdown-option"
      ref={optionHook} // onde vai receber as referencias do botão
      onMouseDown={handleClick} //
      onHoverStart={() => !window.isMobile && handleOpen()} // quando alguem passa o mouse em cima, se a pessoa esta no celular nao vou permitir que passe o mouse em cima
      onHoverEnd={() => !window.isMobile && handleClose()} // se o usuario estiver no celular nada vai mudar se acaso for para o computador eu abro a funcao para ela
      onTouchStart={handleTouch} // quando utilizar o touch do celular ter o evento
      onFocus={handleOpen} // quando aperta a tecla tab e ele meche com o techado o elemento esta focado na tela
      onBlur={handleClose} // quando alguem desfoca
    >
      {name}
    </motion.button>
  );
}
