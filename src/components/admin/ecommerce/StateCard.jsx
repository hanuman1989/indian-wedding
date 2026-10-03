import React from "react";
import PropTypes from "prop-types";

export default function StatCard({
  icon: Icon,
  value,
  label,
  iconBgClass = "bg-gray-100 dark:bg-gray-800",
  iconColorClass = "text-gray-800 dark:text-white/90",
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 ${className}`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBgClass}`}
      >
        <Icon className={`size-6 ${iconColorClass}`} />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  /** Icon component to render, e.g. from lucide-react */
  icon: PropTypes.elementType.isRequired,
  /** The main stat value, e.g. 128 or "$1,240" */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Label shown above the value, e.g. "Total Weddings" */
  label: PropTypes.string.isRequired,
  /** Background classes for the icon wrapper */
  iconBgClass: PropTypes.string,
  /** Text/color classes for the icon itself */
  iconColorClass: PropTypes.string,
  /** Optional extra classes for the outer card */
  className: PropTypes.string,
};
