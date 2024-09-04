import Link from "next/link";
import React from "react";

// TODO: change content
const AcmCreateCard = () => {
  return (
    <div className="w-[85%] md:w-6/12 h-auto md:h-72 my-12 bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] md: border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:ml-auto p-12 flex flex-col items-center md:items-start justify-center space-y-4">
      {/* Line 1: Logo and name" */}
      <div className="w-full flex items-center justify-center md:justify-start space-x-4">
        <img
          src="/assets/acm-create-logo.svg"
          alt="ACM UTA Create Logo"
          className="h-16 md:h-20"
        />
        <h2 className="text-4xl md:text-5xl font-bold">acm create.</h2>
      </div>

      {/* Description */}
      <p className="text-lg md:text-xl text-center md:text-left leading-relaxed w-full">
        Dedicated to developing industry-applicable skills and technological
        knowledge through semester-long projects.
      </p>

      {/* Button */}
      <div className="w-full flex justify-center md:justify-start">
        <Link href="https://github.com/acmuta" target="_blank">
          <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
            github
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AcmCreateCard;
