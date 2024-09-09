import Image from 'next/image';

type PastEvent = {
  name: string;
  image: string;
};

const events: PastEvent[] = [
  { name: 'ACM General Meering', image: '/assets/events/GeneralMeeting.png' },
  { name: 'Projects/Research Social', image: '/assets/events/ProjSocial.jpeg' },
  { name: 'Women’s History Month: STEM Panel', image: '/assets/events/WHM.jpeg' },
];
export default function PastEvents() {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {events.map((event) => (
        <div
          className="m-8 flex h-[22rem] w-[20rem] flex-col items-center justify-center rounded-3xl border border-[#ffffff82] bg-gradient-to-br from-[#ffffff1f] from-[3.07%] to-[#ffffff08] to-[96.39%] backdrop-blur-xl"
          key={event.name}
        >
          <p className="w-52 self-start pb-7 pl-9 pt-9 font-semibold text-[#CACACA]">
            {event.name}
          </p>
          <Image
            src={event.image}
            alt={event.name}
            width={255}
            height={200}
            className="object-cover px-9 pb-14"
          />
        </div>
      ))}
    </div>
  );
}
