"use client"
import React from 'react'
import { useEffect } from 'react';
import Image from 'next/image';
import NavLink from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

function Page() {
  const roadProjects = [
    {
      projectName: "Highway Expansion",
      startDate: "2024-05-01",
      endDate: "2024-06-15",
      imaging: 70,
      location: "National Highway 2",
      image: "./img/img.jpg",
      link: "./hawkEye/project1"
    },
    {
      projectName: "Bridge Construction",
      startDate: "2024-03-10",
      endDate: "2024-08-30",
      imaging: 90,
      location: "Ganges River, Kolkata",
      image: "./img/img.jpg",
      link: "./project1"
    },
    {
      projectName: "Road Widening Project",
      startDate: "2024-07-20",
      endDate: "2024-09-10",
      imaging: 85,
      location: "Park Street, Kolkata",
      image: "./img/img.jpg",
      link: "./project1"
    },
    {
      projectName: "Zebra Crossing Installation",
      startDate: "2024-09-05",
      endDate: "2024-09-20",
      imaging: 50,
      location: "Esplanade, Kolkata",
      image: "./img/img.jpg",
      link: "./project1"
    },
    {
      projectName: "Traffic Signal Upgrade",
      startDate: "2024-06-01",
      endDate: "2024-06-25",
      imaging: 65,
      location: "Bangalore-Mysore Road",
      image: "./img/img.jpg",
      link: "./project1"
    }
  ];

  const [showInfoIndex, setShowInfoIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setShowInfoIndex(null);
    }, 3000)
  }, [showInfoIndex])


  return (
    <div className='w-full min-h-screen p-10'>
      <div className='w-full flex gap-5 justify-around flex-wrap'>
        {roadProjects.map((roadProject, index) => (
          <div key={index} className='w-1/4 h-fit shadow-black shadow-sm'>
            <div className='w-full h-full bg-white p-5 shadow-black shadow-sm'>
              <div className='relative'>
                <Image
                  className='m-auto overflow-hidden'
                  src={roadProject.image}
                  alt={roadProject.projectName}
                  width={400}
                  height={200}
                />
                {showInfoIndex === index && (
                  <div
                    onMouseLeave={() => setShowInfoIndex(null)}

                    className='text-sm font-bold absolute bottom-0 left-0 bg-slate-700 text-white block'>
                    <div>Start Date: {roadProject.startDate}</div>
                    <div>End Date: {roadProject.endDate}</div>
                    <div>Imaging: {roadProject.imaging}%</div>
                  </div>
                )}
              </div>
              <div className="flex m-auto relative">
                <h1 className='text-2xl font-bold'>{roadProject.projectName}</h1>
                <div onClick={() => setShowInfoIndex(showInfoIndex === index ? null : index)} className='cursor-pointer absolute bottom-1/4 right-0  '>
                  <FaInfoCircle />
                </div>
              </div>
              <div className="flex justify-between relative">
                <div className='text-lg font-bold'>{roadProject.location}</div>
                <div className=' absolute bottom-1/4 right-0'>
                  <NavLink href={roadProject.link}>
                    <FaEye />
                  </NavLink>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page;
