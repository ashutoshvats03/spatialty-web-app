import { useState, React } from "react";
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
    Double_warm_street_light: {
        label: "Double_warm_street_light",
        color: "#FF6B6B", // Soft Red
    },
    Solar_signal_light: {
        label: "Solar_signal_light",
        color: "#FF8C8C", // Light Coral
    },
    Solar_powered_pole: {
        label: "Solar_powered_pole",
        color: "#E63946", // Deep Red
    },
    Single_arm_street_light: {
        label: "Single_arm_street_light",
        color: "#FF4D4D", // Bright Red
    },
    Solar_street_light: {
        label: "Solar_street_light",
        color: "#FFA07A", // Light Salmon
    },
};
const chartConfig2 = {
    value: {
        label: "value",
    },
};
const chartConfig3 = {
    Double_arm: {
        label: "Double_arm",
        color: "#FF6B6B", // Soft Red
    },
    Single_arm: {
        label: "Single_arm",
        color: "#FF8C8C", // Light Coral
    },
    Solar: {
        label: "Solar",
        color: "#E63946", // Deep Red
    },
    Solar_powered: {
        label: "Solar powered",
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
    const handleSliderChange = (e) => {
        dispatch(setMapSide(e.target.value));
    };
    return (
        <div className="p-10 mx-16 bg-slate-300 border-black border-4 border-r-4 border-b-4 rounded-sm">
            <div className="text-center font-bold text-3xl">
                Street Light
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
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-black text-xl bg-slate-300 ">
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
                                                <Card className={` w-[800px] h-[450px] flex-1 border-2 border-black ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <CardContent>
                                                        <ChartContainer
                                                            config={chartConfig3}
                                                            style={{ height: "400px" }}
                                                        >
                                                            <LineChart
                                                                accessibilityLayer
                                                                data={array[project][mapSide][item][subitem]["chartData"].map(
                                                                    ([chainage, Double_arm, Single_arm, Solar, Solar_powered, Solar_signal]) => ({
                                                                        chainage,
                                                                        Double_arm: parseInt(Double_arm, 10), // Convert string to number
                                                                        Single_arm: parseInt(Single_arm, 10), // Convert string to number
                                                                        Solar: parseInt(Solar, 10), // Convert string to number
                                                                        Solar_powered: parseInt(Solar_powered, 10), // Convert string to number
                                                                        Solar_signal: parseInt(Solar_signal, 10), // Convert string to number
                                                                    })
                                                                )}
                                                                margin={{
                                                                    left: 40,
                                                                    right: 40,
                                                                    top: 40,
                                                                    bottom: 40,
                                                                }}
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "extrabold",
                                                                    color: "red",
                                                                }}
                                                            >
                                                                <CartesianGrid vertical={false} />
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
                                                                    dataKey="Solar"
                                                                    stroke="var(--color-Solar)"
                                                                    strokeWidth={2}
                                                                    dot={true}
                                                                />
                                                                <Line
                                                                    dataKey="Solar_powered"
                                                                    stroke="var(--color-Solar_powered)"
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
                                                                            className="text-black font-extrabold text-[15px] scale-130 pb-10"
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






