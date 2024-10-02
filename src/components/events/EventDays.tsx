"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/lib/types.d.ts";

type Props = {
  event: Event;
  day: number;
  month: number;
};

const EventComponent = ({ event, day, month }: Props) => {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (event.start) {
      const localDate = new Date(event.start);
      setLocalStartDate(localDate);
    }
  }, [event]);

  if (
    !localStartDate ||
    localStartDate.getDate() !== day ||
    localStartDate.getMonth() !== month
  ) {
    return null;
  }

  return (
    <div className="mt-2 truncate rounded bg-gradient-to-r from-red-700 to-red-900 p-1 text-xs font-medium text-white">
      {event.title}
    </div>
  );
};

export default EventComponent;
