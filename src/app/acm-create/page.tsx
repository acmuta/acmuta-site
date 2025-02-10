import ContributionsTable from "@/components/acm-create/ContributionsTable";
import RecentProject from "@/components/acm-create/RecentProject";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="z-10 text-white py-2 my-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-4">projects details</h2>
        </div>
        <RecentProject />
        <ContributionsTable />
      </div>
    </div>
  );
};

export default page;
