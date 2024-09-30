'use client';
import { AboutAcmCard } from "@/components/about/AboutAcmCard";
import AcmCreateCard from "@/components/about/AcmCreateCard";
import AcmDivisions from "@/components/about/AcmDivisions";
import AcmEducateCard from "@/components/about/AcmEducateCard";
import AcmHackCard from "@/components/about/AcmHackCard";
import AcmMarketingCard from "@/components/about/AcmMarketingCard";
import AcmOutreachCard from "@/components/about/AcmOutreachCard";
import AcmResearchCard from "@/components/about/AcmResearchCard";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative">
        <AboutAcmCard />
        {/* Rocket at the bottom left of ACM description card */}
        <div className="absolute bottom-0 right-0 transform -translate-x-[20%] translate-y-1/3 -rotate-30 z-10">
          <Image
            src="/assets/objects/rocket-flame.svg"
            alt="Rocket Element"
            width={400}
            height={400}
            className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px]"
          />
        </div>
      </div>
      <AcmDivisions />
      <AcmCreateCard />
      <AcmEducateCard />
      <AcmResearchCard />
      <AcmHackCard />
      <AcmMarketingCard />
      <AcmOutreachCard />

      {/* Top right crystal */}
      <div className="absolute top-20 right lg:right-24 transform blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={200}
          height={200}
          className="opacity-70"
        />
      </div>

      {/* Large crystal after AboutAcmCard */}
      <div className="absolute top-[600px] lg:top-[700px] left-0 lg:left-20 rotate-45 blur-sm transform -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={400}
          height={400}
          className="opacity-80"
        />
      </div>

      {/* Small crystal near AcmDivisions */}
      <div className="absolute top-[1200px] lg:top-[1100px] right-10 lg:right-40 transform blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={250}
          height={250}
          className="opacity-70"
        />
      </div>

      {/* Large Crystal near AcmEducateCard */}
      <div className="absolute top-[2400px] lg:top-[2200px] right-0 lg:right-40 -rotate-30 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={450}
          height={450}
          className="opacity-70"
        />
      </div>

      {/* Small Crystal near AcmResearchCard */}
      <div className="absolute top-[3000px] lg:top-[2800px] left-10 lg:left-60 rotate-15 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={300}
          height={300}
          className="opacity-80"
        />
      </div>

      {/* UFO near AcmHackCard */}
      <div className="absolute top-[3600px] lg:top-[3400px] right-10 lg:right-80 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/ufo.svg"
          alt="UFO Element"
          width={300}
          height={300}
          className="opacity-70"
        />
      </div>

      {/* Large Crystal near AcmMarketingCard */}
      <div className="absolute top-[4200px] lg:top-[4000px] left-0 lg:left-20 rotate-60 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={400}
          height={400}
          className="opacity-80"
        />
      </div>

      {/* Web near AcmOutreachCard */}
      <div className="absolute bottom -right-20 transform -translate-y-1/2 -rotate-12 z-[-10] max-h-screen overflow-hidden">
        <Image
          src="/assets/objects/web.png"
          alt="Web Element"
          width={600}
          height={600}
          className="opacity-70 object-contain"
        />
      </div>

      <div className="absolute top-[1600px] left-10 lg:left-40 transform rotate-15 blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={180}
          height={180}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[2200px] right-20 lg:right-60 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/ufo.svg"
          alt="UFO Element"
          width={200}
          height={200}
          className="opacity-60"
        />
      </div>

      <div className="absolute top-[2800px] left-20 lg:left-80 transform rotate-45 blur-sm -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/rocket-flame.svg"
          alt="Rocket Element"
          width={180}
          height={180}
          className="opacity-75"
        />
      </div>

      <div className="absolute top-[3400px] right-30 lg:right-100 transform -rotate-30 blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={300}
          height={300}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[4000px] left-40 lg:left-120 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/ufo.svg"
          alt="UFO Element"
          width={250}
          height={250}
          className="opacity-65"
        />
      </div>

      <div className="absolute top-[4600px] right-10 lg:right-50 transform rotate-60 blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={220}
          height={220}
          className="opacity-75"
        />
      </div>
    </div>
  );
};

export default page;