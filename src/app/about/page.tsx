import { AboutAcmCard } from "@/components/about/AboutAcmCard";
import AcmCreateCard from "@/components/about/AcmCreateCard";
import AcmDivisions from "@/components/about/AcmDivisions";
import AcmEducateCard from "@/components/about/AcmEducateCard";
import AcmHackCard from "@/components/about/AcmHackCard";
import AcmMarketingCard from "@/components/about/AcmMarketingCard";
import AcmResearchCard from "@/components/about/AcmResearchCard";
import React from "react";

const page = () => {
  return (
    <>
      <AboutAcmCard />
      <AcmDivisions />
      <AcmCreateCard />
      <AcmEducateCard />
      <AcmResearchCard />
      <AcmHackCard />
      <AcmMarketingCard />
    </>
  );
};

export default page;
