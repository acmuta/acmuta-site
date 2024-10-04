"use client";
import React, { useState } from "react";
import Calendar from "@/components/events/Calendar"; // Adjust the import path if needed

const EventPage = () => {
  // Get the current date to set default month and year
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const handleMonthChange = (direction: "inc" | "dec") => {
    const newDate = changeMonth(direction, { month, year });
    setMonth(newDate.month);
    setYear(newDate.year);
  };

  return (
    <div className="h-fit w-full bg-[url(/assets/apply/apply-bg.png)] bg-cover bg-center py-20">
      <div className="flex justify-between pt-16 md:mx-20">
        <Calendar month={month} year={year} onMonthChange={handleMonthChange} />
      </div>
    </div>
  );
};

function changeMonth(
  amt: "inc" | "dec",
  { month, year }: { month: number; year: number }
) {
  if (amt === "inc") {
    if (month === 11) return { month: 0, year: year + 1 };
    return { month: month + 1, year };
  }
  if (month === 0) return { month: 11, year: year - 1 };
  return { month: month - 1, year };
}

export default EventPage;
