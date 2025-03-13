import React from "react";
import { useDispatch } from "react-redux";
import { setdisplayContent } from "@/app/redux/slices/contentSlice";
import { useAppSelector } from "@/app/redux/hooks";
import { IoHomeSharp } from "react-icons/io5";
function Menubar({ menubar, activeProject, handleScroll }) {
    const dispatch = useDispatch();
    const displayContent = useAppSelector((state) => state.displayContent.displayContent);
    return (
        
        <div className=" relative h-full w-full">
            {/* <div
                className={` h-8 w-10 
                    ${displayContent ? "hidden" : "block"}
                    absolute 
                    `}
                onClick={() => dispatch(setdisplayContent(true))}>
                <IoHomeSharp className="w-[100%] h-[100%]"/>
            </div> */}
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
                            <div >
                                {menu.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menubar;
