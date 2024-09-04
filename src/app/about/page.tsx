import { AboutAcmCard } from "@/components/AboutAcmCard";
import AcmCreateCard from "@/components/AcmCreateCard";
import AcmDivisions from "@/components/AcmDivisions";
import AcmEducateCard from "@/components/AcmEducateCard";
import AcmHackCard from "@/components/AcmHackCard";
import AcmResearchCard from "@/components/AcmResearchCard";
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
    </>
  );
};

export default page;
