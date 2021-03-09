import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useDimensions } from "./Dimensions";
import { useDropDown } from "./Provider";

let lastOptionId = 0;

export function DropdownOption({ name, content: Content, backgroundHeight }) {
  const idRef = useRef(++lastOptionId);
  const id = idRef.current;
  const {
    updateOptionProps,
    deleteOptionByID,
    registerOption,
    setTargetId,
    targetId,
  } = useDropDown();

  const [optionHook, optionDimensions] = useDimensions();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered && optionDimensions) {
      const WrapperContent = () => {
        const contentRef = useRef();

        useEffect(() => {
          const contentDimensions = contentRef.current.getBoundingClientRect();
          updateOptionProps(id, contentDimensions);
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
        optionCenterX: optionDimensions.x + optionDimensions.widht / 2,
        WrapperContent,
        backgroundHeight,
      });

      setRegistered(true);
    } else if (registered && optionDimensions) {
      updateOptionProps(id, {
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.widht / 2,
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

  const handleOpen = () => setTargetId(id);
  const handleClose = () => setTargetId(null);
  const handleTouch = () => (window.isMobile = true);

  const handleClick = (e) => {
    e.preventDefault();

    return targetId === id ? handleClose() : handleOpen();
  };

  return (
    <motion.button
      className="dropdown-option"
      ref={optionHook}
      onMouseDown={handleClick}
      onHoverStart={() => !window.isMobile && handleOpen()}
      onHoverEnd={() => !window.isMobile && handleClose()}
      onTouchStart={handleTouch}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {name}
    </motion.button>
  );
}
