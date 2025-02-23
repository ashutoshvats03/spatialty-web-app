"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux/hooks";
import { setMapSide } from "@/app/redux/slices/mapSlice"; // Ensure correct path
import Component from "./components/Main";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useRouter} from "next/navigation"

function Map() {
    const router=useRouter();
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide); // Adjust selector if needed
    const project = useAppSelector((state) => state.project.project);


    const [message, setMessage] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const a = JSON.parse(localStorage.getItem("data")).Pavement_Distress;
            setMessage(a);
            setIsMounted(true);
        }
        else{
            router.push("/")
        }
        
    }, []);
    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }
    const array = message;

    const handleSliderChange = (e) => {
        dispatch(setMapSide(e.target.value === "0" ? "LHS" : "RHS"));
    };

    
   return (
        <div className="p-10 mx-16 bg-slate-700 border-white border-2 border-r-4 border-b-4 rounded-sm">
            <div className="text-center font-bold text-3xl">
                Road Defects/Pavement Distress
            </div>
            <div>
                LHS
                <input type="range" min="0" max="1" step="1" value={mapSide === "LHS" ? "0" : "1"} onChange={handleSliderChange} className="w-[34px] bg-red-800 rounded-lg" />
                RHS
            </div>

            {array && (
                <>
                    <div className="  bg-slate-800 ">
                        {array[project] && Object.keys(array[project][mapSide]).length > 0 ? (
                            Object.keys(array[project][mapSide]).map((index, key) => (
                                <div key={key} className="w-100vw h-fit flex ">
                                    <Component  given={array["one"][mapSide][index]} mapSide={mapSide} />
                                    
                                </div>
                            ))
                        ) : (
                            <div>No data available</div>
                        )}

                    </div>
                </>
            )}
        </div>
    );

}
export default Map;
// "use client";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { useAppSelector } from "@/app/redux/hooks";
// import { setMapSide } from "@/app/redux/slices/mapSlice"; // Ensure correct path
// import Component from "./components/Main";
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function Map() {
//     const [array, setArray] = useState(null);
//     if(localStorage.getItem("data")!==null){
//         setArray(JSON.parse(localStorage.getItem("data")).Pavement_Distress);
//     }
//     else{
//         return <div>Loading pavement distreess</div>
//     }

//     const [message, setMessage] = useState(null);    
//     const dispatch = useDispatch();
//     const mapSide = useAppSelector((state) => state.mapSide.mapSide); // Adjust selector if needed
//     const project = useAppSelector((state) => state.project.project);
//     const handleSliderChange = (e) => {
//         dispatch(setMapSide(e.target.value === "0" ? "LHS" : "RHS"));
//     };

//     return (
//         <div className="p-10 mx-16 bg-slate-700 border-white border-2 border-r-4 border-b-4 rounded-sm">
//             <div className="text-center font-bold text-3xl">
//                 Road Defects/Pavement Distress
//             </div>
//             <div>
//                 LHS
//                 <input type="range" min="0" max="1" step="1" value={mapSide === "LHS" ? "0" : "1"} onChange={handleSliderChange} className="w-[34px] bg-red-800 rounded-lg" />
//                 RHS
//             </div>

//             {array && (
//                 <>
//                     <div className=" mt-5 grid grid-cols-2 bg-slate-800 p-10 gap-16">
//                         {array[project] && Object.keys(array[project][mapSide]).length > 0 ? (
//                             Object.keys(array[project][mapSide]).map((index, key) => (
//                                 <div key={key} className="w-[450px] ">
//                                     <Component given={array["one"][mapSide][index]} mapSide={mapSide} />
//                                 </div>
//                             ))
//                         ) : (
//                             <div>No data available</div>
//                         )}

//                     </div>
//                 </>
//             )}
//         </div>
//     );

// }
// export default Map;
