import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import classnames from "classnames";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export const Carousel = ({ Component, items }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 items, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 item.
  const itemIndex = wrap(0, items.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="opacity-0 flex flex-row">
          {items.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-full">
              <Component {...item} />
            </div>
          ))}
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              // opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute top-0 w-full"
          >
            <Component {...items[itemIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-8">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            className="p-3 flex"
            onClick={() => setPage([index, index > itemIndex ? 1 : -1])}
          >
            <span
              className={classnames("circle transition-colors", {
                "bg-primary border-2 border-primary": itemIndex === index,
                "bg-white border-2 border-palette-600": itemIndex !== index,
              })}
            ></span>
          </button>
        ))}
      </div>
    </>
  );
};
