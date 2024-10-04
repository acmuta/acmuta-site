"use client"
import React, { useState } from "react";
import Calendar from "@/components/events/Calendar"; // Adjust the import path if needed

const EventPage = () => {
  // Get the current date to set default month and year
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  return (
    <div className="h-fit w-full bg-[url(/assets/apply/apply-bg.png)] bg-cover bg-center py-20">
      <div className="flex justify-between pt-16 md:mx-20">
        <Calendar month={month} year={year} />
      </div>
    </div>
  );
};

export default EventPage;
