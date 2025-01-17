"use client";
import * as React from "react";
import NavLink from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Transition() {
  const [focusedIndex, setFocusedIndex] = React.useState(null);
  const [isAutoplayActive, setIsAutoplayActive] = React.useState(true);

  const handleMouseEnter = (index) => {
    setFocusedIndex(index === focusedIndex ? null : index);
    setIsAutoplayActive(false); // Pause autoplay on hover
  };

  const handleMouseLeave = () => {
    setIsAutoplayActive(true); // Resume autoplay when not hovering
    setFocusedIndex(null);
  };

  return (
    <Carousel
      plugins={isAutoplayActive ? [Autoplay({ delay: 2000 })] : []}
      options={{ loop: true }}
      className="w-full m-auto"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={`m-auto md:basis-1/2 lg:basis-1/3 ${
              focusedIndex === index ? "scale-150 opacity-100" : ""
            }`}
          >
            <div className="flex justify-center items-center h-full p-4"> {/* Added flex properties */}
              <Card>
                <CardContent className="flex justify-center items-center">
                  <NavLink href="">
                    <Image
                      onMouseEnter={() => handleMouseEnter(index)} // Use a function to avoid immediate invocation
                      onMouseLeave={handleMouseLeave}
                      className={`duration-300 ease-in-out ${
                        focusedIndex === index ? "scale-150" : ""
                      }`}
                      src="/img/img.jpg"
                      alt="Logo"
                      width={250}
                      height={250}
                      style={{ maxWidth: '100%', height: 'auto' }} // Ensure the image is responsive
                    />
                  </NavLink>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
