import styled from "styled-components";

const Bar = styled.div.attrs({
  className: `relative flex justify-end h-4 bg-primary rounded-l rounded-r-lg`,
})`
  min-width: 1rem;
  width: ${({ $percentage }) => $percentage}%;
`;

const BarTip = styled.span.attrs({
  className: "relative w-4 h-4 border-2 rounded-full bg-white border-primary",
})``;

const BarLabel = styled.span.attrs({
  className: "bg-white rounded border-2 border-palette-200 px-3 whitespace-nowrap absolute shadow",
})`
  right: max(0%, ${({ $percentage }) => 100 - $percentage}%);
  top: -0.5rem;
  transform: translateX(50%);
`;

export const GraphBar = ({ value, limit, label }) => {
  const percentage = typeof limit !== "number" || limit === 0 ? 0 : (value / limit) * 100;

  return (
    <div className="relative flex items-center">
      <Bar $percentage={percentage}>
        <BarTip />
      </Bar>
      <BarLabel $percentage={percentage}>
        <span className="font-sora text-lg">{label.value}</span> <span>{label.unit}</span>
      </BarLabel>
    </div>
  );
};
