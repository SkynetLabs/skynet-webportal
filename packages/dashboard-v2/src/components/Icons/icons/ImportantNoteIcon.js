import { withIconProps } from "../withIconProps";

export const ImportantNoteIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd">
      <g fill="currentColor" fillRule="nonzero">
        <path d="M16.028 6c5.523 0 10 4.477 10 10s-4.477 10-10 10h-9c-.405.017-.78-.212-.95-.58-.156-.372-.074-.802.21-1.09l2-2C6.82 20.549 6.02 18.31 6.028 16c0-5.523 4.477-10 10-10zm3.05 2.607c-3.526-1.458-7.592-.222-9.71 2.953-2.119 3.174-1.7 7.403 1 10.1.189.185.296.436.3.7 0 .267-.109.523-.3.71l-.93.93h6.59c3.817-.003 7.1-2.701 7.841-6.445.742-3.744-1.264-7.49-4.79-8.948zM16.028 18c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zM17 12v5h-2v-5h2z" />
      </g>
    </g>
  </svg>
));
