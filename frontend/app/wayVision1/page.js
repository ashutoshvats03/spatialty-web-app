"use client";
import { setdisplayContent } from "@/app/redux/slices/contentSlice";
import { useEffect, useRef, useState } from "react";
import PrivateRoute from "../middleware/PrivateRoute";
import { useAppSelector } from "../redux/hooks";
import Project from "./projects/page";
import Pavement from "./pavementDistress/page";
import RoadFurniture from "./roadfurniture/page";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function Page() {
    const dispatch = useDispatch();
    const displayContent = useAppSelector((state) => state.displayContent.displayContent);

    // Track active section
    const [activeSection, setActiveSection] = useState(null);

    // Create refs for the sections you want to scroll to
    const pavementRef = useRef(null);
    const roadFurnitureRef = useRef(null);

    // Function to handle scrolling and update active section
    const scrollToSection = (ref, section) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(section);
        }
    };

    // Set up intersection observer to detect which section is in view
    useEffect(() => {
        // Only set up the observer if we're not in displayContent mode
        if (displayContent) return;

        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', // Add margin to make detection more accurate
            threshold: [0.1, 0.5], // Multiple thresholds for better detection
        };

        const observer = new IntersectionObserver((entries) => {
            // Sort entries by intersectionRatio to prioritize the most visible element
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            // If we have visible entries, use the one with highest intersection ratio
            if (visibleEntries.length > 0) {
                const mostVisibleEntry = visibleEntries[0];

                if (mostVisibleEntry.target === pavementRef.current) {
                    setActiveSection('pavement');
                } else if (mostVisibleEntry.target === roadFurnitureRef.current) {
                    setActiveSection('roadFurniture');
                }
            }
        }, options);

        // Observe sections
        if (pavementRef.current) observer.observe(pavementRef.current);
        if (roadFurnitureRef.current) observer.observe(roadFurnitureRef.current);

        return () => {
            if (pavementRef.current) observer.unobserve(pavementRef.current);
            if (roadFurnitureRef.current) observer.unobserve(roadFurnitureRef.current);
            observer.disconnect();
        };
    }, [displayContent]);

    // Add a scroll event listener for additional reliability
    useEffect(() => {
        // Only set up the scroll listener if we're not in displayContent mode
        if (displayContent) return;

        const handleScroll = () => {
            if (!pavementRef.current || !roadFurnitureRef.current) return;

            const pavementRect = pavementRef.current.getBoundingClientRect();
            const roadFurnitureRect = roadFurnitureRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is in viewport
            const isPavementVisible =
                pavementRect.top < windowHeight / 2 &&
                pavementRect.bottom > windowHeight / 2;

            const isRoadFurnitureVisible =
                roadFurnitureRect.top < windowHeight / 2 &&
                roadFurnitureRect.bottom > windowHeight / 2;

            // Update active section based on which one is more visible
            if (isPavementVisible) {
                setActiveSection('pavement');
            } else if (isRoadFurnitureVisible) {
                setActiveSection('roadFurniture');
            }
        };

        // Add scroll event listener to the window
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Call once on mount to set initial state
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [displayContent]);

    return (
        <PrivateRoute>
            <div className="flex flex-row relative w-full h-screen">
                {/* Left section */}
                <div className={` ${displayContent ? "hidden" : "block"} w-1/4 p-5 relative`}>


                    <div className="flex flex-col gap-4 mt-10">
                        {/* Project button */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => dispatch(setdisplayContent(true))}
                                className="bg-slate-500 text-white px-4 py-2 rounded-md transition duration-300">
                                Projects
                            </button>

                            {/* Apply active styling based on activeSection */}
                            <button
                                onClick={() => scrollToSection(pavementRef, 'pavement')}
                                className={`${activeSection === 'pavement'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-500 text-white'
                                    } px-4 py-2 rounded-md transition duration-300`}>
                                Pavement Distress
                            </button>

                            <button
                                onClick={() => scrollToSection(roadFurnitureRef, 'roadFurniture')}
                                className={`${activeSection === 'roadFurniture'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-500 text-white'
                                    } px-4 py-2 rounded-md transition duration-300`}>
                                Road Furniture
                            </button>
                        </div>
                        <div className="flex flex-col gap-4 bottom-36 absolute">
                            <div>
                                <a
                                    className=" h-1 bg-red-700 mx-auto py-1 px-3 text-xl rounded-md text-white"
                                    href="/AUTH.drawio (2).pdf">
                                    Download pdf
                                </a>
                            </div>
                            <div>
                                <a
                                    className="w-1/2 h-1 bg-blue-700 mx-auto py-1 px-2 text-xl rounded-md text-white"
                                    href="/RHS_Delhi-NCR_data.csv">
                                    Download CSV
                                </a>
                            </div>
                            <div>
                                <Link
                                    className="w-1/2 h-1 bg-green-700 mx-auto py-1 px-4 text-xl rounded-md text-white"
                                    href="/wayVision1/comparision">
                                    Comparision
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-2 h-full"></div>

                {/* Right section */}
                <div className="w-full overflow-y-auto h-screen" id="scrollable-content">
                    <div className="min-h-[50vh]">
                        <Project className='w-full' />
                    </div>

                    <div className={`flex flex-col ${displayContent ? "hidden" : "block"}`}>
                        {/* Add clear ID and class names to make sections more identifiable */}
                        <div
                            ref={pavementRef}
                            id="pavement-section"
                            className="min-h-screen py-10 section-container">
                            <Pavement />
                        </div>

                        <div
                            ref={roadFurnitureRef}
                            id="roadfurniture-section"
                            className="min-h-screen py-10 section-container">
                            <RoadFurniture />
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
