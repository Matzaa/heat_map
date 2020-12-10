(function () {
    fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
        .then((res) => res.json())
        .then(({ monthlyVariance }) => {
            console.log("data :", monthlyVariance);

            monthlyVariance.forEach((el) => {
                el.month = el.month - 1;
            });
            makeHeatMap(monthlyVariance);
        });

    makeHeatMap = (data) => {
        const h = 500;
        const w = 1000;
        const padding = 100;

        const description = d3
            .select("body")
            .append("text")
            .attr("id", "description")
            .text("Teperature from 1753 to 2015 in Celsius")
            .attr("transform", "translate(0, 40");

        const svg = d3
            .select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", "pink");

        // scales

        const minYear = d3.min(data, (d) => d.year);
        const maxYear = d3.max(data, (d) => d.year);

        const xScale = d3
            .scaleLinear()
            .domain([minYear, maxYear + 1])
            .range([padding, w - padding]);

        const yScale = d3
            .scaleTime()
            .domain([
                d3.min(data, (d) => new Date(0, d.month, 0, 0, 0, 0, 0)),
                d3.max(data, (d) => new Date(0, 12, 0, 0, 0, 0, 0)),
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

        // colors

        const colorScale = d3
            .scaleLinear()
            .domain([0, 5])
            .range([
                d3.min(data, (d) => d.variance),
                d3.max(data, (d) => d.variance),
            ]);

        console.log("min vari", colorScale(0));

        // legend

        const legend = d3
            .select("body")
            .append("svg")
            .attr("width", 300)
            .attr("height", 80)
            .attr("id", "legend")
            .style("background-color", "pink")
            .style("margin-top", "10px");

        // graph

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", (d) => d.month)
            .attr("data-year", (d) => d.year)
            .attr("data-temp", (d) => d.variance)
            .attr("x", (d, i) => xScale(d.year))
            .attr("y", (d) => yScale(new Date(0, d.month + 1, 0, 0, 0, 0, 0)))
            .attr("width", (d) => (w - 2 * padding) / (maxYear - minYear))
            .attr("height", (h - padding * 2) / 12)
            .attr("fill", (d) => {
                if (d.variance <= colorScale(1)) {
                    return "rgb(115, 197, 230)";
                } else if (d.variance <= colorScale(2)) {
                    return "rgb(115, 230, 186)";
                } else if (d.variance <= colorScale(3)) {
                    return "rgb(231, 223, 111)";
                } else if (d.variance <= colorScale(4)) {
                    return "rgb(230, 180, 115)";
                } else if (d.variance <= colorScale(5)) {
                    return "rgb(231, 94, 94)";
                }
            })
            .attr("opacity", 0.6)
            .on("mouseover", (e, d) => {
                tooltip
                    .style("left", e.pageX - 100 + "px")
                    .style("top", e.pageY - 20 + "px")
                    .style("transform", "translateX(100px)")
                    .style("visibility", "visible")
                    .attr("data-year", d.year)
                    .html(
                        `<p>${d.variance}</p><p>${d.year}</p><p>${d.month}</p>`
                    );
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // axes

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

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
