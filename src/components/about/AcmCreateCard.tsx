import Link from "next/link";
import React from "react";

// TODO: change content
const AcmCreateCard = () => {
  return (
    <div className="w-[90%] md:w-[70%] h-auto my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:ml-auto p-4 md:p-12 flex flex-col md:flex-row md:space-x-6 items-center md:items-start justify-center space-y-4 md:space-y-0">
      {/* ACM Create Group Photo */}
      <div className="w-full md:w-1/2 mb-4 md:mb-0 mt-2 md:mt-4">
        <img
          src="/assets/team-photos/acm-create-team.JPG"
          alt="ACM Create Team"
          className="object-cover rounded-xl"
        />
      </div>

      <div className="w-full md:w-1/2 p-2 md:p-6">
        {/* ACM Create Logo */}
        <div className="w-full flex items-center justify-start space-x-4">
          <img
            src="/assets/acm-logos/acm-create-logo.svg"
            alt="ACM UTA Create Logo"
            className="h-16 md:h-16"
          />
          <h2 className="text-4xl md:text-5xl font-bold">acm create.</h2>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-left leading-relaxed w-full my-4">
          Dedicated to developing industry-applicable skills and technological
          knowledge through semester-long projects. Dedicated to developing
          industry-applicable skills and technological knowledge through
          semester-long projects.
        </p>

        {/* Button */}
        <div className="w-full flex justify-start my-4">
          <Link href="https://github.com/acmuta" target="_blank">
            <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
              github
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcmCreateCard;
