import React from "react";

export const AboutAcmCard = () => {
  return (
    <div className="flex justify-center items-center my-8 p-4">
      <div className="bg-white/10 rounded-[30px] md:rounded-[60px] px-8 py-8 md:px-24 md:py-12 max-w-lg md:max-w-2xl text-white border-2 border-white/40">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/assets/acm-logo-white.png"
            alt="ACM UTA Logo"
            className="h-16 mb-4 md:h-24"
          />
        </div>
        <p className="text-lg md:text-xl leading-relaxed mb-6 font-medium">
          The Association for Computing Machinery (ACM) is the world’s largest
          computer science/engineering focused organization.
        </p>
        <p className="text-lg md:text-xl leading-relaxed font-medium">
          The ACM chapter at UTA welcomes students of all background, majors,
          interests, and skill levels to join our community and share in our
          love for technology. ACM is currently comprised of four committees,
          each serving a different topic and mission.
        </p>
      </div>
    </div>
  );
};
