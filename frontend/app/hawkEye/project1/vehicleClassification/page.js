import React from 'react';
import Image from 'next/image';
import Chart from './components/Chart';
import Main from './components/Main';
import { Transition } from './components/transition';

function Page() {
  const cameraData = [
    {
      cameraName: "Toll Plaza Camera",
      idleDuration: ">15 minutes",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      location: "Airport Toll Plaza Delhi",
      frequency: "Daily",
      time: "07:00 am - 08:00 pm",
    },
  ];

  // Validate data
  

  return (
    <div className="w-full p-10">
      {/* Image Section */}
      <div className="w-full flex my-10">
        <div className="w-[50vw] bg-zinc-950 h-[31vh] overflow-hidden rounded-sm">
          <Image 
            alt="img" 
            src="/img/img.jpg" 
            width={1000} 
            height={50} 
            
          />
        </div>

        {/* Camera Data Section */}
        <div className="w-[40vw]">
          {cameraData.length > 0 && cameraData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between ml-16 p-6 flex-wrap gap-5 w-full font-bold shadow-sm shadow-black"
            >
              <div className="w-1/3">Camera: {item?.cameraName || "N/A"}</div>
              <div className="w-1/3">Duration: {item?.idleDuration || "N/A"}</div>
              <div className="w-1/3">Start-Date: {item?.startDate || "N/A"}</div>
              <div className="w-1/3">End-Date: {item?.endDate || "N/A"}</div>
              <div className="w-1/3">Location: {item?.location || "N/A"}</div>
              <div className="w-1/3">Frequency: {item?.frequency || "N/A"}</div>
              <div className="w-1/3">Time: {item?.time || "N/A"}</div>
            </div>
          ))}
        </div>
      </div>

   
       <div className="flex justify-around gap-5 my-10 shadow-sm shadow-black p-5">
        <div className="w-1/3 h-[30vh]">
          <Chart />
        </div>
        <div className="w-1/3 h-[30vh]">
          <Chart />
        </div>
        <div className="w-1/3 h-[30vh]">
          <Chart />
        </div>
      </div>

    
      <div className="w-full h-[30vh] shadow-sm shadow-black p-5 my-10">
        <Main />
      </div>

      <div className="w-full h-[40vh] shadow-sm shadow-black p-5 my-10">
        <Transition />
      </div>
    </div>
  );
}

export default Page;  
