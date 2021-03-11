import { useState, useCallback, useLayoutEffect } from "react";

const getDimensions = (element) => element.getBoundingClientRect(); // função serve para retornar o tamanho de um elemento e sua posição relativa ao viewport,
// ou seja para o programa não se perder a gente precisa que seja disparado uma função sempre que o usuario
// redimensionar a tela para recalcular esse valores e não perder a responsividade

export function useDimensions(responsive = true) {
  // por padrão vai ser responsiva
  const [dimensions, setDimensions] = useState(null); // armazenar examente quanto que mede as dimensões dessa opção
  const [element, setElement] = useState(null); // armazenar o elemento alvo que quer calcular os valores

  const hook = useCallback((e) => setElement(e), []);

  useLayoutEffect(() => {
    //
    if (element) {
      const updateDimensions = () => {
        window.requestAnimationFrame(() => {
          setDimensions(getDimensions(element));
        });
      };
      updateDimensions();

      if (responsive) {
        window.addEventListener("resize", updateDimensions);

        return () => {
          window.removeEventListener("resize", updateDimensions);
        };
      }
    }
  }, [element, hook, responsive]);

  return [hook, dimensions, element];
}
