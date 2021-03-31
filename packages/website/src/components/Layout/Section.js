import * as React from "react";
import classnames from "classnames";
import { useInterval } from "react-use";

export const Section = ({
  children,
  className,
  width = "content",
  first = false,
  marginBottom = true,
  marginTop = true,
  ...props
}) => (
  <section
    className={classnames(
      "px-8",
      {
        "pt-48 desktop:pt-80": marginTop && first, // + navigation offset => pt-32 desktop:pt-48
        "pt-16 desktop:pt-32": marginTop && !first,
        "pb-16 desktop:pb-32": marginBottom,
      },
      className
    )}
    {...props}
  >
    <div
      className={classnames("mx-auto", { "max-w-content": width === "content", "max-w-layout": width === "layout" })}
    >
      {children}
    </div>
  </section>
);

export const SectionTitle = ({ children, className, ...props }) => (
  <h2 className={classnames("text-3xl desktop:text-4xl font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const SectionTitleCaption = ({ children, className, ...props }) => (
  <h6 className={classnames("text-xs uppercase my-3", className)} {...props}>
    {children}
  </h6>
);

export const CardContainer = ({ Component, cards, ...props }) => {
  return (
    <div {...props}>
      {cards.map((card, index) => (
        <Component key={index} {...card} />
      ))}
    </div>
  );
};

export const CardCarousel = ({ CardComponent, cards, interval = null, fullWidth = false }) => {
  const [paused] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState(0);

  useInterval(() => setActiveCard(activeCard + 1 < cards.length ? activeCard + 1 : 0), paused ? null : interval);

  return (
    <div className="flex flex-col items-center relative">
      <div className="opacity-0">
        <CardComponent {...cards[activeCard]} />
      </div>

      {cards.map((card, index) => (
        <div
          key={index}
          className={classnames("transition-opacity absolute", {
            "opacity-0": activeCard !== index,
            "w-full": fullWidth,
          })}
        >
          <CardComponent {...card} />
        </div>
      ))}

      <div className="flex justify-center mt-8">
        {cards.map((card, index) => (
          <button key={index} type="button" className="p-3 flex" onClick={() => setActiveCard(index)}>
            <span
              className={classnames("circle transition-colors", {
                "bg-primary border-2 border-primary": activeCard === index,
                "bg-white border-2 border-palette-600": activeCard !== index,
              })}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const CardWithTitle = ({ Icon, title }) => (
  <div className="flex flex-col items-center">
    <Icon height="142" />
    <p className="text-center mt-4 font-light text-palette-600 text-lg">{title}</p>
  </div>
);

const Label = ({ children }) => (
  <span className="inline-flex items-center px-3 leading-5 rounded-full text-xxs bg-palette-200 text-palette-600 lowercase">
    {children}
  </span>
);

export const CardWithDescription = ({ Icon, label, title, text }) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-4">
      <Icon />
      {label && <Label>{label}</Label>}
    </div>
    <h3 className="font-light text-lg mt-6">{title}</h3>
    <p className="text-palette-400 font-content mt-6">{text}</p>
  </div>
);
