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
            <div
                className={` h-8 w-10 
                    ${displayContent ? "hidden" : "block"}
                    absolute 
                    `}
                onClick={() => dispatch(setdisplayContent(true))}>
                <IoHomeSharp className="w-[100%] h-[100%]"/>
            </div>
            <div className=" absolute top-10">
                {menubar.map((menu, index) => (
                    <div key={index}>
                        <div
                            onClick={() => { handleScroll(menu.ref, menu.name) }}
                            className={`px-4 py-2 mb-2 rounded ${activeProject === menu.name
                                ? "bg-blue-500 text-white"
                                : "bg-slate-500 text-white"
                                }`}
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
