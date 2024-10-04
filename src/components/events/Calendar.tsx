import { useEffect, useState } from "react";
import CalendarBody from "./CalendarBody";
import type { Event } from "@/lib/types";

type Props = {
  month: number;
  year: number;
  onMonthChange: (direction: "inc" | "dec") => void;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = ({ month, year, onMonthChange }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async (month: number, year: number) => {
      const url = `/api/events?month=${month}&year=${year}`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      return res.json();
    };

    const getEvents = async () => {
      try {
        const events = await fetchEvents(month, year);
        setEvents(events);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [month, year]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full rounded-3xl border border-[#ffffff82] bg-gradient-to-tr from-[#ffffff1f] from-[3.07%] to-[#ffffff08] to-[96.39%] p-5 shadow-md backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between text-white flex-wrap">
        <button
          className="w-10 text-lg md:text-xl"
          onClick={() => onMonthChange("dec")}
        >
          {`<`}
        </button>
        <span className="w-32 text-center text-xl font-semibold md:text-2xl">
          {monthNames[month]}
        </span>
        <button
          className="w-10 text-lg md:text-xl"
          onClick={() => onMonthChange("inc")}
        >
          {`>`}
        </button>
      </div>
      <CalendarBody month={month} year={year} events={events} />
    </div>
  );
};

export default Calendar;
