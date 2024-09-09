import Image from "next/image";
import React from "react";

export const AboutAcmCard = () => {
  return (
    <div className="flex justify-center items-center my-8 p-4">
      <div className="backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-[60px] px-6 py-8 md:px-12 lg:px-16 md:py-20 text-white border-2 border-white/40 w-full max-w-[95%] lg:max-w-[75%]">
        <div className="flex flex-col md:flex-row items-center">
          {/* ACM Description TODO: change */}
          <div className="w-full md:w-1/2 lg:w-1/2">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/assets/acm-logos/acm-logo-white.png"
                alt="ACM UTA Logo"
                className="h-16 mb-4 md:h-24"
              />
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-6 font-medium">
              The Association for Computing Machinery (ACM) is the world’s
              largest computer science/engineering focused organization.
            </p>
            <p className="text-lg md:text-xl leading-relaxed font-medium">
              The ACM chapter at UTA welcomes students of all backgrounds,
              majors, interests, and skill levels to join our community and
              share in our love for technology. ACM is currently comprised of
              four committees, each serving a different topic and mission.
            </p>
          </div>

          {/* ACM Group Photo */}
          <div className="w-full md:w-1/2 lg:w-1/2 flex justify-center my-4 md:my-0 overflow-hidden p-0 md:p-8">
            <Image
              src="/assets/team-photos/acm-team.JPG"
              alt="Side Image"
              width={500}
              height={500}
              className="object-cover rounded-[15px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
