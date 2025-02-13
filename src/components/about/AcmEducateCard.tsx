import React from "react";

const AcmEducateCard = () => {
  return (
    <div className="w-[90%] md:w-[70%] h-auto my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tl-[0px] md:rounded-bl-[0px] border-l-2 md:border-l-[0px] border-r-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:mr-auto p-4 md:p-12 flex flex-col md:flex-row-reverse items-center md:items-end justify-center space-y-4 md:space-y-0 md:space-x-6">
      {/* ACM Educate Group Photo */}
      <div className="w-full md:w-1/2 mb-4 md:mb-0 mt-2 md:mt-4">
        <img
          src="/assets/team-photos/acm-educate-team.JPG"
          alt="ACM Educate Team"
          className="object-cover rounded-xl"
        />
      </div>

      <div className="w-full md:w-1/2 p-2 md:p-8 flex flex-col  space-y-4">
        {/* ACM Educate Logo */}
        <div className="w-[80%] flex items-center space-x-4 mb-4 items-end ml-0 md:ml-auto">
          <img
            src="/assets/acm-logos/acm-educate-logo.svg"
            alt="ACM UTA Educate Logo"
            className="h-16 md:h-20 items-end"
          />
          <h2 className="text-4xl md:text-5xl font-bold text-left md:text-right">
            acm educate.
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl leading-relaxed text-left md:text-right w-full my-4">
          Focuses on providing students with valuable skills and opportunities
          to develop themselves for the workforce.
        </p>

        {/* Button */}
        <div className="w-full flex justify-center my-4">
          <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
            learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcmEducateCard;
