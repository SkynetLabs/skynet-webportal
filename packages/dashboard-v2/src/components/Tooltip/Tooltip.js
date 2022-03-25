import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Popper = styled.div.attrs({
  className: `absolute left-full top-1/2 z-10 px-2 py-1 text-xs
              bg-black/90 text-white rounded`,
})`
  transform: translateY(-50%);
  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const Tooltip = ({ message, children, className }) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <span className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && <Popper className={className}>{message}</Popper>}
    </span>
  );
};
