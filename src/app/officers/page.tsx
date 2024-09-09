import Department from "@/components/officers/Department";
import Image from "next/image";
import departments from "@/data/officers-data";

export default function Officers() {
  return (
    <div className="py-10 px-5">
      <header className="text-start mb-28 m-20 ml-40">
        <h1 className="text-5xl font-bold mb-4">meet the team</h1>
        <p className="text-xl text-gray-200">
          get to know the amazing people behind our work!
        </p>
      </header>

      <div className="space-y-12 ml-20">
        {departments.map((department, index) => (
          <Department
            key={index}
            name={department.name}
            logoUrl={department.logoUrl}
            people={department.people}
          />
        ))}
      </div>
      <div className="absolute top-96 right-72 rotate-90 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-1.png"
          alt="Crystal Design Element"
          width={400}
          height={400}
          className="opacity-100"
        />
      </div>
      <div className="absolute top-60 right-24 transform blur-sm -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={300}
          height={300}
          className="opacity-100"
        />
      </div>
      <div className="absolute top-44 right-96 rotate-90 blur-sm transform -translate-y-1/2 z-[-10]">
        <Image
          src="/assets/objects/crystal-2.png"
          alt="Crystal Design Element"
          width={200}
          height={200}
          className="opacity-100"
        />
      </div>
      <div className="absolute blur-sm right-0 -translate-y-72 -rotate-12 transform z-[-10]">
        <Image
          src="/assets/objects/web.png"
          alt="Crystal Design Element"
          width={600}
          height={600}
          className="opacity-100"
        />
      </div>
    </div>
  );
}
