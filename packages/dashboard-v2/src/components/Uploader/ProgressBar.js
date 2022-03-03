import cn from "classnames";
import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

const moveAnimation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 15px 0;
  }
`;
const Container = styled.div.attrs(({ $status }) => ({
  className: cn("flex relative  rounded-sm h-1", { "bg-palette-200": $status === "uploading" }),
}))``;

const Indicator = styled.div.attrs(({ $status }) => ({
  className: cn(
    `
    rounded-sm bg-[length:15px_10px]
  `,
    {
      "bg-primary": $status === "uploading" || $status === "complete",
      "text-primary": $status !== "error",
      "text-error": $status === "error",
      "bg-dashed": $status === "error" || $status === "enqueued" || $status === "processing",
    }
  ),
}))`
  width: ${({ $status, $percentage }) => ($status === "uploading" ? $percentage : 100)}%;
  &.bg-dashed {
    opacity: 0.4;
    background-image: linear-gradient(
      -60deg,
      transparent,
      transparent 30%,
      currentColor 30%,
      currentColor 70%,
      transparent 70%,
      transparent
    );
    animation: ${css`
      ${moveAnimation} 1s linear infinite
    `};
  }
`;

/**
 * Primary UI component for indicating progress of a given task
 */
export const ProgressBar = ({ status, percentage, ...props }) => (
  <Container $status={status} {...props}>
    <Indicator $status={status} $percentage={percentage} />
  </Container>
);

ProgressBar.propTypes = {
  /**
   * Status of the task
   */
  status: PropTypes.oneOf(["complete", "enqueued", "error", "uploading", "processing"]),
  /**
   * Progress of the task (in case status is "uploading")
   */
  percentage: PropTypes.number,
};

ProgressBar.defaultProps = {
  status: "enqueued",
  percentage: 0,
};
