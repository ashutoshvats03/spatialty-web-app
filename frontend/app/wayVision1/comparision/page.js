"use client"
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux/hooks";
import Component from "./components/Main";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import Street_Light from "./components/StreetLight";
import SignageC from "./components/signage";
import PlantationC from "./components/plantation";


function page() {
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
    const [Lowerlimit_RF_LHS, setLowerlimit_RF_LHS] = useState();
    const [Upperlimit_RF_LHS, setUpperlimit_RF_LHS] = useState();
    const [Lowerlimit_RF_RHS, setLowerlimit_RF_RHS] = useState();
    const [Upperlimit_RF_RHS, setUpperlimit_RF_RHS] = useState();
    const [survey, setsurvey] = useState([])
    const [selectedSurvey, setSelectedSurvey] = useState("survey1");
    const [StreetLight, setStreetLight] = useState([]);
    const [Signage, setSignage] = useState([]);
    const [RF_chainage, setRF_chainage] = useState(null);
    const [RF, setRF] = useState("Street_Light");

    const [selectedOption, setSelectedOption] = useState(null);
    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const data = JSON.parse(localStorage.getItem("data"));
            if (data) {
                setMessage(data.Pavement_Distress);
                setsurvey(data.Survey);
                setStreetLight(data.Street_Light);
                setSignage(data.Road_Furniture);
                setRF_chainage(data.RF_chainage || []);
                setLHSChainage(data.LHS_chainage || []);
                setRHSChainage(data.RHS_chainage || []);
                setSelectedOption(Object.keys(data.Pavement_Distress["one"][mapSide])[0]);
            }




            setIsMounted(true);
        }
        else {
            router.push("/")
        }

    }, []);

    useEffect(() => {
        if (LHS_chainage.length > 0) {
            setLowerlimit_LHS(LHS_chainage[0]);
            setUpperlimit_LHS(LHS_chainage[Math.floor(LHS_chainage.length / 8)]);
            setLowerlimit_RF_LHS(RF_chainage[0]);
            setUpperlimit_RF_LHS(RF_chainage[Math.floor(RF_chainage.length / 6)]);
        }
    }, [LHS_chainage]);

    useEffect(() => {
        if (RHS_chainage.length > 0) {
            setLowerlimit_RHS(RHS_chainage[0]);
            setUpperlimit_RHS(RHS_chainage[Math.floor(RHS_chainage.length / 8)]);
            setLowerlimit_RF_RHS(RF_chainage[0]);
            setUpperlimit_RF_RHS(RF_chainage[Math.floor(RF_chainage.length / 6)]);
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

    const handleLowerlimitRFLHS = (e) => {
        setLowerlimit_RF_LHS(e.target.value);
    }
    const handleUpperLimitRFLHS = (e) => {
        setUpperlimit_RF_LHS(e.target.value);
    }
    const handleLowerLimitRFRHS = (e) => {
        setLowerlimit_RF_RHS(e.target.value);
    }
    const handleUpperLimitRFRHS = (e) => {
        setUpperlimit_RF_RHS(e.target.value);
    }
    const handlechange = (e) => {
        // console.log(e.target.value)
        setSelectedSurvey(e.target.value);
    }


    const handleOptionChange = (event) => setSelectedOption(event.target.value);

    const selectedData = message["one"][mapSide][selectedOption];
    return (
        <div>
            <div className="p-10 mx-16 mt-14 bg-slate-800 text-white border-4 rounded-sm">
                <div className="text-center font-bold text-3xl">
                    Pavement Distress
                </div>
                <div className="text-2xl font-bold my-3 ml-2 flex gap-2">
                    <input type="checkbox" name="mapSide" value="LHS" checked={mapSide === "LHS"} onChange={handleSliderChange} className="" />
                    LHS
                    <input type="checkbox" name="mapSide" value="RHS" checked={mapSide === "RHS"} onChange={handleSliderChange} className="" />
                    RHS
                </div>
                <div className="chainage_filter flex gap-2">
                    <select
                        className="rounded-lg px-3 py-1 bg-black text-white border"
                        onChange={mapSide === "LHS" ? handleLowerlimitLHS : handleLowerLimitRHS}
                    >
                        {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )) : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg px-3 py-1 bg-black text-white border"
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
                        <div className="flex justify-between w-full">
                            <div className="optionSelection bg-slate-800  text-white py-4">
                                <select
                                    onChange={handleOptionChange}
                                    value={selectedOption}
                                    className="p-2 bg-slate-500 border border-black text-black font-bold rounded-md"
                                >
                                    {Object.keys(message["one"][mapSide]).map((key) => (
                                        <option key={key} value={key}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="selection mr-10  py-4">
                                <select
                                    onChange={handlechange}
                                    className=' bg-slate-900  text-white border border-gray-300 rounded-md px-3 py-2'
                                >
                                    <option value="survey1">
                                        Survery1
                                    </option>
                                    <option value="survey2">
                                        Survery2
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="   ">
                            {message[project] && Object.keys(message[project][mapSide]).length > 0 ? (
                                <div className="flex gap-2" >
                                    <div className="flex-1">
                                        <Component
                                            given={message["one"][mapSide]}
                                            mapSide={mapSide}
                                            Lowerlimit_LHS={Lowerlimit_LHS}
                                            Upperlimit_LHS={Upperlimit_LHS}
                                            Lowerlimit_RHS={Lowerlimit_RHS}
                                            Upperlimit_RHS={Upperlimit_RHS}
                                            selectedOption={selectedOption}
                                        />
                                    </div>
                                    <div className="flex-1 ">
                                        <Component
                                            given={survey[selectedSurvey]["Pavement_Distress"]["one"][mapSide]}
                                            mapSide={mapSide}
                                            Lowerlimit_LHS={Lowerlimit_LHS}
                                            Upperlimit_LHS={Upperlimit_LHS}
                                            Lowerlimit_RHS={Lowerlimit_RHS}
                                            Upperlimit_RHS={Upperlimit_RHS}
                                            selectedOption={selectedOption}
                                        />
                                    </div>
                                </div>

                            ) : (
                                <div>No data available</div>
                            )}

                        </div>
                    </>
                )}
            </div>
            <div className="mx-16 bg-slate-800 pt-10 border-4 rounded-sm mt-10">
                <center className="text-3xl font-bold text-white">Road Furniture</center>
                <div className="chainage_filter ml-10 my-5 flex gap-2">
                    <select
                        className="rounded-lg px-3 py-1 bg-black text-white border"
                        onChange={mapSide === "LHS" ? handleLowerlimitRFLHS : handleLowerLimitRFRHS}
                    >
                        {mapSide === "LHS" ? RF_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )) : RF_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg px-3 py-1 bg-black text-white border"
                        onChange={mapSide === "LHS" ? handleUpperLimitRFLHS : handleUpperLimitRFRHS}
                    >
                        {mapSide === "LHS" ? RF_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse() : RF_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse()}
                    </select>
                </div>
                <div className="selection ml-10 ">
                    <select
                        onChange={(e) => setRF(e.target.value)}
                        className=' bg-slate-900  text-white border border-gray-300 rounded-md px-3 py-2'
                    >
                        <option value="Street_Light">
                            Street_Light
                        </option>
                        <option value="Signage">
                            Signage
                        </option>
                    </select>
                </div>
                {RF === "Street_Light" ? (<div className="flex gap-6 px-10 ">
                    <div className="">
                        <Street_Light
                            array={StreetLight}
                            Lowerlimit_RF_LHS={Lowerlimit_RF_LHS}
                            Upperlimit_RF_LHS={Upperlimit_RF_LHS}
                            Lowerlimit_RF_RHS={Lowerlimit_RF_RHS}
                            Upperlimit_RF_RHS={Upperlimit_RF_RHS}
                        />
                    </div>
                    <div className="">
                        <Street_Light
                            array={survey[selectedSurvey].Street_Light}
                            Lowerlimit_RF_LHS={Lowerlimit_RF_LHS}
                            Upperlimit_RF_LHS={Upperlimit_RF_LHS}
                            Lowerlimit_RF_RHS={Lowerlimit_RF_RHS}
                            Upperlimit_RF_RHS={Upperlimit_RF_RHS}
                        />
                    </div>
                </div>) : (<div className="flex gap-6 px-10  ">
                    <div className="">
                        <SignageC
                            array={Signage}
                            Lowerlimit_RF_LHS={Lowerlimit_RF_LHS}
                            Upperlimit_RF_LHS={Upperlimit_RF_LHS}
                            Lowerlimit_RF_RHS={Lowerlimit_RF_RHS}
                            Upperlimit_RF_RHS={Upperlimit_RF_RHS}
                        />
                    </div>
                    <div className="">
                        <SignageC
                            array={survey[selectedSurvey].Road_Furniture}
                            Lowerlimit_RF_LHS={Lowerlimit_RF_LHS}
                            Upperlimit_RF_LHS={Upperlimit_RF_LHS}
                            Lowerlimit_RF_RHS={Lowerlimit_RF_RHS}
                            Upperlimit_RF_RHS={Upperlimit_RF_RHS}
                        />
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default page
