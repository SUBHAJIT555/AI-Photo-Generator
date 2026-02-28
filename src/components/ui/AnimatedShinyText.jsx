import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultGradient =
  "linear-gradient(90deg, #FF5900, #ffffff, #ff8c4d, #FF5900)";

function AnimatedText(
  {
    text,
    gradientColors = defaultGradient,
    gradientAnimationDuration = 2.5,
    hoverEffect = false,
    className,
    textClassName,
    ...props
  },
  ref
) {
  const [isHovered, setIsHovered] = React.useState(false);

  const textVariants = {
    initial: { backgroundPosition: "0% 0" },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: gradientAnimationDuration,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div
      ref={ref}
      className={cn("flex justify-center items-center py-4", className)}
      {...props}
    >
      <motion.h1
        className={cn(
          "text-[2rem] sm:text-[3rem] md:text-[4rem] leading-normal font-semibold",
          textClassName
        )}
        style={{
          background: gradientColors,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: isHovered ? "0 0 12px rgba(255,89,0,0.3)" : "none",
        }}
        variants={textVariants}
        initial="initial"
        animate="animate"
        onHoverStart={() => hoverEffect && setIsHovered(true)}
        onHoverEnd={() => hoverEffect && setIsHovered(false)}
      >
        {text}
      </motion.h1>
    </div>
  );
}

AnimatedText.displayName = "AnimatedText";

const AnimatedTextForwarded = React.forwardRef(AnimatedText);
export { AnimatedTextForwarded as AnimatedText };
