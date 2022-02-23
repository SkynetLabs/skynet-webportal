import PropTypes from "prop-types";

export default function Bullets({ visibleSlides, activeIndex, allSlides, changeSlide }) {
  if (allSlides <= visibleSlides) {
    return null;
  }

  return (
    <div className="flex gap-3 pt-6">
      {Array(allSlides - visibleSlides + 1)
        .fill(null)
        .map((_, i) => (
          <span
            key={`slider-bullets-${i}`}
            className={`rounded-full w-3 h-3 ${activeIndex === i ? "bg-primary" : "border-2 cursor-pointer"}`}
            onClick={() => changeSlide(i)}
          />
        ))}
    </div>
  );
}

Bullets.propTypes = {
  allSlides: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  visibleSlides: PropTypes.number.isRequired,
  changeSlide: PropTypes.func.isRequired,
};
