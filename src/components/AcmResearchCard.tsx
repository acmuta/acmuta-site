import React from "react";

const AcmResearchCard = () => {
  return (
    <div className="w-[85%] md:w-6/12 h-auto md:h-72 my-12 bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] md: border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:ml-auto p-12 flex flex-col items-center md:items-start justify-center space-y-4">
      {/*  Logo  */}
      <div className="w-full flex items-center justify-center md:justify-start space-x-4">
        <img
          src="/assets/acm-research-logo.svg"
          alt="ACM UTA Research Logo"
          className="h-16 md:h-20"
        />
        <h2 className="text-4xl md:text-5xl font-bold">acm research.</h2>
      </div>

      {/* Description */}
      <p className="text-lg md:text-xl text-center md:text-left leading-relaxed w-full">
        Fostering research skills and offering opportunities for students to
        engage in innovative projects, and prepare for future challenges
      </p>

      {/* Button */}
      <div className="w-full flex justify-center md:justify-start">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          learn more
        </button>
      </div>
    </div>
  );
};

export default AcmResearchCard;
