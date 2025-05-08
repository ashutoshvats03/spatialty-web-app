"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Map from "./Multi";


const chartConfig = {
  defectPercentage: { label: "Defect Percentage", color: "brown" },
  chainage: { label: "Chainage" },
};

const ChartSelector = (
  { given, mapSide, Lowerlimit_LHS, Upperlimit_LHS, Lowerlimit_RHS, Upperlimit_RHS, }) => {

  const [selectedOption, setSelectedOption] = useState(Object.keys(given)?.[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [LowerLimit, setLowerLimit] = useState("dfnvc")
  const [UpperLimit, setUpperLimit] = useState("djj")

  useEffect(() => {
    setSelectedOption(Object.keys(given)?.[0] || "");
    if (mapSide === "LHS") {
      setLowerLimit(Lowerlimit_LHS)
      setUpperLimit(Upperlimit_LHS)
    } else if (mapSide === "RHS") {
      setLowerLimit(Lowerlimit_RHS)
      setUpperLimit(Upperlimit_RHS)
    }
    setIsMounted(true);
  }, [mapSide, given, Lowerlimit_LHS, Upperlimit_LHS, Lowerlimit_RHS, Upperlimit_RHS]);



  if (!given || Object.keys(given).length === 0) {
    return <div>No data available</div>;
  }

  // console.log(LowerLimit, UpperLimit)
  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  const selectedData = given[selectedOption];
  
  const formattedData = selectedData?.chartData
    ?.filter((item) => item[0] >= LowerLimit)
    .filter((item) => item[0] <= UpperLimit) // Filter items first
    .map((item) => ({
      defectPercentage: item[1],
      chainage: item[0]
    }));

  const url = selectedData?.url
  console.log("url", url)



  return (
    <div className="relative w-full ">
      <div className="optionSelection bg-slate-800  text-white p-4">
        <select
          onChange={handleOptionChange}
          value={selectedOption}
          className="p-2 bg-slate-500 border border-black text-black font-bold rounded-md"
        >
          {Object.keys(given).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-16  overflow-hidden mb-10 mx-10">
        <div className="chart-container h-[300px] flex-1  bg-black text-white  rounded-lg">
          <Card className="relative">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <AreaChart key={selectedOption} data={formattedData}>
                  <defs>
                    <linearGradient id="fillDefect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-defectPercentage)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-defectPercentage)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid horizontal={false} vertical={false} />
                  <XAxis
                    dataKey="chainage"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    tickMargin={8}
                    minTickGap={30}
                    domain={["dataMin", "dataMax"]}
                    stroke='white'
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value).toFixed(2)}%`}
                    domain={[0, 0.08]}
                    stroke='white'
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className=" bg-slate-800 text-red-600 font-bold w-[200px] p-2"
                        labelFormatter={(value) => `Chainage: ${value}`}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="defectPercentage"
                    type="monotone"
                    fill="rgb(255, 107, 107)"
                    stroke="var(--color-defectPercentage)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>

          </Card>

        </div>
        <div className="flex-1">
          {url ? <Map key={isMounted} url={url} LowerLimit={LowerLimit}  UpperLimit={UpperLimit} /> : null}
        </div>
      </div>
    </div>
  );
};



export default ChartSelector;
