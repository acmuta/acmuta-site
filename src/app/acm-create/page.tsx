import ContributionsTable from "@/components/acm-create/ContributionsTable";
import RecentProject from "@/components/acm-create/RecentProject";
import React from "react";

const page = () => {
  return (
    <div>
      <h1>Recent Projects</h1>
      <RecentProject />
      {/* <ContributionsTable /> */}
    </div>
  );
};

export default page;
