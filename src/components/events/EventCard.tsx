import React from "react";

interface EventCardProps {
  eventName: string;
  image1: string;
  image2: string;
  isSingle?: boolean; 
}

const EventCard: React.FC<EventCardProps> = ({ eventName, image1, image2, isSingle }) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-6 text-center border border-white-40 flex flex-col items-center 
      ${isSingle ? "w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto" : "w-full"}`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">{eventName}</h2>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
        <img src={image1} alt={`${eventName} - Image 1`} className="w-full sm:w-1/2 h-60 object-cover rounded-lg" />
        <img src={image2} alt={`${eventName} - Image 2`} className="w-full sm:w-1/2 h-60 object-cover rounded-lg" />
      </div>
    </div>
  );
};

export default EventCard;
