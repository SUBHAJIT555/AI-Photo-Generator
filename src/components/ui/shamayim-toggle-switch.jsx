"use client";

import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const MaleIcon = ({ className, ...props }) => (
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
    className={className}
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 14a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <path d="M19 5l-5.4 5.4" />
    <path d="M19 5h-5" />
    <path d="M19 5v5" />
  </svg>
);

const FemaleIcon = ({ className, ...props }) => (
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
    className={className}
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 9a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <path d="M12 14v7" />
    <path d="M9 18h6" />
  </svg>
);

MaleIcon.propTypes = { className: PropTypes.string };
FemaleIcon.propTypes = { className: PropTypes.string };

/**
 * Shamayim-style gender toggle – orange dots track, Male (left) / Female (right) icons.
 * Controlled: checked = Female selected, unchecked = Male selected.
 */
export function ShamayimGenderToggle({ checked = false, onChange, className }) {
  return (
    <div
      className={cn("shamayim-gender-wrapper", className)}
      style={{ fontSize: "28px" }}
    >
      <input
        type="checkbox"
        className="shamayim-gender-checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label="Gender: Male or Female"
      />
      <span
        className={cn(
          "shamayim-gender-icon",
          !checked ? "active" : "inactive"
        )}
      >
        <MaleIcon className="w-full h-full" />
      </span>
      <div className="shamayim-gender-container">
        <div className="shamayim-gender-button" />
      </div>
      <span
        className={cn(
          "shamayim-gender-icon",
          checked ? "active" : "inactive"
        )}
      >
        <FemaleIcon className="w-full h-full" />
      </span>
    </div>
  );
}

ShamayimGenderToggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default ShamayimGenderToggle;
