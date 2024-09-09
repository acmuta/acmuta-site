import Link from "next/link";
import React from "react";

const AcmHackCard = () => {
  return (
    <div className="w-[90%] md:w-[70%] h-auto md:h-72 my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tl-[0px] md:rounded-bl-[0px] border-l-2 md:border-l-[0px] border-r-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:mr-auto p-12 flex flex-col items-end md:items-end justify-center space-y-4">
      {/*  Logo and "acm educate." */}
      <div className="w-full flex items-center justify-center md:justify-end space-x-4">
        <img
          src="/assets/acm-hackuta-logo.svg"
          alt="ACM HackUTA Logo"
          className="h-16 md:h-20"
        />
        <h2 className="text-4xl md:text-5xl font-bold">acm hackUTA.</h2>
      </div>

      {/* Description */}
      <p className="text-lg md:text-xl text-center md:text-right leading-relaxed w-full">
        HackUTA is the official student hackathon of UT Arlington, and it will
        be back again this October. Watch out for those registrations.
      </p>

      {/* Button */}
      <div className="w-full flex justify-center md:justify-end">
        <Link href="https://www.hackuta.org/" target="_blank">
          <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
            website
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AcmHackCard;
