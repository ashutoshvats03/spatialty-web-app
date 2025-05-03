
"use client";

import { useState, useEffect, React } from 'react';

const YourComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full pb-10 mt-10">
      <div className={`mt-5 ${isExpanded ? "hidden" : "block"}`}>
        <button onClick={toggleExpand} className={`bg-red-600 font-bold text-white px-4 py-2 rounded hover:bg-red-700 `}>
          Show More
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "h-auto" : "h-0"}`}>
        <div className="note">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
          blanditiis natus modi unde, voluptatem quod perferendis numquam dolor
          accusantium harum odit. Quaerat non vel ad a alias et quibusdam harum
          nisi quis, voluptatibus facilis, nostrum nobis earum. Id, nihil
          adipisci! Distinctio enim nihil eius eveniet!
        </div>
        <div className={`mt-5 ${isExpanded ? "block" : "hidden"}`}>
          <button onClick={toggleExpand} className={`bg-red-600 font-bold text-white px-4 py-2 rounded hover:bg-red-700 `}>
            Show Less
          </button>
        </div>
      </div>

    </div>
  );
};

export default YourComponent;
