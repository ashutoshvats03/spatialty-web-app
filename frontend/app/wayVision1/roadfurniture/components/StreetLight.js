import { useState, useEffect, React } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux/hooks";
import { setMapSide } from "@/app/redux/slices/mapSlice";
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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, Legend } from "recharts"


const chartConfig = {
    Double_arm: {
        label: "Double arm",
        color: "#FF6B6B", // Soft Red
    },
    Single_arm: {
        label: "Single arm",
        color: "#FF8C8C", // Light Coral
    },
    Solar_street: {
        label: "Solar street",
        color: "#E63946", // Deep Red
    },
    Solar_pole: {
        label: "Solar_pole",
        color: "#FF4D4D", // Bright Red
    },
    Solar_signal: {
        label: "Solar signal",
        color: "#FFA07A", // Light Salmon
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
    const [Upperlimit_RHS, setUpperlimit_RHS] = useState(RHS_chainage[Math.floor(RHS_chainage.length / 8)]);
    const [Lowerlimit_RHS, setLowerlimit_RHS] = useState(RHS_chainage[0]);
    const [Upperlimit_LHS, setUpperlimit_LHS] = useState(LHS_chainage[Math.floor(LHS_chainage.length / 8)]);
    const [Lowerlimit_LHS, setLowerlimit_LHS] = useState(LHS_chainage[0]);
    const [LowerLimit, setLowerLimit] = useState()
    const [UpperLimit, setUpperLimit] = useState()


    useEffect(() => {
        if (localStorage.getItem("data") !== null) {
            const data = JSON.parse(localStorage.getItem("data"));
            setLHSChainage(data.RF_chainage || []);
            setRHSChainage(data.RF_chainage || []);
            
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
        }
    }, [LHS_chainage]);

    useEffect(() => {
        if (RHS_chainage.length > 0) {
            setLowerlimit_RHS(RHS_chainage[0]);
            setUpperlimit_RHS(RHS_chainage[Math.floor(RHS_chainage.length / 8)]);
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
    console.log(array)
    return (
        <div className="p-10 mx-16 text-white bg-slate-800 border-4 border-r-4 border-b-4 rounded-sm">
           
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
                        {mapSide === "RHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse() : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse()}
                    </select>
                </div>
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-white text-xl bg-slate-800 ">
                                <div className="relative flex flex-wrap justify-center gap-4">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            className={` flex justify-center`}
                                            key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent mt-5 ml-5 absolute flex-1 z-10 border-2 border-black w-[800px] h-[450px] ${info ? "display" : "hidden"}`}>
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
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent
                                                                            className="bg-black text-red-600 font-extrabold text-[16px]"
                                                                            hideLabel
                                                                            formatter={(value, name, entry) =>
                                                                                `${chartConfig[entry.portion]?.label || name}:` + ` ${value}%`
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
                                                        <ChartContainer
                                                            config={chartConfig2}
                                                            style={{ height: "250px" }}>
                                                            <BarChart
                                                                accessibilityLayer
                                                                data={array[project][mapSide][item][subitem]["chartData"].map(
                                                                    ([month, value]) => ({
                                                                        month,
                                                                        value: parseInt(value, 10), // Convert string to number
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
                                                                            hideLabel
                                                                            className="bg-black text-red-600 font-extrabold text-[14px] "
                                                                            formatter={(value) => {
                                                                                return (
                                                                                    <div >
                                                                                        {value}
                                                                                    </div>
                                                                                );
                                                                            }}

                                                                        />
                                                                    }
                                                                />
                                                                <Bar dataKey="value" radius={5} >
                                                                    {array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([month], index) => (
                                                                            <Cell
                                                                                key={`cell-${month}`}
                                                                                fill={["#FF6B6B", "#FF8C8C", "#E63946","#FF4D4D","#FFA07A"][index % 5]}
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
                                                <Card className={` w-[800px] max-h-[700px] flex-1 border-2  ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <CardContent>
                                                        <ChartContainer
                                                            config={chartConfig}
                                                        >
                                                            <LineChart
                                                                accessibilityLayer
                                                                data={array[project][mapSide][item][subitem]["chartData"]
                                                                    .filter((item) => item[0] >= LowerLimit)
                                                                    .filter((item) => item[0] <= UpperLimit)
                                                                    .map(
                                                                        ([chainage, Double_arm, Single_arm, Solar_street, Solar_pole, Solar_signal]) => ({
                                                                            chainage,
                                                                            Double_arm: parseInt(Double_arm, 10), // Convert string to number
                                                                            Single_arm: parseInt(Single_arm, 10), // Convert string to number
                                                                            Solar_street: parseInt(Solar_street, 10), // Convert string to number
                                                                            Solar_pole: parseInt(Solar_pole, 10), // Convert string to number
                                                                            Solar_signal: parseInt(Solar_signal, 10), // Convert string to number
                                                                        })
                                                                    )}
                                                                    margin={{
                                                                        top: 40,
                                                                        right: 60,
                                                                        bottom: 80,
                                                                        left: 60,
                                                                    }}
                                                                style={{
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    fontSize: "14px",
                                                                    fontWeight: "extrabold",
                                                                    color: "red",
                                                                }}
                                                            >
                                                                <CartesianGrid vertical={false} />
                                                                <YAxis
                                                                stroke='white'
                                                                />
                                                                <XAxis
                                                                    dataKey="chainage"
                                                                    tickLine={true}
                                                                    axisLine={false}
                                                                    tickMargin={8}
                                                                    tickFormatter={(value) => value}
                                                                    tick={{
                                                                        angle: -45,
                                                                        textAnchor: "end",
                                                                    }}
                                                                    stroke='white'
                                                                />
                                                                <ChartTooltip cursor={false} content={
                                                                    <ChartTooltipContent
                                                                        className="bg-black font-extrabold text-[14px]  w-[160px]"
                                                                    />
                                                                }
                                                                />
                                                                <Line
                                                                    dataKey="Double_arm"
                                                                    stroke="var(--color-Double_arm)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Line
                                                                    dataKey="Single_arm"
                                                                    stroke="var(--color-Single_arm)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Line
                                                                    dataKey="Solar_street"
                                                                    stroke="var(--color-Solar_street)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Line
                                                                    dataKey="Solar_pole"
                                                                    stroke="var(--color-Solar_pole)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Line
                                                                    dataKey="Solar_signal"
                                                                    stroke="var(--color-Solar_signal)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Legend
                                                                    verticalAlign="top"  // Position legend at the bottom
                                                                    align="center"          // Align legend items to the center
                                                                    iconType="square" // Change icon shape (can be "square", "circle", "line", etc.)
                                                                    content={
                                                                        <ChartLegendContent
                                                                            className=" font-extrabold text-[15px] scale-130 pb-10 text-white"
                                                                        />
                                                                    }
                                                                />
                                                            </LineChart>
                                                        </ChartContainer>
                                                    </CardContent>
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






