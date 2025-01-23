"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import Map1 from "./map1";


const chartConfig = {
  defectPercentage: { label: "Defect Percentage", color: "brown" },
  chainage: { label: "Chainage" },
};

const ChartSelector = ({ given, mapSide }) => {
  const [selectedOption, setSelectedOption] = useState(Object.keys(given)?.[0] || "");

  useEffect(() => {
    setSelectedOption(Object.keys(given)?.[0] || "");
  }, [mapSide, given]);

  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  if (!given || Object.keys(given).length === 0) {
    return <div>No data available</div>;
  }

  const selectedData = given[selectedOption];
  const formattedData = selectedData?.chartData?.map((item) => ({
    defectPercentage: item[1],
    chainage: item[0],
  }));

  const url = "http://localhost:8000/media/kml/geotagged_road_furniture.kml";

  return (
    <div className="relative w-full ">
      <div className="optionSelection bg-gray-800 text-white p-4">
        <select
          onChange={handleOptionChange}
          value={selectedOption}
          className="p-2 bg-gray-700 text-white rounded-md"
        >
          {Object.keys(given).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-16  overflow-hidden mb-10 mx-10">
        <div className="chart-container h-[300px] flex-1  bg-black">
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
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                    domain={[0, 0.08]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `Chainage: ${value}`}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="defectPercentage"
                    fill="url(#fillDefect)"
                    stroke="var(--color-defectPercentage)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <div className="data-container border absolute top-0 right-0 bg-black rounded-lg text-white m-4 p-4">
              <ul className="">
                {selectedData?.data?.map((item, index) => (
                  <li key={index} className="my-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        <Map1 className="flex-1" url={url} color={"blue"} pavementType={selectedOption} />
      </div>
    </div>
  );
};



export default ChartSelector;
