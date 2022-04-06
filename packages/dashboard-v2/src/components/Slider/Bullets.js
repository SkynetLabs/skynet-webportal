import PropTypes from "prop-types";

export default function Bullets({ visibleSlides, activeIndex, allSlides, changeSlide }) {
  if (allSlides <= visibleSlides) {
    return null;
  }

  return (
    <div className="flex gap-3 pt-6 justify-center sm:justify-start">
      {Array(allSlides - visibleSlides + 1)
        .fill(null)
        .map((_, index) => (
          <button
            key={index}
            aria-label={`Slide ${index + 1}`}
            type="button"
            className={`rounded-full w-3 h-3 ${activeIndex === index ? "bg-primary" : "border-2 cursor-pointer"}`}
            onClick={(event) => changeSlide(event, index)}
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
