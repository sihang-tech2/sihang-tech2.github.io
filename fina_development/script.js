function parseCsv(d) {
    {
        return {
            station: d[`Place Name`],
            boarding: +d.Boardings,
            load: +d.Load,
            time: d.time, 
            day:d.day,
            line:d.line,
            direction:d.direction,
            per:+d.per,
            level:d.level
        }    
    }
}

d3.csv("./data/ready_data.csv", parseCsv).then(function(data) {
    const submitButton = document.querySelector("#butt");

// determine min and max for "per" variable
    const perRange = {
        min: d3.min(data, function(d) { return d.per; }),
        max: d3.max(data, function(d) { return d.per; })
    };

// append svg for radial bar
    
    const marginR = {top: 10, right: 10, bottom: 10, left: 10};
    const widthR = 1000;
    const heightR = 600;
    const innerRadius = 110;
    const outerRadius = Math.min(widthR, heightR) / 2;

    var svgradial = d3.select("#radial")
        .append("svg")
        .attr("viewBox", `0 0 ${widthR} ${heightR}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${widthR/2},${heightR/2+marginR.top})`); 

    const tooltipR = d3.select("#radial")
    .append("div")
    .attr("class", "tooltipR");

// append svg for crowding simulation 
    
    // define metrics
    const factor = 15;
    const widthT = 9; //train width in feet
    const longT = 48; //train long in feet
    const radius = 1; // human space in feet
    const outerCircle = 2; // personal space in feet

    const marginC = {top: 0, right: 0, bottom: 0, left: 0};
    const widthC = (longT*factor)+marginC.left+marginC.right;
    const heightC = (widthT*factor)+marginC.top+marginC.bottom;

    const svgCrowd = d3.select("#crowd")
        .append("svg")
        .attr("viewBox", `0 0 ${widthC} ${heightC}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    svgCrowd.append("rect")
        .attr("x", marginC.left)
        .attr("y", marginC.top)
        .attr("width", longT*factor)
        .attr("height",  widthT*factor)
        .style("fill", "#E9EAED");

    // // append "me" circle
    // function drawMe (){
    //     const meCircle = svgCrowd.append("g")
    //     .attr("class", "me")
        
    //     meCircle.append("circle")
    //         .attr("cx", (longT*factor)/2+marginC.left)
    //         .attr("cy", (widthT*factor)/2+marginC.top)
    //         .attr("r", radius*factor)
    //         .style("fill", "#39B6C0");
    //     meCircle.append("circle")
    //         .attr("cx", (longT*factor)/2+marginC.left)
    //         .attr("cy", (widthT*factor)/2+marginC.top)
    //         .attr("r", (outerCircle+radius)*factor)
    //         .style("fill", "none")
    //         .style("stroke", "black")
    //         .style("stroke-opacity", 1)
    //         .style("stroke-dasharray", "3,5");
    //     }

// Create drop down menus 

// get unique values from line column
    const lines = [...new Set(data.map(function(d) {
        return d.line;
        }))];

// create line filter drop-down menu
    const lineSelect = d3.select("#menu")
        .append("select");

    lineSelect.append("option")
        .text("Select your line")
        .attr("disabled", true)
        .attr("selected", true);

    lineSelect.selectAll(".line-option")
        .data(lines)
        .enter()
        .append("option")
        .attr("class", "line-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

// create direction filter drop-down menu
    const directionSelect = d3.select("#menu")
    .append("select");

    directionSelect.append("option")
    .attr("value", "")
    .text("Select your direction")
    .attr("disabled", true)
    .attr("selected", true);

// create station filter drop-down menu
    const stationSelect = d3.select("#menu")
    .append("select");

    stationSelect.append("option")
    .attr("value", "")
    .text("Select your station")
    .attr("disabled", true)
    .attr("selected", true);

// create time filter drop-down menu
    const timeSelect = d3.select("#menu")
    .append("select");

    timeSelect.append("option")
    .attr("value", "")
    .text("Select your travel time")
    .attr("disabled", true)
    .attr("selected", true);



// Event listener to slice data when line selected 

    lineSelect.on("change", function() {

        const selectedLine = d3.select(this).property("value"); // Get the selected line from the dropdown
        slicedDataLine = data.filter(d => d.line === selectedLine); // Filter the data based on the selected line
        doLineSelected(slicedDataLine);

    });

    function doLineSelected(data) {

        const directions = [...new Set(data.map(function(d) {
        return d.direction;
        }))];

        directionSelect.selectAll(".direction-option")
        .remove()
        directionSelect.property("value", "");
        
        stationSelect.selectAll(".station-option")
        .remove();
        stationSelect.property("value", "");

        timeSelect.selectAll(".station-option")
        .remove();
        timeSelect.property("value", "");

        directionSelect.selectAll(".direction-option")
        .data(directions)
        .enter()
        .append("option")
        .attr("class", "direction-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

        // Event listener when direction selected 
        directionSelect.on("change", function(){
            const selectedDirection = d3.select(this).property("value"); 
            slicedDataDirection = data.filter(d => d.direction === selectedDirection); 
            doDirectionSelected(slicedDataDirection);
        })

    }

    function doDirectionSelected(data) {

        const stations = [...new Set(data.map(function(d) {
        return d.station;
        }))];
    
        // directionSelect.selectAll(".direction-option")
        // .remove()
        // directionSelect.property("value", "");
        
        stationSelect.selectAll(".station-option")
        .remove();
        stationSelect.property("value", "");

        timeSelect.selectAll(".station-option")
        .remove();
        timeSelect.property("value", "");

        stationSelect.selectAll(".station-option")
        .data(stations)
        .enter()
        .append("option")
        .attr("class", "station-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

        // Event listener when station selected 
        stationSelect.on("change", function(){
            const selectedStation = d3.select(this).property("value"); 
            slicedDataStation = data.filter(d => d.station === selectedStation); 
            doStationSelected(slicedDataStation);
        })

    }

    function doStationSelected(data) {
        
        const times = [...new Set(data.map(function(d) {
        return d.time;
        }))];

        // directionSelect.selectAll(".direction-option")
        // .remove()
        // directionSelect.property("value", "");
        
        // stationSelect.selectAll(".station-option")
        // .remove();
        // stationSelect.property("value", "");

        timeSelect.selectAll(".station-option")
        .remove();
        timeSelect.property("value", "");

        timeSelect.selectAll(".time-option")
        .data(times)
        .enter()
        .append("option")
        .attr("class", "time-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

        //Radial bar chart
        //Filter weekday average data
        let weekdayR = data.filter(function(d) {
            return d.day === "Weekday";
        });

        function drawRadial () {

            // X scale
            const xr = d3.scaleBand()
            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)                  // This does nothing ?
            .domain(weekdayR.map(function(d) { return d.time; })); // The domain of the X axis is the list of states.

            // Y scale
            const yr = d3.scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([perRange.min, perRange.max]); // Domain of Y is from 0 to the max seen in the data

            // Color sacle 

            // Add bars

            svgradial.selectAll("path")
            .append("g")
            .data(weekdayR)
            .join("path")
            .attr("fill", "red")
            .attr("class", "bar")
            .attr("opacity", 0.2)
            .attr("d", d3.arc()     
                .innerRadius(innerRadius)
                .outerRadius(d => yr(d.per))
                .startAngle(d => xr(d.time))
                .endAngle(d => xr(d.time) + xr.bandwidth())
                .padAngle(0.01)
                .padRadius(2000))
            .transition() // add a transition effect
            .duration(2000) // set the duration of the transition
            .attr("opacity", 1)
            .attr("d", d3.arc()     
                .innerRadius(innerRadius)
                .outerRadius(d => yr(d.per))
                .startAngle(d => xr(d.time))
                .endAngle(d => xr(d.time) + xr.bandwidth())
                .padAngle(0.01)
                .padRadius(1000))

            // Add the labels
            svgradial.append("g")
            .selectAll("g")
            .data(weekdayR)
            .join("g")
            .attr("text-anchor", function(d) { return (xr(d.time) + xr.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((xr(d.time) + xr.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yr(d.per)+10) + ",0)"; })
            .append("text")
            .text(function(d){return(d.time)})
            .attr("transform", function(d) { return (xr(d.time) + xr.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            // .style("font-size", "1rem")
            .attr("alignment-baseline", "middle")
            .attr("class", "timeLabels");

        }

        submitButton.addEventListener("click", function() {
            d3.selectAll(".bar").remove();
            d3.selectAll(".timeLabels").remove();
            drawRadial();
            // tooltip for raidal bar
            d3.selectAll(".bar").on("mouseover", function(e,d) {

                tooltipR.style("visibility", "visible")
                .html(`Hi this is radial bar`)

            d3.select(this)
            // .attr("fill", "#0072a6")
            // .attr("opacity", 1);
            }).on("mouseout", function () {
        
                tooltipR.style("visibility", "hidden");
        
                d3.select(this)
                // .attr("fill", "transparent")
                // .attr("opacity", 0.8);
            })
        })

        // Event listener when time selected 
        timeSelect.on("change", function(){
            const selectedTime = d3.select(this).property("value"); 
            slicedDataTime = data.filter(d => d.time === selectedTime); 
            selectedData(slicedDataTime);
        })

    }

    // append the svg for lollipop

    const widthpop = document.querySelector("#lollipop").clientWidth;
    const heightpop = document.querySelector("#lollipop").clientHeight;
    const marginpop = {top: 30, left: 120, right: 30, bottom: 30};

    var svgpop = d3.select("#lollipop")
        .append("svg")
            .attr("viewBox", `0 0 ${widthpop} ${heightpop}`)
            .attr("preserveAspectRatio", "xMinYMin meet");
            // .attr("width", 500)
            // .attr("height", 600)
            // .append("g")
            // .attr("transform", "translate(50, 50)");

    // draw y-axis for lollipop
    let Yaxis = d3.scaleBand()
        .range([ marginpop.top-80, heightpop-(marginpop.bottom) ])
        .domain(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
        .padding(1);
    svgpop.append("g")
        .attr("transform", `translate(${marginpop.left},0)`)
        .attr("class","axis")
        .call(d3.axisLeft(Yaxis).tickSize(0))
    .selectAll("text")
        .attr("dx", "-6rem") // adjust the position of the text element to the right by 0.5em

        

    //tooltip for lollipop
    const popTooltip = d3.select("#lollipop")
        .append("div")
        .attr("class", "tooltip");

    // Finally do something with all filters selected 

    function selectedData(selectedData) {

        function drawCircles () {
            //Filter weekdays data
            let weekdayC = selectedData.filter(function(d) {
                return d.day === "Weekday";
            });
            passengers = weekdayC[0].per;
            console.log(passengers);
            // Create new array for drawing circles

            let meArray = [
                { id: 6, name: 'Object 6', class: `me` }
            ];

            function createArrayOfObjects(num) {
                let arr = [];

                for (let i = 0; i < num; i++) {
                let obj = { id: i + 1, name: `Object ${i + 1}`, class:`other`};
                arr.push(obj);
            }
            return arr;
            }

            let circleArray = meArray.concat(createArrayOfObjects(passengers-1))
            console.log(circleArray);

            const circleGroup = svgCrowd.append("g")
                .attr("clsss", "circleGroup")
                .attr("transform", "translate(" + marginC.left + "," + marginC.top + ")");

            // Define a collision detection function
            function collide(node) {
                const r = node.getAttribute("r");
                const x = parseFloat(node.getAttribute("cx"));
                const y = parseFloat(node.getAttribute("cy"));
                for (let i = 0; i < circles.length; i++) {
                if (circles[i] != node) {
                    const r2 = circles[i].getAttribute("r");
                    const x2 = parseFloat(circles[i].getAttribute("cx"));
                    const y2 = parseFloat(circles[i].getAttribute("cy"));
                    const dx = x - x2;
                    const dy = y - y2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < r + r2 + 5) {
                    return true;
                    }
                }
                }
                return false;
            }
            
            // Append circles to the group element

            var circleColor = d3.scaleOrdinal()
            .domain(["me", "other"])
            .range(["#bc3f67", "#0369a0"]);

            // Try d3 force

            var circleMin = d3.min(circleArray, function(d) { return d.id; });
            var circleMax = d3.max(circleArray, function(d) { return d.id; });

            xScale = d3.scaleLinear()
            .domain([circleMin, circleMax])
            .range([50, widthC-50]);

            function assignRandomVerticalValues(arr) {
                arr.forEach(function(obj) {
                  obj.vertical = Math.floor(Math.random() * 3) + 1;
                });
            }

            assignRandomVerticalValues(circleArray)

            console.log(circleArray);

            yScale = d3.scaleLinear()
            .domain([1,3])
            .range([(radius*factor) *2, heightC-(radius*factor) *2 ]);

            console.log(xScale(circleMax));

            var simulation = d3.forceSimulation(circleArray)
                .force("repel", d3.forceManyBody().strength(-5))
                .force("x", d3.forceX().x(function(d) {
                    return xScale(d.id);}))
                .force("y", d3.forceY().y(function(d) {
                    return yScale(d.vertical);}))
                .force("collision", d3.forceCollide().radius(radius*factor))

            const circles = circleGroup.selectAll(".circles")
                    .data(circleArray)
                    .enter()
                    .append("circle")
                    .attr("class", "circles")
                    .attr("r", radius*factor) 
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .style("fill", function(d){ return circleColor(d.class)})
                    .style("opacity", 1);

            // Define the tick function to update the circle positions on each tick
            function tick() {
                circles.attr('cx', d => d.x)
                .attr('cy', d => d.y);
            }

            simulation.on(`tick`, tick);

            //draw personal distance for "me" circle
            
            // console.log(redCircle);
            simulation.on("end", function () {
                const redCircle = d3.selectAll(".circles")
            .filter(function() {
                return d3.select(this).style("fill") === "rgb(188, 63, 103)";
            })
            .node();

                const xMe = redCircle.getAttribute("cx");
                const yMe = redCircle.getAttribute("cy");
                console.log(xMe,yMe);
                svgCrowd
                .append("circle")
                .attr("cx", xMe)
                .attr("cy", yMe)
                .attr("r", (outerCircle+radius)*factor)
                .attr("class", "outer")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-opacity", 1)
                .style("stroke-dasharray", "3,5");
            })

        }


        function drawText () {
            //Filter weekday average data
            let weekday = selectedData.filter(function(d) {
                return d.day === "Weekday";
            });

            const insightTextOne = `If you’re traveling <span class="highlight">${weekday[0].direction}</span> on the <span class="highlight">${weekday[0].line}</span> at <span class="highlight">${weekday[0].station}</span> station between <span class="highlight">${weekday[0].time}</span> on an average weekday, our data suggests that it should feel <span class="highlight">${weekday[0].level}</span> when you board the train.`
            d3.select("#textOne").html(insightTextOne);
                
            const insightTextTwo = `About <span class="highlight">${weekday[0].boarding}</span> people will likely be waiting to board with you, and around <span class="highlight">${weekday[0].per}</span> people per car leaving from ${weekday[0].station} station to the next station.`
            d3.select("#textTwo").html(insightTextTwo);
        };

        function drawLollipop () {
            //Filter weekdays data
            let week = selectedData.filter(function(d) {
                return d.day != "Weekday";
            });
            //draw lollipop

            // Add X scale
            var x = d3.scaleLinear()
            .domain([0, perRange.max])
            .range([ marginpop.left , widthpop-marginpop.right]);

            // Y scale
            let y = d3.scaleBand()
            .range([ marginpop.top-80, heightpop-(marginpop.bottom) ])
            .domain(week.map(function(d) { return d.day; }))
            .padding(1);

            // Lines
            var line = svgpop.selectAll(".line")
            .data(week)

            //update
            line
            .transition() 
            .duration(1000)
            .attr("x1", function(d) { return x(d.per); })
            .attr("x2", x(0))
            .attr("y1", function(d) { return y(d.day); })
            .attr("y2", function(d) { return y(d.day); })
            .attr("stroke-width", 3.5)
            .attr("stroke", "#494F5C");

            //enter
            line
            .enter()
            .append("line")
                .attr("class", "line")
                .attr("x1", function(d) { return x(d.per); })
                .attr("x2", x(0))
                .attr("y1", function(d) { return y(d.day); })
                .attr("y2", function(d) { return y(d.day); })
                .attr("stroke-width", 3.5)
                .attr("stroke", "#494F5C");

            //exit 
            line.exit().remove();

            // Circles
            var circle = svgpop.selectAll(".circle")
            .data(week)
            circle
            .transition() 
            .duration(1000)
            .attr("cx", function(d) { return x(d.per); })
            .attr("cy", function(d) { return y(d.day); })
            .attr("r", "15")
            .style("fill", "#69b3a2");
            // .attr("stroke", "black");
            circle
            .enter()
            .append("circle")
                .attr("class", "circle")
                .attr("cx", function(d) { return x(d.per); })
                .attr("cy", function(d) { return y(d.day); })
                .attr("r", "15")
                .style("fill", "#69b3a2");
                // .attr("stroke", "black");
            circle.exit().remove();

        };

        submitButton.addEventListener("click", function() {
            //remove circles s
            d3.selectAll(".circleGroup").remove();
            d3.selectAll(".circles").remove();
            d3.selectAll(".outer").remove();
            
            drawCircles();


            drawText()
            drawLollipop()
            // drawRadial ()

            // tooltip for lollipop
            d3.selectAll(".circle").on("mouseover", function(e,d) {
                let x = (+d3.select(this).attr("cx")) + 20;
                let y = (+d3.select(this).attr("cy")) + 20;

                console.log(x)
                console.log(y)

                popTooltip.style("visibility", "visible")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                .html(`Hi`)

            d3.select(this)
            .attr("fill", "#0072a6")
            .attr("opacity", 1);
            }).on("mouseout", function () {
        
                popTooltip.style("visibility", "hidden");
        
                d3.select(this)
                .attr("fill", "transparent")
                .attr("opacity", 0.8);
            })

        });


    };


})