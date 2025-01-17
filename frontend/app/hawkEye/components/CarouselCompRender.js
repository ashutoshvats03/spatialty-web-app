

"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselComp() {

  const projects = useMemo(
    () => [
      { name: "Vehicle Classification", url: "./vehicleClassification" },
      { name: "Turning", url: "./turning" },
    ],
    []
  );

  const router = useRouter();

  // Initialize state directly from localStorage or fallback to 0
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("currentIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
    }
    
  });

  // Navigate to the selected project when `currentIndex` changes
  useEffect(() => {
    if (projects.length > 0) {
      router.push(projects[currentIndex].url);
    }
  }, [currentIndex, router, projects]);

  // Save `currentIndex` to localStorage whenever it changes
  useEffect(() => {
    if(typeof window !== "undefined") {
      localStorage.setItem("currentIndex", currentIndex);
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  return (
    <div>
      <Carousel opts={{ loop: true }} className="w-full h-fit m-auto">
        <CarouselContent>
          {projects.map((project, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="p-1">
                <Card
                  className="cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                >
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">
                      {projects[currentIndex]?.name || "No project selected"}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} />
        <CarouselNext onClick={handleNext} />
      </Carousel>
    </div>
  );
}
