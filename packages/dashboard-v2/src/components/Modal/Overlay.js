import { useRef } from "react";
import { useLockBodyScroll } from "react-use";
import PropTypes from "prop-types";

export const Overlay = ({ children, onClick }) => {
  const overlayRef = useRef(null);

  useLockBodyScroll(true);

  const handleClick = (event) => {
    if (event.target !== overlayRef.current) {
      return;
    }

    event.nativeEvent.stopImmediatePropagation();

    onClick?.(event);
  };

  return (
    <div
      ref={overlayRef}
      role="presentation"
      onClick={handleClick}
      className="fixed inset-0 z-50 bg-palette-100/80 flex items-center justify-center"
    >
      {children}
    </div>
  );
};

Overlay.propTypes = {
  /**
   * Overlay's body.
   */
  children: PropTypes.node.isRequired,
  /**
   * Handler function to be called when user clicks on the overlay
   * (but not the overlay's content).
   */
  onClick: PropTypes.func,
};
