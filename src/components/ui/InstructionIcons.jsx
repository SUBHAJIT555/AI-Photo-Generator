import PropTypes from "prop-types";
import { motion } from "framer-motion";

const iconClass = "w-6 h-6 shrink-0 mt-0.5";
const REPEAT_DELAY = 3;

function pathProps(isInView, duration, delay) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: isInView
      ? { pathLength: 1, opacity: 1 }
      : { pathLength: 0, opacity: 0 },
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: REPEAT_DELAY,
    },
  };
}

export function UserScanIcon({ isInView = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <motion.path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0, repeat: Infinity, repeatDelay: REPEAT_DELAY }}
      />
      <motion.path
        d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.5, 0.2)}
      />
      <motion.path
        d="M4 8v-2a2 2 0 0 1 2 -2h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.4, 0.4)}
      />
      <motion.path
        d="M4 16v2a2 2 0 0 0 2 2h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.4, 0.6)}
      />
      <motion.path
        d="M16 4h2a2 2 0 0 1 2 2v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.4, 0.8)}
      />
      <motion.path
        d="M16 20h2a2 2 0 0 0 2 -2v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2" 
        {...pathProps(isInView, 0.4, 1)}
      />
      <motion.path
        d="M8 16a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.4, 1.2)}
      />
    </svg>
  );
}
UserScanIcon.propTypes = { isInView: PropTypes.bool };

export function ClockPauseIcon({ isInView = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <motion.path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0, repeat: Infinity, repeatDelay: REPEAT_DELAY }}
      />
      <motion.path
        d="M20.942 13.018a9 9 0 1 0 -7.909 7.922"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.6, 0.2)}
      />
      <motion.path
        d="M12 7v5l2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.4, 0.7)}
      />
      <motion.path
        d="M17 17v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.3, 1)}
      />
      <motion.path
        d="M21 17v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.3, 1.2)}
      />
    </svg>
  );
}
ClockPauseIcon.propTypes = { isInView: PropTypes.bool };

export function EyeIcon({ isInView = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <motion.path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0, repeat: Infinity, repeatDelay: REPEAT_DELAY }}
      />
      <motion.path
        d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.5, 0.2)}
      />
      <motion.path
        d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...pathProps(isInView, 0.6, 0.6)}
      />
    </svg>
  );
}
EyeIcon.propTypes = { isInView: PropTypes.bool };
