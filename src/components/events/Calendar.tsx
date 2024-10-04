// "use client";

// import Link from "next/link";
// import CalendarBody from "./CalendarBody";
// import { useEffect, useState } from "react";
// import type { Event } from "@/lib/types";

// type Props = {
//   month: number;
//   year: number;
// };

// const monthNames = [
//   "January", "February", "March", "April", "May", "June", 
//   "July", "August", "September", "October", "November", "December",
// ];

// function changeMonth(amt: "inc" | "dec", { month, year }: { month: number; year: number }) {
//   if (amt === "inc") {
//     if (month === 11) return { month: 0, year: year + 1 };
//     return { month: month + 1, year };
//   }
//   if (month === 0) return { month: 11, year: year - 1 };
//   return { month: month - 1, year };
// }

// const Calendar = ({ month, year }: Props) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     const fetchEvents = async (month: number, year: number) => {
//       const url = `/api/events?month=${month}&year=${year}`; // Use a relative URL
//       const res = await fetch(url, {
//         cache: "no-store", // Ensure fresh data
//       });
      
//       if (!res.ok) {
//         throw new Error("Failed to fetch events");
//       }

//       return res.json();
//     };

//     const getEvents = async () => {
//       try {
//         const events = await fetchEvents(month, year);
//         setEvents(events);
//       } catch (err) {
//         setError("Failed to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getEvents();
//   }, [month, year]);

//   const nextParams = changeMonth("inc", { month, year });
//   const prevParams = changeMonth("dec", { month, year });

//   if (loading) return <p className="text-white">Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="w-full rounded-3xl border border-[#ffffff82] bg-gradient-to-tr from-[#ffffff1f] from-[3.07%] to-[#ffffff08] to-[96.39%] p-5 shadow-md backdrop-blur-xl">
//       <div className="mb-5 flex items-center justify-between text-white flex-wrap">
//         <Link
//           className="w-10 text-lg md:text-xl"
//           href={{
//             pathname: "/events",
//             query: { month: prevParams.month, year: prevParams.year },
//           }}
//         >{`<`}</Link>
//         <span className="w-32 text-center text-xl font-semibold md:text-2xl">
//           {monthNames[month]}
//         </span>
//         <Link
//           className="w-10 text-lg md:text-xl"
//           href={{
//             pathname: "/events",
//             query: { month: nextParams.month, year: nextParams.year },
//           }}
//         >{`>`}</Link>
//       </div>
//       <CalendarBody month={month} year={year} events={events} />
//     </div>
//   );
// };

// export default Calendar;

