import cn from "classnames";
import PropTypes from "prop-types";

import { PlusIcon } from "../Icons";
import { Panel } from "../Panel";

import { ModalPortal } from "./ModalPortal";
import { Overlay } from "./Overlay";

export const Modal = ({ children, className, onClose }) => (
  <ModalPortal>
    <Overlay onClick={onClose}>
      <div className={cn("relative w-modal max-w-modal shadow-sm rounded")}>
        <button onClick={onClose} className="absolute top-[20px] right-[20px]" aria-label="Close">
          <PlusIcon size={14} className="rotate-45" />
        </button>
        <Panel className={cn("px-8 py-6 sm:px-12 sm:py-10", className)}>{children}</Panel>
      </div>
    </Overlay>
  </ModalPortal>
);

Modal.propTypes = {
  /**
   * Modal's body.
   */
  children: PropTypes.node.isRequired,
  /**
   * Handler function to be called when user clicks on the "X" icon,
   * or outside of the modal.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Additional CSS classes to be applied to modal's body.
   */
  className: PropTypes.string,
};
