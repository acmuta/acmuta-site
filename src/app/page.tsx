'use client';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col justify-between">
        <div className="relative overflow-hidden">
          <div className="relative my-32 max-w-lg md:max-w-2xl mx-auto  md:ml-24">
            {/* UFO asset */}
            <div className="absolute -top-[8rem] md:-top-[10rem] left-1/2 transform -translate-x-1/2">
              <Image
                src="/assets/objects/ufo-spotlight.svg"
                alt="UFO"
                width={280}
                height={280}
              />
            </div>

            <div className="relative z-40 backdrop-blur-md bg-white/10 w-[90%] md:w-full rounded-[30px] md:rounded-[60px] px-8 py-8 md:px-20 md:py-10 text-white border-2 border-white/40 mx-auto -mt-6 md:mt-0">
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                  association for computing machinery @ ut arlington
                </h1>
              </div>

              <p className="text-lg md:text-xl leading-relaxed font-medium">
              UTA's largest computer science organization—uniting students through technology.
              Join our inclusive community to learn, collaborate,
              create, and grow, no matter your background or experience.
              </p>

              <div className="w-full flex justify-center mt-8">
                <Link href="#" target="_blank">
                  <button className="font-bold text-lg border border-white/60 rounded-2xl px-5 py-1">
                    apply
                  </button>
                </Link>
              </div>
            </div>

            {/* Rocket asset */}
            <div className="absolute top-[82%] md:top-80 w-[300px] h-[300px] md:w-[420px] md:h-[420px] left-[60%] transform -translate-x-[50%] md:-translate-x-[30%] z-50">
              <Image
                src="/assets/objects/rocket-flame.svg"
                alt="Rocket"
                layout="fill"
              />
            </div>
          </div>

          {/* crystal 2 */}
          <div className="absolute top-[10%] md:top-[-15%] w-[400px] h-[400px] md:w-[680px] md:h-[680px] left-[80%] transform -translate-x-[70%] md:-translate-x-[40%] z-10">
            <Image
              src="/assets/objects/crystal-2.png"
              alt="Crystal 2"
              layout="fill"
              className="object-contain rotate-[64deg] scale-x-[-1] blur-none md:blur-[3px]"
            />
          </div>

          {/* crystal 2 */}
          <div className="absolute top-[20%] md:top-[10%] w-[280px] h-[280px] md:w-[350px] md:h-[350px] left-[90%] transform -translate-x-[40%] md:-translate-x-[12%] z-10">
            <Image
              src="/assets/objects/crystal-2.png"
              alt="Crystal 2"
              layout="fill"
              className="object-contain rotate-[38deg] scale-x-[-1] blur-[2px] md:blur-[3px]"
            />
          </div>

          {/* crystal 1 */}
          <div className="absolute top-[35%] md:top-[30%] w-[380px] h-[380px] md:w-[650px] md:h-[650px] left-[50%] transform -translate-x-[10%] md:-translate-x-[-50%] z-10">
            <Image
              src="/assets/objects/crystal-1.png"
              alt="Crystal 1"
              layout="fill"
              className="object-contain scale-x-[-1] rotate-[1deg] blur-[2px] md:blur-sm"
            />
          </div>
        </div>

        <div className="relative overflow-hidden">
          {/* crystal 2 */}
          <div className="absolute top-[8%] md:top-[-8%] w-[480px] h-[480px] md:w-[650px] md:h-[650px] left-[10%] transform -translate-x-[20%] md:-translate-x-[50%] ">
            <Image
              src="/assets/objects/crystal-2.png"
              alt="Space Station"
              layout="fill"
              className="object-contain rotate-[64deg] scale-x-[-1] blur-none md:blur-[2px]"
            />
          </div>

          {/* crystal 1 */}
          <div className="absolute top-[28%] md:top-[25%] w-[580px] h-[580px] md:w-[650px] md:h-[650px] left-[10%] transform -translate-x-[50%] md:-translate-x-[70%] ">
            <Image
              src="/assets/objects/crystal-1.png"
              alt="Space Station"
              layout="fill"
              className="object-contain blur-[2px] md:blur-sm"
            />
          </div>

          <div className="backdrop-blur-md w-[90%] md:w-8/12 h-auto md:min-h-[40rem] bg-white/10 rounded-[30px] md:rounded-tr-[0px] md:rounded-br-[0px] border-r-2 md:border-r-[0px] border-l-2 border-t-2 border-b-2 border-white/40 mx-auto md:mx-0 md:ml-auto p-6 md:p-12 flex flex-col items-center md:items-start space-y-6 md:space-y-4 mb-16 md:mb-32">
            <h1 className="text-3xl md:text-5xl font-bold p-4 md:p-6 text-center md:text-left">
              in collaboration with
            </h1>

            {/* First row of logos */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mx-auto">
              <div className="w-40 h-32 md:w-80 md:h-52">
                <Image
                  src="/assets/partners/adobe-logo.png"
                  alt="Adobe"
                  className="w-full h-full object-contain"
                  width={200}
                  height={200}
                />
              </div>
              <div className="w-40 h-32 md:w-80 md:h-52">
                <Image
                  src="/assets/partners/blackstone-logo.png"
                  alt="Black Stone"
                  className="w-full h-full object-contain"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            {/* Second row of logos */}
            <div className="flex justify-center mx-auto -mt-4 md:-mt-8">
              <div className="w-52 h-36 md:w-96 md:h-64">
                <Image
                  src="/assets/partners/lockheed-martin-logo.png"
                  alt="Lockheed Martin"
                  className="w-full h-full object-contain"
                  width={320}
                  height={320}
                />
              </div>
            </div>
          </div>

          {/* Space Station asset */}
          <div className="absolute top-[80%] md:top-[70%] w-[280px] h-[280px] md:w-[350px] md:h-[350px] left-[80%] transform -translate-x-[50%] md:-translate-x-[10%]">
            <Image
              src="/assets/objects/space-station.svg"
              alt="Space Station"
              layout="fill"
              className="object-contain"
            />
          </div>
        </div>
      </main>
    </>
  );
}
