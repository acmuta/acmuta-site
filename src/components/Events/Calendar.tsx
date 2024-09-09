import Link from 'next/link';
import CalendarBody from './CalendarBody';
import { byDate } from '@/app/api/events/byDate/route';

type Props = {
  month: number;
  year: number;
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function changeMonth(amt: 'inc' | 'dec', { month, year }: { month: number; year: number }) {
  if (amt == 'inc') {
    if (month == 11) return { month: 0, year: year + 1 };
    else return { month: month + 1, year };
  }
  if (month == 0) return { month: 11, year: year - 1 };
  else return { month: month - 1, year };
}

async function Calendar({ month, year }: Props) {
  const events = await byDate(month, year);
  const nextParams = changeMonth('inc', { month, year });
  const prevParams = changeMonth('dec', { month, year });

  return (
    <div className="hidden w-2/3 rounded-3xl border border-[#ffffff82] bg-gradient-to-tr from-[#ffffff1f] from-[3.07%] to-[#ffffff08] to-[96.39%] p-5 shadow-md backdrop-blur-xl lg:block">
      <div className="mb-5 flex items-center justify-between text-white">
        <Link
          className="w-10"
          href={{
            pathname: '/events',
            query: { month: prevParams.month, year: prevParams.year },
          }}
        >{`<`}</Link>
        <span className="w-32 text-center text-2xl font-semibold">{monthNames[month]}</span>
        <Link
          className="w-10"
          href={{
            pathname: '/events',
            query: { month: nextParams.month, year: nextParams.year },
          }}
        >{`>`}</Link>
      </div>
      <CalendarBody month={month} year={year} events={events} />
    </div>
  );
}

export default Calendar;
