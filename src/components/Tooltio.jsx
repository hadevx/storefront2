import React from "react";

function Tooltip({ content }) {
  return (
    <div className="relative flex items-center">
      {/* Icon */}
      <div className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
        i
      </div>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 bg-gray-500 text-white p-2 rounded hidden group-hover:block hover:block">
        {content}
      </div>
    </div>
  );
}

export default Tooltip;
