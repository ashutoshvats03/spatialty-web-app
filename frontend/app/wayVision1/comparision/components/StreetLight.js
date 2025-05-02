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


function RoadFurniture({ array,Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS }) {

    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const [info, setinfo] = useState(false)
    const [isMounted, setIsMounted] = useState(false);
    const [LowerLimit, setLowerLimit] = useState("dfnvc")
    const [UpperLimit, setUpperLimit] = useState("dfnvc")




    useEffect(() => {
        if (mapSide === "LHS") {
            setLowerLimit(Lowerlimit_RF_LHS)
            setUpperLimit(Upperlimit_RF_LHS)
        } else if (mapSide === "RHS") {
            setLowerLimit(Lowerlimit_RF_RHS)
            setUpperLimit(Upperlimit_RF_RHS)
        }
        setIsMounted(true);
    }, [mapSide, Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS]);

    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }




    console.log(LowerLimit, UpperLimit)
    return (
        <div className=" text-white">


            <div className="mt-5  ">
                <span
                    className="text-3xl font-extrabold cursor-pointer"
                    onClick={() => { info ? setinfo(false) : setinfo(true) }}
                >Info
                </span>

                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-white text-xl bg-slate-800 ">
                                <div className="relative ">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent absolute z-10 border-2 border-black w-[600px] h-[500px] ${info ? "display" : "hidden"}`}>
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

                                            {subitem === "doubleBarChart" && (
                                                <Card className={` w-[600px] h-[500px] border-2  ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <CardContent
                                                        className="h-full">
                                                        <ChartContainer
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                            }}
                                                            config={chartConfig}
                                                        // className="h-full"
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
                                                                    left: 40,
                                                                    right: 0,
                                                                    top: 40,
                                                                    bottom: 40,
                                                                }}
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "extrabold",
                                                                    color: "red",
                                                                    // margin-right: "30px",
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
                                                                            className=" font-extrabold text-[15px]  pb-10 text-white"
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






