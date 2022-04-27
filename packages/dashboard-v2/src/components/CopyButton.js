import { useCallback, useRef, useState } from "react";
import copy from "copy-text-to-clipboard";
import styled from "styled-components";
import { useClickAway } from "react-use";

import { CopyIcon } from "./Icons";

const Button = styled.button.attrs({
  className: "relative inline-flex items-center hover:text-primary",
})``;

const TooltipContainer = styled.div.attrs(({ $visible }) => ({
  className: `absolute left-full top-1/2 z-10
              bg-white rounded border border-primary/30 shadow-md
              pointer-events-none transition-opacity duration-150 ease-in-out
              ${$visible ? "opacity-100" : "opacity-0"}`,
}))`
  transform: translateY(-50%);
`;

const TooltipContent = styled.div.attrs({
  className: "bg-primary-light/10 text-palette-600 py-2 px-4 ",
})``;

export const CopyButton = ({ value, className, ariaLabel = "Copy" }) => {
  const containerRef = useRef();
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleCopy = useCallback(() => {
    clearTimeout(timer);
    copy(value);
    setCopied(true);

    setTimer(setTimeout(() => setCopied(false), 1500));
  }, [value, timer]);

  useClickAway(containerRef, () => setCopied(false));

  return (
    <div ref={containerRef} className={`inline-flex relative overflow-visible pr-2 ${className ?? ""}`}>
      <Button onClick={handleCopy} className={copied ? "text-primary" : ""} aria-label={ariaLabel}>
        <CopyIcon size={16} />
      </Button>
      <TooltipContainer $visible={copied}>
        <TooltipContent>Copied to clipboard</TooltipContent>
      </TooltipContainer>
    </div>
  );
};
