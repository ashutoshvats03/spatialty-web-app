"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux/hooks";
// import { setMapSide } from "@/app/redux/slices/mapSlice"; // Ensure correct path
import Component from "./components/Main";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"

function Map() {
    const router = useRouter();
    const dispatch = useDispatch();
    // const mapSide = useAppSelector((state) => state.mapSide.mapSide); // Adjust selector if needed
    const project = useAppSelector((state) => state.project.project);

    const [mapSide, setmapSide] = useState("LHS")
    const [message, setMessage] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [LHS_chainage, setLHSChainage] = useState([]);
    const [RHS_chainage, setRHSChainage] = useState([]);
    const [Upperlimit_RHS, setUpperlimit_RHS] = useState(RHS_chainage[99]);
    const [Lowerlimit_RHS, setLowerlimit_RHS] = useState(RHS_chainage[0]);
    const [Upperlimit_LHS, setUpperlimit_LHS] = useState(LHS_chainage[99]);
    const [Lowerlimit_LHS, setLowerlimit_LHS] = useState(LHS_chainage[0]);


    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const data = JSON.parse(localStorage.getItem("data"));
            setMessage(data.Pavement_Distress);
            setLHSChainage(data.LHS_chainage || []);
            setRHSChainage(data.RHS_chainage || []);
            setIsMounted(true);
        }
        else {
            router.push("/")
        }

    }, []);

    useEffect(() => {
        if (LHS_chainage.length > 0) {
            setLowerlimit_LHS(LHS_chainage[0]);
            setUpperlimit_LHS(LHS_chainage[LHS_chainage.length - 1]);
        }
    }, [LHS_chainage]);

    useEffect(() => {
        if (RHS_chainage.length > 0) {
            setLowerlimit_RHS(RHS_chainage[0]);
            setUpperlimit_RHS(RHS_chainage[RHS_chainage.length - 1]);
        }
    }, [RHS_chainage]);  // Runs when RHS_chainage updates


    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }


    const handleSliderChange = (e) => {
        if (e.target.checked) {
            // dispatch(setMapSide(e.target.value));
            setmapSide(e.target.value);
        }
        else {
            // dispatch(setMapSide("LHS"));
            setmapSide("LHS");
        }
    };
    const handleLowerlimitLHS = (e) => {
        setLowerlimit_LHS(e.target.value);
    }
    const handleUpperLimitLHS = (e) => {
        setUpperlimit_LHS(e.target.value);
    }
    const handleLowerLimitRHS = (e) => {
        setLowerlimit_RHS(e.target.value);
    }
    const handleUpperLimitRHS = (e) => {
        setUpperlimit_RHS(e.target.value);
    }

    return (
        <div className="p-10 mx-16 bg-slate-300  border-black  border-4 border-r-4 border-b-4 rounded-sm">
            <div className="text-center font-bold text-3xl">
                Pavement Distress
            </div>
            <div className="text-2xl font-bold flex gap-2">
                <input type="checkbox" name="mapSide" value="LHS" checked={mapSide === "LHS"} onChange={handleSliderChange} className="" />
                LHS
                <input type="checkbox" name="mapSide" value="RHS" checked={mapSide === "RHS"} onChange={handleSliderChange} className="" />
                RHS
            </div>
            <div className="flex gap-2">
                <select
                    className="rounded-lg px-3 py-1"
                    onChange={mapSide === "LHS" ? handleLowerlimitLHS : handleLowerLimitRHS}
                >
                    {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                        <option key={index}>{item}</option>
                    )) : RHS_chainage.map((item, index) => (
                        <option key={index}>{item}</option>
                    ))}
                </select>
                <select
                    className="rounded-lg px-3 py-1"
                    onChange={mapSide === "LHS" ? handleUpperLimitLHS : handleUpperLimitRHS}
                >
                    {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                        <option key={index}>{item}</option>
                    )).reverse() : RHS_chainage.map((item, index) => (
                        <option key={index}>{item}</option>
                    )).reverse()}
                </select>
            </div>

            {message && (
                <>
                    <div className="   ">
                        {message[project] && Object.keys(message[project][mapSide]).length > 0 ? (
                            Object.keys(message[project][mapSide]).map((index, key) => (
                                <div key={key} className="w-100vw h-fit flex ">
                                    <Component
                                        given={message["one"][mapSide][index]}
                                        mapSide={mapSide}
                                        Lowerlimit_LHS={Lowerlimit_LHS}
                                        Upperlimit_LHS={Upperlimit_LHS}
                                        Lowerlimit_RHS={Lowerlimit_RHS}
                                        Upperlimit_RHS={Upperlimit_RHS}
                                    />

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

