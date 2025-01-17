
import React from "react";
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
} from "@/components/ui/chart";

import { Bar, BarChart, XAxis, YAxis } from "recharts"

const chartConfig = {
    cautionary: {
        label: "cautionary",
        color: "#A3CEF1", // Light Blue
    },
    informatory: {
        label: "informatory",
        color: "#FFDEB4", // Soft Peach
    },
    mandatory: {
        label: "mandatory",
        color: "#B5EAD7", // Mint Green
    },
};
const chartConfig2 = {
    value: {
        label: "value",
    },
};
const chartConfig3 = {
    cautionary: {
        label: "cautionary",
        color: "lightblue",
    },
    mandatory: {
        label: "mandatory",
        color: "lightpink",
    },
    informatory: {
        label: "informatory",
        color: "lightgreen",
    },
};

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
                Road Furniture
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
                                                            className="mx-auto max-h-[250px]"
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
                                                        <ChartContainer config={chartConfig2}>
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
                                                <Card className="bg-transparent border-none w-[800px] max-h-[800px]">
                                                    <ChartContainer
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            margin: "auto"
                                                        }}
                                                        config={chartConfig3}>
                                                        <BarChart
                                                            accessibilityLayer
                                                            data={array[project][mapSide][item][subitem]["chartData"].map(
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
                                                                margin: "auto",
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
                                                                interval={1} // Display every tick (this will show all 100 dates if the space allows)
                                                                axisLine={false}
                                                                tickMargin={10}

                                                                tick={{
                                                                    angle: -45,
                                                                    textAnchor: "end",
                                                                }}
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                    color: "black",
                                                                }}
                                                            />


                                                            <Bar
                                                                dataKey="cautionary"
                                                                stackId="a"
                                                                fill="lightblue"
                                                                radius={[0, 0, 0, 0]}
                                                            />
                                                            <Bar
                                                                dataKey="informatory"
                                                                stackId="a"
                                                                fill="lightpink"
                                                                radius={[0, 0, 0, 0]}
                                                            />
                                                            <Bar
                                                                dataKey="mandatory"
                                                                stackId="a"
                                                                fill="lightgreen"
                                                                radius={[3, 3, 0, 0]}
                                                            />
                                                            <ChartTooltip
                                                                content={
                                                                    <ChartTooltipContent className="w-[130px] font-bold bg-red-500" />
                                                                }
                                                                cursor={false}
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
