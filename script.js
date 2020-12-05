(function () {
    fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
        .then((res) => res.json())
        .then(({ monthlyVariance }) => {
            console.log("data :", monthlyVariance);
            makeHeatMap(monthlyVariance);
        });

    makeHeatMap = (data) => {
        const h = 500;
        const w = 1000;
        const padding = 100;

        const description = d3
            .select("body")
            .append("text")
            .text("description")
            .attr("transform", "translate(0, 40");

        const svg = d3
            .select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", "pink");

        // scales

        const xScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
            .range([padding, w - padding]);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(data, (d) => d.month),
                d3.max(data, (d) => d.month),
            ])
            .range([h - padding, padding]);

        // tooltip

        let tooltip = d3
            .select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("width", 100)
            .style("height", 50)
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("");

        // graph

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("data-month", (d) => d.month)
            .attr("data-year", (d) => d.year)
            .attr("data-temp", (d) => d.variance)
            .attr("x", (d, i) => xScale(d.year))
            .attr("y", (d) => yScale(d.month + 1))
            .attr("width", 3)
            .attr("height", (h - padding * 2) / 12)
            .attr("opacity", 0.6)
            .on("mouseover", (e, d) => {
                tooltip
                    .style("left", e.pageX - 100 + "px")
                    .style("top", e.pageY - 20 + "px")
                    .style("transform", "translateX(100px)")
                    .style("visibility", "visible")
                    .html(
                        `<p>${d.variance}</p><p>${d.year}</p><p>${d.month}</p>`
                    );
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // axes

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -300)
            .attr("y", 49)
            .text("MONTHS")
            .attr("class", "text");

        svg.append("text")
            .attr("x", w / 2 - padding / 2)
            .attr("y", h - padding / 3)
            .text("YEARS")
            .attr("class", "text");
    };
})();
