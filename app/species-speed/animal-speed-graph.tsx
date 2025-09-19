/* eslint-disable */
"use client";
import { useRef, useEffect, useState  } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; // D3 is a JavaScript library for data visualization: https://d3js.org/
import { csv } from "d3-fetch";

// Example data: Only the first three rows are provided as an example
// Add more animals or change up the style as you desire

// TODO: Write this interface
interface AnimalDatum {
  animal: string;      
  diet: "carnivore" | "herbivore" | "omnivore";  
  average_speed: number; 
}


export default function AnimalSpeedGraph() {
  // useRef creates a reference to the div where D3 will draw the chart.
  // https://react.dev/reference/react/useRef
  const graphRef = useRef<HTMLDivElement>(null);

  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  // TODO: Load CSV data
  useEffect(() => {
    csv("/clean_dataset.csv").then((data) => {
      const cleanedData: AnimalDatum[] = data
        .map((d) => {
          // Convert average_speed to number safely
          const speed = d.average_speed ? +d.average_speed : NaN;

          // Skip rows with missing animal name or invalid speed
          if (!d.animal || isNaN(speed)) return null;

          // Return typed AnimalDatum
          return {
            animal: d.animal,
            diet: d.diet as "carnivore" | "herbivore" | "omnivore",
            average_speed: speed,
          };
        })
        // Type guard to remove nulls and satisfy TypeScript
        .filter((d): d is AnimalDatum => d !== null);

      setAnimalData(cleanedData);
    });
  }, []);


useEffect(() => {
    if (!graphRef.current) return;
    graphRef.current.innerHTML = "";

    if (animalData.length === 0) return;

    // Limit to top N fastest animals
    const topN = 10;
    const filteredData = [...animalData]
      .sort((a, b) => b.average_speed - a.average_speed)
      .slice(0, topN);

    const containerWidth = graphRef.current.clientWidth ?? 800;
    const containerHeight = graphRef.current.clientHeight ?? 500;
    const width = Math.max(containerWidth, 600);
    const height = Math.max(containerHeight, 400);
    const margin = { top: 70, right: 150, bottom: 80, left: 100 };

    const svg = select(graphRef.current)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height);

    // Scales
    const xScale = scaleBand()
      .domain(filteredData.map((d) => d.animal))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, max(filteredData, (d) => d.average_speed)! * 1.1])
      .range([height - margin.bottom, margin.top]);

    const colorScale = scaleOrdinal<string>()
      .domain(["carnivore", "herbivore", "omnivore"])
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    // Bars
    svg
      .selectAll("rect")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.animal)!)
      .attr("y", (d) => yScale(d.average_speed))
      .attr("width", xScale.bandwidth())
      .attr(
        "height",
        (d) => height - margin.bottom - yScale(d.average_speed)
      )
      .attr("fill", (d) => colorScale(d.diet));

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft(yScale));

    // Axis Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .text("Animal");

    svg
      .append("text")
      .attr("x", -(height / 2))
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Speed (km/h)");

    // Legend
    const legend = svg.append("g").attr(
      "transform",
      `translate(${width - margin.right + 20}, ${margin.top})`
    );

    ["carnivore", "herbivore", "omnivore"].forEach((diet, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 25})`);
      g.append("rect").attr("width", 20).attr("height", 20).attr("fill", colorScale(diet));
      g.append("text").attr("x", 25).attr("y", 15).text(diet);
    });
  }, [animalData]);
  // TODO: Return the graph
    // Placeholder so that this compiles. Delete this below:
    return <div ref={graphRef} style={{ width: "100%", height: "500px" }} />;


}
