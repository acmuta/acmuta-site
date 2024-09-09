import Link from 'next/link';
import { IconMap } from './WorkshopIcons';
import type { PastWorkshop } from '../../../lib/types';

const workshops: PastWorkshop[] = [
  {
    title: 'Personal Website Workshop',
    description:
      'Learn how to make your very own personal website! Make a customizable portfolio website that showcases all your projects - and if you already have a personal website, learn how to integrate dark mode!',
    links: [
      { type: 'github', link: 'https://github.com/acmutd/htf-education' },
      { type: 'video', link: 'https://www.youtube.com/watch?v=X-XVUYu5unY' },
    ],
  },
  {
    title: 'Game Engine Development Workshop Series',
    description:
      'No matter your experience level, join the game engine development workshop series where we will be designing and writing our own game engine from scratch!',
    links: [
      {
        type: 'video',
        link: 'https://www.youtube.com/watch?v=88jguNWiD8k&list=PL5MSuy7M7Cr7-OoR00y9cLt3V4lDUrlgf&pp=iAQB',
      },
    ],
  },
  {
    title: 'CS Essentials Workshop Series',
    description: `Do you want to learn necessary programming skills which are
not taught in class? Get a head start in your programming career by taking part in ACM's CS Essentials Bootcamp!`,
    links: [
      {
        link: 'https://www.youtube.com/watch?v=rP9d2OvxXR0&list=PL5MSuy7M7Cr7QGSuZa4f3H6VeIc9-DQ_O&pp=iAQB',
        type: 'video',
      },
    ],
  },
];

export default function PastWorkshops() {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {workshops.map((workshop) => (
        <div
          className="mx-8 my-14 flex h-[22rem] w-[20rem] flex-col items-center justify-center rounded-3xl border border-[#ffffff82] bg-gradient-to-br from-[#ffffff1f] from-[3.07%] to-[#ffffff08] to-[96.39%] backdrop-blur-xl"
          key={workshop.title}
        >
          <h2 className="w-60 self-start pb-7 pl-9 pt-4 font-semibold text-[#CACACA]">
            {workshop.title}
          </h2>
          <p className="px-5 py-4 text-sm text-[#CACACA]">{workshop.description}</p>
          <div className="flex">
            {workshop.links.map((link) => (
              <Link href={link.link} key={link.type}>
                {IconMap[link.type]}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
