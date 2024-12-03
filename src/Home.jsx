import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./Home.css"

const Home = () => {
  const [year, setYear] = useState([]);
  const [gdp, setGdp] = useState([]);
  const d3Container = useRef(null);
  const w = 1000;
  const h = 400;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
      const data = await response.json();
      setYear(data.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (year.length > 0) {
      setGdp(year.map(d => d[1]));
    }
  }, [year]);

  useEffect(() => {
    if (gdp.length > 0 && d3Container.current) {
      const container = d3.select(d3Container.current);
      container.selectAll('svg').remove();

      const svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

      const xScale = d3.scaleBand()
        .domain(d3.range(gdp.length))
        .range([0, w])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([h, 0]);

      svg.selectAll("rect")
        .data(gdp)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - yScale(d))
        .attr("fill", "blue")
        .attr("class","bar")
        .append("title").text((d)=>  "$" + d + " Billion")
    }
  }, [gdp]);

  return (
    <div ref={d3Container} style={{backgroundColor: 'white',margin: 'auto', width: "80%", paddingBottom: "30px"}}>
        <h1 style={{textAlign: 'center'}}>United States GDP</h1>
    </div>
  );
}

export default Home;
