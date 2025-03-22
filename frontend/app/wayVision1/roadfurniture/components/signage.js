import { useState, useEffect, React } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux/hooks";
import { setMapSide } from "@/app/redux/slices/mapSlice";
import { Pie, PieChart, Cell, Label } from "recharts";


import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegendContent,
} from "@/components/ui/chart";

import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts"

const chartConfig = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};

const chartConfig2 = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};

const chartConfig3 = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};


function RoadFurniture({ array }) {
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const [info, setinfo] = useState(false)
    const [LHS_chainage, setLHSChainage] = useState([]);
    const [RHS_chainage, setRHSChainage] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [Upperlimit_RHS, setUpperlimit_RHS] = useState(RHS_chainage[99]);
    const [Lowerlimit_RHS, setLowerlimit_RHS] = useState(RHS_chainage[0]);
    const [Upperlimit_LHS, setUpperlimit_LHS] = useState(LHS_chainage[99]);
    const [Lowerlimit_LHS, setLowerlimit_LHS] = useState(LHS_chainage[0]);
    const [LowerLimit, setLowerLimit] = useState("dfnvc")
    const [UpperLimit, setUpperLimit] = useState("djj")

    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const data = JSON.parse(localStorage.getItem("data"));
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

    useEffect(() => {
        if (mapSide === "LHS") {
            setLowerLimit(Lowerlimit_LHS)
            setUpperLimit(Upperlimit_LHS)
        } else if (mapSide === "RHS") {
            setLowerLimit(Lowerlimit_RHS)
            setUpperLimit(Upperlimit_RHS)
        }
        setIsMounted(true);
    }, [mapSide, Lowerlimit_LHS, Upperlimit_LHS, Lowerlimit_RHS, Upperlimit_RHS]);


    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }

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
    const handleSliderChange = (e) => {
        dispatch(setMapSide(e.target.value));
    };

    console.log(LowerLimit, UpperLimit)
    return (
        <div className="p-10 mx-16 bg-slate-300  border-black border-4 border-r-4 border-b-4 rounded-sm">
            <div className="text-center font-bold text-3xl">
                Road Furniture
            </div>
            <div className="font-bold text-2xl flex gap-2">
                <input type="checkbox" name="mapSide" value="LHS" checked={mapSide === "LHS"} onChange={handleSliderChange} className="" />
                LHS
                <input type="checkbox" name="mapSide" value="RHS" checked={mapSide === "RHS"} onChange={handleSliderChange} className="" />
                RHS
            </div>
            <div className="mt-5  ">
                <span
                    className="text-3xl font-extrabold cursor-pointer"
                    onClick={() => { info ? setinfo(false) : setinfo(true) }}
                >Info
                </span>
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
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-black text-xl ">
                                <div className=" relative flex flex-wrap justify-center gap-4">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            // className={`relative flex justify-center ${subitem === "doubleBarChart" ? "w-full" : "flex-1"}`}
                                            className={` flex justify-center`}
                                            key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent  mt-5 ml-5 absolute flex-1 z-10 border-2 border-black w-[800px] h-[450px] ${info ? "display" : "hidden"}`}>
                                                    <CardContent className="flex-1 pb-0 flex items-center justify-center h-full">
                                                        <ChartContainer
                                                            config={chartConfig}
                                                            className="w-[100%] h-[100%]"
                                                        >
                                                            <PieChart
                                                                width={100}
                                                                height={100}
                                                                style={{
                                                                    color: "black",
                                                                    fontSize: "16px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent
                                                                            className="bg-black text-red-600 font-extrabold text-[16px]"
                                                                            hideLabel
                                                                            formatter={(value, name, entry) =>
                                                                                `${chartConfig[entry.portion]?.label || name}: ${value}%`
                                                                            }
                                                                        />
                                                                    }
                                                                />

                                                                <Pie
                                                                    data={array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([portion, percentage]) => ({
                                                                            portion,
                                                                            percentage: parseFloat(percentage), // Convert string to number
                                                                        })
                                                                    )}
                                                                    dataKey="percentage"
                                                                    nameKey="portion"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={120}
                                                                    innerRadius={0}
                                                                >
                                                                    {array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([portion], index) => (
                                                                            <Cell
                                                                                key={`cell-${portion}`}
                                                                                fill={chartConfig[portion]?.color || "gray"}
                                                                            />
                                                                        )
                                                                    )}
                                                                </Pie>

                                                            </PieChart>
                                                        </ChartContainer>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {/* {subitem === "barChart" && (
                                                <Card className=" flex-1 bg-transparent border-none w-[400px]">
                                                    <CardContent>
                                                        <ChartContainer config={chartConfig2}>
                                                            <BarChart
                                                                accessibilityLayer
                                                                data={array[project][mapSide][item][subitem]["chartData"].map(
                                                                    ([month, value], index) => ({
                                                                        month,
                                                                        value: parseInt(value, 10), // Convert string to number  
                                                                        color: ["red", "blue", "#3357FF", "#FF33A8", "#A833FF", "#33FFF3", "#FF8C33"][index % 7],
                                                                    })
                                                                )}
                                                                layout="vertical"
                                                                style={{
                                                                    color: "black",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                }}
                                                                margin={{
                                                                    top: 0,
                                                                    right: 0,
                                                                    left: 40,
                                                                    bottom: 0,
                                                                }}
                                                            >
                                                                <XAxis
                                                                    type="number"
                                                                    dataKey="value"
                                                                    tickLine={false}
                                                                    axisLine={false}
                                                                />
                                                                <YAxis
                                                                    dataKey="month"
                                                                    type="category"
                                                                    tickLine={false}
                                                                    tickMargin={10}
                                                                    axisLine={false}
                                                                    tickFormatter={(value) => value}

                                                                />
                                                                <ChartTooltip
                                                                    cursor={false}
                                                                    content={
                                                                        <ChartTooltipContent
                                                                            className="bg-black text-red-600 font-extrabold text-[14px]"
                                                                            hideLabel
                                                                            formatter={(value) => {
                                                                                return (
                                                                                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                                                                                        {value}
                                                                                    </div>
                                                                                );
                                                                            }}

                                                                        />
                                                                    }
                                                                />

                                                                <Bar

                                                                    dataKey="value"
                                                                    radius={5}
                                                                >
                                                                    {array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([month], index) => (
                                                                            <Cell
                                                                                key={`cell-${month}`}
                                                                                fill={[ "#FFA07A","#FF6B6B", "#FF4500"][index % 3]}
                                                                            />
                                                                        )
                                                                    )}
                                                                </Bar>
                                                                


                                                            </BarChart>
                                                        </ChartContainer>
                                                    </CardContent>
                                                </Card>
                                            )} */}
                                            {subitem === "doubleBarChart" && (
                                                <Card className={` w-[800px] max-h-[700px] flex-1 border-2 border-black ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <ChartContainer
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                        config={chartConfig3}>
                                                        <BarChart
                                                            accessibilityLayer
                                                            data={array[project][mapSide][item][subitem]["chartData"]
                                                                // .filter((item) => item[0] >= LowerLimit)
                                                                // .filter((item) => item[0] <= UpperLimit)
                                                                .map(
                                                                    ([chainage, cautionary, informatory, mandatory]) => ({
                                                                        chainage,
                                                                        cautionary: parseInt(cautionary), // Convert string to number
                                                                        informatory: parseInt(informatory),
                                                                        mandatory: parseInt(mandatory),
                                                                    })
                                                                ) || []}
                                                            barSize={24}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                fontSize: "14px",
                                                                fontWeight: "extrabold",
                                                            }}
                                                            margin={{
                                                                top: 40,
                                                                right: 20,
                                                                bottom: 80,
                                                                left: 60,
                                                            }}
                                                        >
                                                            <XAxis
                                                                dataKey="chainage"
                                                                interval={30} // Display every tick (this will show all 100 dates if the space allows)
                                                                axisLine={false}
                                                                tick={{
                                                                    angle: -55,
                                                                    textAnchor: "end",
                                                                }}

                                                            />


                                                            <Bar
                                                                dataKey="cautionary"
                                                                stackId="a"
                                                                fill="#FF6B6B" // Deep Red
                                                                radius={[0, 0, 0, 0]} // No border radius
                                                            />
                                                            <Bar
                                                                dataKey="informatory"
                                                                stackId="a"
                                                                fill="#FFA07A" // Soft Pinkish-Red
                                                                radius={[0, 0, 0, 0]} // No border radius
                                                            />
                                                            <Bar
                                                                dataKey="mandatory"
                                                                stackId="a"
                                                                fill="#FF4500" // Bright Red
                                                                radius={[3, 3, 0, 0]} // Rounded top corners for better visual distinction
                                                            />

                                                            <ChartTooltip
                                                                content={
                                                                    <ChartTooltipContent
                                                                        className="bg-black text-red-600 font-extrabold text-[14px] w-[160px]"
                                                                    />
                                                                }
                                                                cursor={false}
                                                            />
                                                            <Legend
                                                                verticalAlign="top"  // Position legend at the bottom
                                                                align="center"          // Align legend items to the center
                                                                iconType="square" // Change icon shape (can be "square", "circle", "line", etc.)
                                                                // iconSize="22px" // Change icon size
                                                                // style={{ color: "black" }} // Change legend text color
                                                                // wrapperStyle={{ fontSize: "25px", fontWeight: "bold" }} // Customize legend text
                                                                content={
                                                                    <ChartLegendContent
                                                                        className="text-black font-extrabold text-[15px] scale-150"
                                                                    />
                                                                }
                                                            />
                                                        </BarChart>
                                                    </ChartContainer>
                                                </Card>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No data available</div>
                )}
            </div>
        </div>
    )
}

export default RoadFurniture
