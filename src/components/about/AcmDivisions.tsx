import React from "react";

const AcmDivisions = () => {
  return (
    <div className="z-10 backdrop-blur-md bg-white/10 text-white py-12 px-4 my-8">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4">Divisions</h2>
      </div>
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto ">
        <div className="flex items-center space-x-4 mx-auto">
          <img
            src="/assets/acm-create-logo.svg"
            alt="ACM Create"
            className="h-16"
          />
          <span className="text-white font-bold text-3xl mx-auto">
            ACM Create.
          </span>
        </div>
        <div className="flex items-center space-x-4 mx-auto">
          <img
            src="/assets/acm-educate-logo.svg"
            alt="ACM Educate"
            className="h-16"
          />
          <span className="text-white font-bold text-3xl">ACM Educate.</span>
        </div>

        <div className="flex items-center space-x-4 mx-auto">
          <img
            src="/assets/acm-research-logo.svg"
            alt="ACM Research"
            className="h-16"
          />
          <span className="text-white font-bold text-3xl">ACM Research.</span>
        </div>

        <div className="flex items-center space-x-4 mx-auto">
          <img
            src="/assets/acm-hackuta-logo.svg"
            alt="ACM HackUTA"
            className="h-16"
          />
          <span className="text-white font-bold text-3xl">ACM HackUTA.</span>
        </div>
      </div>
    </div>
  );
};

export default AcmDivisions;
