import ContributionsTable from "@/components/acm-create/ContributionsTable";
import RecentProject from "@/components/acm-create/RecentProject";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="z-10 backdrop-blur-md bg-white/10 text-white py-12 px-4 my-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-4">Projects Details</h2>
        </div>
        <RecentProject />
        <ContributionsTable />
      </div>
    </div>
  );
};

export default page;
