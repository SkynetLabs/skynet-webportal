export default function Underline({ children, color, size }) {
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(to bottom, ${color}, ${color})`,
        backgroundPosition: "0 1.1rem",
        backgroundRepeat: "repeat-x",
        backgroundSize: `${size} ${size}`,
      }}
    >
      {children}
    </span>
  );
}
