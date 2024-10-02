import Calendar from "@/components/events/Calendar";
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
      <div className="flex p-10 md:p-4 justify-between pt-16 md:mx-20">
        <Calendar month={month} year={year} />
      </div>
    </div>
  );
}
