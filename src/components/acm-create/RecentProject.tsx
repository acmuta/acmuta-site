import React from "react";
import Link from "next/link";
import Image from "next/image";

const RecentProject = () => {
  return (
    <div>
      {/* MAVGRADE */}
      <div className="w-[90%] md:w-[70%] h-auto my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:ml-auto p-4 md:p-12 flex flex-col md:flex-row md:space-x-6 items-center md:items-start justify-center space-y-4 md:space-y-0">
        {/* Photo */}
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0 mt-2 md:mt-4 aspect-video">
          <Image
            src="/assets/projects/mavgrade.JPG"
            alt="MavGrades"
            fill
            className="object-cover rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-2 md:p-6">
          <div className="w-full flex items-center justify-start space-x-4">
            <h2 className="text-4xl md:text-5xl font-bold">MavGrades</h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-left leading-relaxed w-full my-4">
            Discover grade distributions for UTA courses and professors,
            empowering students to make well-informed class choices, featuring
            up-to-date and accurate grade data for all courses taught at UTA.
          </p>

          {/* Button */}
          <div className="w-full flex justify-center my-4">
            <Link href="https://github.com/acmuta/mavgrades" target="_blank">
              <button className="font-bold border border-white/60 rounded-2xl px-3 py-1 mr-4">
                github
              </button>
            </Link>

            <Link href="https://www.mavgrades.com/">
              <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
                website
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* UTA Roommate */}
      <div className="w-[90%] md:w-[70%] h-auto my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tl-[0px] md:rounded-bl-[0px] border-l-2 md:border-l-[0px] border-r-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:mr-auto p-4 md:p-12 flex flex-col md:flex-row-reverse items-center md:items-end justify-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Photo */}
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0 mt-2 md:mt-4 aspect-video">
          <Image
            src="/assets/acm-logos/acm-logo.svg"
            alt="Uta Roommate"
            fill
            className="object-contain rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-2 md:p-8 flex flex-col  space-y-4">
          {/* ACM Educate Logo */}
          <div className="w-[80%] flex items-center space-x-4 mb-4 items-end ml-0 md:ml-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-left md:text-right">
              UTA Roommate
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl leading-relaxed text-left md:text-right w-full my-4">
            A student-focused platform designed to help UTA students find
            compatible roommates for housing. Instead of randomly selecting a
            roommate, students can match with others based on shared
            preferences, lifestyle habits, and budget.
          </p>

          {/* Button */}
          <div className="w-full flex justify-start md:justify-end my-4">
            <Link
              href="https://github.com/acmuta/uta-roommates"
              target="_blank"
            >
              <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
                github
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MAVERICK MARKETPLACE */}
      <div className="w-[90%] md:w-[70%] h-auto my-12 backdrop-blur-md bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-[0px] md:ml-auto p-4 md:p-12 flex flex-col md:flex-row md:space-x-6 items-center md:items-start justify-center space-y-4 md:space-y-0">
        {/* Photo */}
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0 mt-2 md:mt-4 aspect-video">
          <Image
            src="/assets/acm-logos/acm-logo.svg"
            alt="Maverick Marketplace"
            fill
            className="object-contain rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-2 md:p-6">
          <div className="w-full flex items-center justify-start space-x-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Maverick Marketplace
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-left leading-relaxed w-full my-4">
            A dedicated buying and selling platform exclusively for UTA
            students. It allows students to sell items they no longer need and
            find affordable deals on useful products within the UTA community.
          </p>

          {/* Button */}
          <div className="w-full flex justify-center my-4">
            <Link href="#" target="_blank">
              <button className="font-bold border border-white/60 rounded-2xl px-3 py-1 mr-4">
                github
              </button>
            </Link>

            {/* <Link href="https://www.mavgrades.com/">
              <button className="font-bold border border-white/60 rounded-2xl px-3 py-1">
                Website
              </button>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentProject;
