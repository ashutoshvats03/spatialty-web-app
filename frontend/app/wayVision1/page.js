"use client";
import axios from "axios";
import { useEffect, useRef, useState, useContext } from "react";
import { useAppSelector } from "../redux/hooks";
import Menubar from "./components/menubar";
import Pavement from "./pavementDistress/page";
import Project from "./projects/page";
import Vegetation from "./vegetation/page";
import PrivateRoute from "../middleware/PrivateRoute";
// import AuthContext from "/spatialty/speciality2/app/context/AuthContext";

function Page() {


    // const {loading} = useContext(AuthContext);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // State to track errors
    const [activeProject, setActiveProject] = useState("Projects"); // Active menu item
    const projectRef = useRef(null);
    const pavementRef = useRef(null);
    const vegetationRef = useRef(null);



    const menubar = [
        { name: "Pavement Distress", ref: pavementRef, element: Pavement, id: "pavement-distress" },
        { name: "Vegetation", ref: vegetationRef, element: Vegetation, id: "vegetation" },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.3,  // 30% visibility triggers observer
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const activeSection = menubar.find(
                        (menu) => menu.ref.current === entry.target
                    );
                    if (activeSection) {
                        setActiveProject(activeSection.name);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        menubar.forEach((menu) => {
            if (menu.ref.current) {
                observer.observe(menu.ref.current);
            }
        });

        return () => {
            menubar.forEach((menu) => {
                if (menu.ref.current) {
                    observer.unobserve(menu.ref.current);
                }
            });
        };
    }, [menubar]);

    const handleScroll = (ref, menuName) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
        setActiveProject(menuName);
    };

    const displayContent = useAppSelector((state) => state.displayContent.displayContent);

    // if(loading){
    //     return (
    //         <div className="transition-opacity duration-500 flex items-center justify-center h-screen bg-black">
    //             <div className="animate-spin text-3xl font-extrabold">
    //                 Loading...
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <PrivateRoute>
            <div>
                {/* {loading ? (
                <div className="transition-opacity duration-500 flex items-center justify-center h-screen bg-black">
                    <div className="animate-spin text-3xl font-extrabold">
                        Loading...
                    </div>
                </div>
            ) : error ? (
                <div className="text-3xl font-extrabold text-center my-20">
                    {error}
                </div>
            ) : ( */}
                <div className="transition-opacity duration-500 flex">
                    {/* Left Navigation */}
                    <div className={`mt-10 ml-6 mr-20 max-h-[85vh] w-[10vw] ${displayContent ? "hidden" : "block"}`}>
                        <Menubar
                            menubar={menubar}
                            activeProject={activeProject}
                            handleScroll={handleScroll}
                        />
                    </div>
                    <div className="border border-white"></div>
                    {/* Right Content */}
                    <div className={`${displayContent ? "w-full" : "w-[80vw]"} max-h-[85vh] overflow-auto`}>
                        <div ref={projectRef} id="projects">
                            <Project />
                        </div>
                        <div className={`${displayContent ? "hidden" : "block"}`}>
                            {menubar.map((menu, index) => (
                                <div key={index} className="mt-10">
                                    <div ref={menu.ref} id={menu.id} className="section w-full">
                                        <menu.element />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>
        </PrivateRoute>
    );
}

export default Page;
