import React from "react";
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
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, } from "recharts"





const chartConfig = {
    Double_warm_street_light_Count: {
        label: "Double_warm_street_light_Count",
        color: "#A3CEF1", // Light Blue
    },
    Solar_signal_light_Count: {
        label: "Solar_signal_light_Count",
        color: "#FFDEB4", // Soft Peach
    },
    Solar_powered_pole_Count: {
        label: "Solar_powered_pole_Count",
        color: "#B5EAD7", // Mint Green
    },
    Single_arm_street_light_Count: {
        label: "Single_arm_street_light_Count",
        color: "#C6AEF1", // Light Blue
    },
    Solar_street_light_Count: {
        label: "Solar_street_light_Count",
        color: "#EFAEB4", // Soft Peach
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
        color: "#A3CEF1", // Light Blue
    },
    Single_arm: {
        label: "Single_arm",
        color: "#FFDEB4", // Soft Peach
    },
    Solar: {
        label: "Solar",
        color: "#B5EAD7", // Mint Green
    },
    Solar_powered: {
        label: "Solar powered",
        color: "#C6AEF1", // Light Blue
    },
    Solar_signal: {
        label: "Solar signal",
        color: "#EFAEB4", // Soft Peach
    },

}

function RoadFurniture({array}) {
    
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const handleSliderChange = (e) => {
        dispatch(setMapSide(e.target.value === "0" ? "LHS" : "RHS"));
    };
    return (
        <div className="p-10 mx-16 bg-slate-700 border-white border-2 border-r-4 border-b-4 rounded-sm">
            <div className="text-center font-bold text-3xl">
                Street Light
            </div>
            <div>
                LHS
                <input type="range" min="0" max="1" step="1" value={mapSide === "LHS" ? "0" : "1"} onChange={handleSliderChange} className="w-[34px] bg-red-800 rounded-lg" />
                RHS
            </div>
            <div className="mt-5  ">
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="">
                            <div className=" font-bold text-2xl text-center my-5">{item}</div>
                            <div className="  text-black text-xl bg-slate-800 p-10 border-white border-2 rounded">
                                <div className="flex flex-wrap justify-center gap-4">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div className={`flex justify-center ${subitem === "doubleBarChart" ? "w-full" : "flex-1"}`} key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className=" flex-1 bg-transparent border-none w-[400px] ">
                                                    <CardContent className="flex-1 pb-0">
                                                        <ChartContainer
                                                            config={chartConfig}
                                                            className="mx-auto ]"
                                                            style={{ height: "300px" }}
                                                        >
                                                            <PieChart
                                                                style={{
                                                                    color: "black",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent
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
                                                                    outerRadius={80}
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
                                            {subitem === "barChart" && (
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
                                                                <Bar dataKey="value" fill="lightblue" radius={5} />
                                                            </BarChart>
                                                        </ChartContainer>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {subitem === "doubleBarChart" && (
                                                <Card className="  bg-transparent border-none w-[800px] ">
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
                                                                    right: 20,
                                                                    top: 0,
                                                                    bottom: 40,
                                                                }}
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "extrabold",
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
                                                                <ChartTooltip  cursor={false} content={<ChartTooltipContent  className="bg-red-500 font-bold w-[140px]" />} />
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






