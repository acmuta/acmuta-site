"use client";
import React, { useState } from "react";
import Calendar from "@/components/events/Calendar"; // Adjust the import path if needed
import EventCard from "@/components/events/EventCard";


const EventPage = () => {
  // Get the current date to set default month and year
  const eventImage1 = "/assets/event-images/GBM-Spring-2025-1.svg";
  const eventImage2 = "/assets/event-images/GBM-Spring-2025-2.svg";
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const handleMonthChange = (direction: "inc" | "dec") => {
    const newDate = changeMonth(direction, { month, year });
    setMonth(newDate.month);
    setYear(newDate.year);
  };

  const events = [
    {
      eventName: "GBM Spring 2025",
      image1: eventImage1,
      image2: eventImage2,
    },
  ];


  return (
    <div className="h-fit w-full bg-[url(/assets/apply/apply-bg.png)] bg-cover bg-center py-20 px-4 md:px-20">

      <div className="flex justify-between pt-16">
        <Calendar month={month} year={year} onMonthChange={handleMonthChange} />
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Previous Events</h2>

        <div
          className={`${
            events.length === 1 ? "flex justify-center" : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }`}
        >
          {events.map((event, index) => (
            <EventCard
              key={index}
              eventName={event.eventName}
              image1={event.image1}
              image2={event.image2}
              isSingle={events.length === 1}
            />
          ))}
        </div>
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
