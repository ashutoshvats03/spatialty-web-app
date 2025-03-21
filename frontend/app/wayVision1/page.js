"use client";
import axios from "axios";
import { useEffect, useRef, useState, useContext } from "react";
import { useAppSelector } from "../redux/hooks";
import Menubar from "./components/menubar";
import Pavement from "./pavementDistress/page";
import Project from "./projects/page";
import sinages from "./roadfurniture/components/sinage";
import RoadFurniture from "./roadfurniture/page";
import StreetLight from "./roadfurniture/components/StreetLight";
import PrivateRoute from "../middleware/PrivateRoute";
import { setdisplayContent } from "@/app/redux/slices/contentSlice";
import { current } from "@reduxjs/toolkit";
// import AuthContext from "/spatialty/speciality2/app/context/AuthContext";

function Page() {

    const [array1, setArray1] = useState(null);
    const [array2, setArray2] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    // const {loading} = useContext(AuthContext);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // State to track errors
    const [activeProject, setActiveProject] = useState("Projects"); // Active menu item
    const [activeSubMenu, setActiveSubMenu] = useState(null); // Track active submenu
    const projectRef = useRef(null);
    const pavementRef = useRef(null);
    const sinagesRef = useRef(null);
    const roadfurnitureRef = useRef(null);
    const streetlightRef = useRef(null);


    const displayContent = useAppSelector((state) => state.displayContent.displayContent);

    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const a1 = JSON.parse(localStorage.getItem("data")).Road_Furniture;
            const a2 = JSON.parse(localStorage.getItem("data")).Street_Light;
            setArray1(a1);
            setArray2(a2);
            setIsMounted(true);
        }
        else {
            router.push("/")
        }

    }, []);

    // Main menu items
    const menubar = [
        {
            name: "Pavement Distress",
            ref: pavementRef,
            element: Pavement,
            id: "pavement-distress",
            hasSubMenu: false,
            subMenu:[]
        },
        {
            name: "Road Furniture",
            ref: roadfurnitureRef,
            element: RoadFurniture,
            id: "road-furniture",
            hasSubMenu: true,
            subMenu: [
                { name: "Street Light", ref: streetlightRef, element: StreetLight, id: "street-light" },
                { name: "Sinages", ref: sinagesRef, element: sinages, id: "sinages" },
            ]
        },
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
                    // Check main menu items
                    const activeSection = menubar.find(
                        (menu) => menu.ref.current === entry.target
                    );

                    if (activeSection) {
                        setActiveProject(activeSection.name);
                        setActiveSubMenu(null);
                        return;
                    }

                    // Check submenu items
                    for (const menu of menubar) {
                        if (menu.hasSubMenu) {
                            const activeSubSection = menu.subMenu.find(
                                (submenu) => submenu.ref.current === entry.target
                            );

                            if (activeSubSection) {
                                setActiveProject(menu.name); // Set parent as active
                                setActiveSubMenu(activeSubSection.name); // Set submenu as active
                                return;
                            }
                        }
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe main menu items
        menubar.forEach((menu) => {
            if (menu.ref.current) {
                observer.observe(menu.ref.current);
            }

            // Observe submenu items
            if (menu.hasSubMenu) {
                menu.subMenu.forEach((submenu) => {
                    if (submenu.ref.current) {
                        observer.observe(submenu.ref.current);
                    }
                });
            }
        });

        return () => {
            menubar.forEach((menu) => {
                if (menu.ref.current) {
                    observer.unobserve(menu.ref.current);
                }

                if (menu.hasSubMenu) {
                    menu.subMenu.forEach((submenu) => {
                        if (submenu.ref.current) {
                            observer.unobserve(submenu.ref.current);
                        }
                    });
                }
            });
        };
    }, [menubar]);

    if (!isMounted) {
        return <div>Loading vegetation</div>;
    }

    const handleScroll = (ref, menuName, subMenuName = null) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "instant" });
        }
        setActiveProject(menuName);
        setActiveSubMenu(subMenuName);
    };

    return (
        <PrivateRoute>
            <div>
                <div className="transition-opacity duration-500 flex">
                    {/* Left Navigation */}
                    <div className={`relative mt-10 ml-6 mr-20 max-h-[85vh] w-[10vw] ${displayContent ? "hidden" : "block"}`} >
                        <div >
                            <div className=" relative h-full w-full">
                                <div className="cursor-pointer px-4 py-2 mb-2 rounded bg-black text-white border-2 border-black" onClick={() => dispatch(setdisplayContent(true))}>
                                    Projects
                                </div>
                                <div className=" absolute top-16">
                                    {menubar.map((menu, index) => (
                                        <div key={index}>
                                            <div
                                                onClick={() => { handleScroll(menu.ref, menu.name) }}
                                                className={`px-4 py-2 mb-2 rounded ${activeProject === menu.name
                                                    ? "bg-red-600 border-2 border-black"
                                                    : "bg-slate-300 border-2 border-black"
                                                    }
                                                    cursor-pointer`}
                                            >
                                                <div>
                                                    {menu.name}
                                                </div>
                                            </div>
                                            {/* Render submenu items if this menu has them */}
                                            {menu.hasSubMenu && menu.subMenu.map((submenu, subIndex) => (
                                                <div
                                                    key={`${index}-${subIndex}`}
                                                    onClick={() => { handleScroll(submenu.ref, menu.name, submenu.name) }}
                                                    className={`ml-5 my-2 ${activeSubMenu === submenu.name
                                                        ? "text-red-600 font-bold"
                                                        : ""} cursor-pointer`}
                                                >
                                                    <div>
                                                        - {submenu.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className=" absolute bottom-0">
                            <a
                                href="/RHS_Delhi-NCR_data.csv"  // Replace with your actual CSV file link
                                download="RHS_Delhi-NCR_data.csv"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-2 hover:bg-blue-700 text-center block"
                            >
                                Download CSV
                            </a>
                            <a
                                href="/AUTH.drawio (2).pdf"  // Replace with your actual PDF file link
                                download="data.pdf"
                                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 text-center block"
                            >
                                Download PDF
                            </a>
                        </div>
                    </div>
                    <div className="border border-black"></div>
                    {/* Right Content */}
                    <div className={`${displayContent ? "w-full" : "w-[80vw]"} max-h-[85vh] overflow-auto`}>
                        <div ref={projectRef} id="projects">
                            <Project />
                        </div>
                        <div className={`${displayContent ? "hidden" : "block"}`}>
                            {/* Render main menu sections */}
                            {menubar.map((menu, index) => (
                                <div key={index} className="mt-10">
                                    <div
                                        ref={menu.ref}
                                        id={menu.id}
                                        className="section w-full">
                                        <menu.element />
                                    </div>
                                </div>
                            ))}
                            {/* Render submenu sections */}
                            {menubar.filter(menu => menu.hasSubMenu).flatMap(menu =>
                                menu.subMenu.map((submenu, subIndex) => (
                                    <div key={`sub-${subIndex}`} className="mt-10">
                                        <div
                                            ref={submenu.ref}
                                            id={submenu.id}
                                            className="section w-full">
                                            {submenu.element === StreetLight ? (
                                                <submenu.element array={array2} />
                                            ) : submenu.element === sinages ? (
                                                <submenu.element array={array1} />
                                            ) : (
                                                <submenu.element />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}

export default Page;