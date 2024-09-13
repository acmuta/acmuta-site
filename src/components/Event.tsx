import Calendar from '@/components/Events/Calendar';
import PastEvents from '@/components/Events/PastEvents';
import PastWorkshops from '@/components/Events/PastWorkshops';
import UpcomingEvents from '@/components/Events/UpcomingEvents';

type Params = {
  month: string | null;
  year: string | null;
};

export default function Events({ searchParams }: { searchParams: Params }) {
  const today = new Date();
  const month = parseInt(searchParams.month || today.getMonth().toString());
  const year = parseInt(searchParams.year || today.getFullYear().toString());

  return (
    <div className="h-fit w-full bg-[url(/assets/apply/apply-bg.png)] bg-cover bg-center py-20">
      <div className="flex justify-between pt-16 md:mx-20">
        <div className="flex flex-col">
          <div className="relative">
            <h1 className="text-4xl text-white">upcoming events</h1>
            <div className="h-[1px] w-28 bg-[#cacacab0]" />
          </div>
          <UpcomingEvents />
        </div>
        <Calendar month={month} year={year} />
      </div>
      <div className="mx-40 flex flex-col justify-between pt-16">
        <div className="relative">
          <h1 className="text-4xl text-white">past events</h1>
          <div className="h-[1px] w-28 bg-[#cacacab0]" />
        </div>
        <PastEvents />
      </div>
      <div className="mx-40 flex flex-col justify-between pt-16">
        <div className="relative">
          <h1 className="text-4xl text-white">past workshops</h1>
          <div className="h-[1px] w-28 bg-[#cacacab0]" />
        </div>
        <PastWorkshops />
      </div>
    </div>
  );
}
