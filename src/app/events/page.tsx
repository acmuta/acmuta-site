"use client";
import React, { useState } from "react";
import Calendar from "@/components/events/Calendar"; // Adjust the import path if needed
import EventCard from "@/components/events/EventCard";
import { eventNames } from "process";
import Image from "next/image";

const EventPage = () => {
  // Get the current date to set default month and year
  const eventImage1 = "/assets/event-images/GBM-Spring-2025-1.svg";
  const eventImage2 = "/assets/event-images/GBM-Spring-2025-2.svg";
  const eventImage3 = "/assets/event-images/TOWN-HALL-2024-1.svg";
  const eventImage4 = "/assets/event-images/TOWN-HALL-2024-2.svg";

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
    {
      eventName: "Town Hall Fall 2024",
      image1: eventImage3,
      image2: eventImage4,
    }
  ];


  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="h-fit w-full bg-[url(/assets/apply/apply-bg.png)] bg-cover bg-center py-20 px-4 md:px-20 relative">
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

      <div className="absolute top-20 right lg:right-24 transform blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={200}
          height={200}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[600px] lg:top-[700px] left-0 lg:left-20 rotate-45 blur-sm transform -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={400}
          height={400}
          className="opacity-80"
        />
      </div>

      <div className="absolute top-[1200px] lg:top-[1100px] right-10 lg:right-40 transform blur-sm -translate-y-1/2 z-[-10] animate-pulse">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={250}
          height={250}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[2400px] lg:top-[2200px] right-0 lg:right-40 -rotate-30 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={450}
          height={450}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[3000px] lg:top-[2800px] left-10 lg:left-60 rotate-15 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={300}
          height={300}
          className="opacity-80"
        />
      </div>

      <div className="absolute top-[3600px] lg:top-[3400px] right-10 lg:right-80 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/ufo.svg"
          alt="UFO Element"
          width={300}
          height={300}
          className="opacity-70"
        />
      </div>

      <div className="absolute top-[4200px] lg:top-[4000px] left-0 lg:left-20 rotate-60 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={400}
          height={400}
          className="opacity-80"
        />
      </div>

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
