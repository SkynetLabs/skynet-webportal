import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const MODAL_ROOT_ID = "__modal-root";

export const ModalPortal = ({ children }) => {
  const ref = useRef();
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(MODAL_ROOT_ID) || document.body;
    setIsClientSide(true);
  }, []);

  return isClientSide ? createPortal(children, ref.current) : null;
};
