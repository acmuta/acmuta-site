import React from "react";

const AcmEducateCard = () => {
  return (
    <div className="w-[85%] md:w-6/12 h-auto md:h-72 my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tl-[0px] md:rounded-bl-[0px] border-l-2 md:border-l-[0px] border-r-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:mr-auto p-12 flex flex-col items-end md:items-end justify-center space-y-4">
      {/*  Logo and "acm educate." */}
      <div className="w-full flex items-center justify-center md:justify-end space-x-4">
        <img
          src="/assets/acm-educate-logo.svg"
          alt="ACM UTA Educate Logo"
          className="h-16 md:h-20"
        />
        <h2 className="text-4xl md:text-5xl font-bold">acm educate.</h2>
      </div>

      {/*  Description */}
      <p className="text-lg md:text-xl text-center md:text-right leading-relaxed w-full">
        Focuses on providing students with valuable skills and opportunities to
        develop themselves for the workforce
      </p>

      {/*  Button */}
      <div className="w-full flex justify-center md:justify-end mt-6">
        <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
          learn more
        </button>
      </div>
    </div>
  );
};

export default AcmEducateCard;
