// landing page animations

let tl = gsap.timeline({ defaults: { ease: "Power3.easeOut", duration: 2}} ); 

tl.to("#heading", { 'clip-path': 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)', opacity: 1, y: 0, duration: 3})
    .to(".intro-text", { opacity: 1, y: 0,}, "-=3")
    .to("#menu", { opacity: 1, y: 0,}, "-=2.5")
    .to("#begin", { 'clip-path': 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)', opacity:1, duration: 2}, "-=1.5");

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
            level:d.level,
            ppsm:+d.ppsm,
            level:d.level,
            label:d.label
        }    
    }
}

d3.csv("./data/new_ready_data.csv", parseCsv).then(function(data) {

    const submitButton = document.querySelector("#butt");

// determine min and max for "per" variable
    const perRange = {
        min: d3.min(data, function(d) { return d.per; }),
        max: d3.max(data, function(d) { return d.per; })
    };

// append svg for radial bar

    const marginR = {top: 2, right: 10, bottom: 10, left: 5};
    const widthR = document.querySelector("#radial").clientWidth;
    const heightR = document.querySelector("#radial").clientHeight;
    const innerRadius = 130;
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
    const widthT = 9.25; //train width in feet
    const longT = 60; //train long in feet (estimated avaiable long, original is 65)
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

// Create drop down menus 

// get unique values from line column
    const lines = [...new Set(data.map(function(d) {
        return d.line;
        }))];

// create line filter drop-down menu
    const lineSelect = d3.select("#menu")
        .insert('select', '#butt')
        .attr("class", "selector");

    lineSelect.append("option")
        .text("Select line")
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
    .insert('select', '#butt')
    .attr("class", "selector");

    directionSelect.append("option")
    .attr("value", "")
    .text("Select direction")
    .attr("disabled", true)
    .attr("selected", true);

// create station filter drop-down menu
    const stationSelect = d3.select("#menu")
    .insert('select', '#butt')
    .attr("class", "selector");

    stationSelect.append("option")
    .attr("value", "")
    .text("Select station")
    .attr("disabled", true)
    .attr("selected", true);

// create time filter drop-down menu
    const timeSelect = d3.select("#menu")
    .insert('select', '#butt')
    .attr("class", "selector");

    timeSelect.append("option")
    .attr("value", "")
    .text("Select travel time")
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

            var barColor = d3.scaleOrdinal()
            .domain(["Very spacious", "Not crowded", "Moderately crowded", "Crowded", "Very crowded"])
            .range(["#1a9641", "#a6d96a", "#FEE090", "#fdae61", "#d7191c",]);

            // Add bars

            svgradial.selectAll("path")
            .append("g")
            .data(weekdayR)
            .join("path")
            .attr("fill", function(d) { return barColor(d.level)})
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
            .duration(1000) // set the duration of the transition
            .attr("opacity", 0.7)
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
            .text(function(d){return(d.label)})
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
                .html(`<b>Station: </b>${d.station}<br> <b>Travel time: </b>${d.time}<br> <b>Passengers per car: </b>${d.per}<br> <b>Crowd level: </b>${d.level}`)

            d3.select(this)
            .attr("opacity", 1);
            }).on("mouseout", function () {
                tooltipR.style("visibility", "hidden"); 
                d3.select(this)
                .attr("opacity", 0.7);
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
    const marginpop = {top: 30, left: 120, right: 30, bottom: 5};

    var svgpop = d3.select("#lollipop")
        .append("svg")
            .attr("viewBox", `0 0 ${widthpop} ${heightpop}`)
            .attr("preserveAspectRatio", "xMinYMin meet");


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
        .attr("dx", "-0.8rem") // adjust the position of the text element to the right

        

    //tooltip for lollipop
    const popTooltip = d3.select("#lollipop")
        .append("div")
        .attr("class", "tooltipL");

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
                { id: 6.53, name: 'Object 6', class: `me` }
            ];

            function createArrayOfObjects(num) {
                let arr = [];

                for (let i = 0; i < num; i++) {
                let obj = { id: i + 1, name: `Object ${i + 1}`, class:`other`};
                arr.push(obj);
            }
            return arr;
            }

            // theArray = createArrayOfObjects(passengers)
            // console.log(theArray);

            let circleArray = meArray.concat(createArrayOfObjects(passengers))
            console.log(circleArray);

            const circleGroup = svgCrowd.append("g")
                .attr("clsss", "circleGroup")
                .attr("transform", "translate(" + marginC.left + "," + marginC.top + ")");

            var circleColor = d3.scaleOrdinal()
            .domain(["me", "other"])
            .range(["#39B6C0", "#004D79"]);

            //d3 force

            var circleMin = d3.min(circleArray, function(d) { return d.id; });
            var circleMax = d3.max(circleArray, function(d) { return d.id; });

            xScale = d3.scaleLinear()
            .domain([circleMin, circleMax])
            .range([50, widthC-50]);

            function assignRandomVerticalValues(arr) {
                arr.forEach(function(obj) {
                    randomNumber = Math.floor(Math.random() * 4) + 1;
                    obj.vertical = randomNumber + Math.random();
                });
            }

            assignRandomVerticalValues(circleArray)

            console.log(circleArray);

            yScale = d3.scaleLinear()
            .domain([1,5])
            .range([(radius*factor) *2 + 10, heightC-(radius*factor) *2 - 10 ]);

            console.log(xScale(circleMax));

            var simulation = d3.forceSimulation(circleArray)
                .force("repel", d3.forceManyBody().strength(-10))
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
                return d3.select(this).style("fill") === "rgb(57, 182, 192)";
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

        function addStationName () {
            const stationName = `${selectedData[0].station}`
            d3.select("#stationName").html(stationName);
        }


        function drawText () {
            //Filter weekday average data
            let weekday = selectedData.filter(function(d) {
                return d.day === "Weekday";
            });

            const insightTextOne = `If you’re traveling <span class="highlight">${weekday[0].direction}</span> on the <span class="highlight">${weekday[0].line}</span> at <span class="highlight">${weekday[0].station}</span> station between <span class="highlight">${weekday[0].time}</span> on an average weekday, our data suggests that it should feel <span class="highlight">${weekday[0].level}</span> when you board the train.`
            d3.select("#textOne").html(insightTextOne);
                
            const insightTextTwo = `About <span class="highlight">${weekday[0].boarding}</span> people will likely be waiting to board with you, and around <span class="highlight">${weekday[0].per}</span> people in addition to <span id="me">you</span> per car leaving from ${weekday[0].station} station to the next station.`
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

            // color circles 

            var lolColor = d3.scaleOrdinal()
            .domain(["Very spacious", "Not crowded", "Moderately crowded", "Crowded", "Very crowded"])
            .range(["#1a9641", "#a6d96a", "#FEE090", "#fdae61", "#d7191c",]);

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
            .style("fill", function(d) { return lolColor(d.level)});
            // .attr("stroke", "black");
            circle
            .enter()
            .append("circle")
                .attr("class", "circle")
                .attr("cx", function(d) { return x(d.per); })
                .attr("cy", function(d) { return y(d.day); })
                .attr("r", "15")
                .style("fill", function(d) { return lolColor(d.level)});
                // .attr("stroke", "black");
            circle.exit().remove();

        };

        submitButton.addEventListener("click", function() {
            //remove circles s
            d3.selectAll(".circleGroup").remove();
            d3.selectAll(".circles").remove();
            d3.selectAll(".outer").remove();
            
            drawCircles();
            addStationName ();


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
                .html(`<b>Station: </b>${d.station}<br> <b>Travel time: </b>${d.time}<br> <b>Passengers per car: </b>${d.per}<br> <b>Crowd level: </b>${d.level}`)

            d3.select(this)
            .attr("stroke", "#494F5C")
            .attr("stroke-width", "3");
            }).on("mouseout", function () {
        
                popTooltip.style("visibility", "hidden");
        
                d3.select(this)
                .attr("stroke", "none");
            })
            
            // Hide landing section 
            document.getElementById("landing")
            .style.display = "none";


            var hideElements = document.querySelectorAll(".hide");

            hideElements.forEach(function(element) {
                element.style.visibility = "visible";
            });

            // Handle menue position 
            const MenuBar = document.getElementById('bar-start');
            MenuBar.setAttribute('id', 'bar');

        });


    };

    // trip chart

    WeekdayData = data.filter(function(d) {
        return d.day === "Weekday";
    });

    console.log(WeekdayData);

    // create line filter drop-down menu
    const lineSelectTrip = d3.select("#trip-menu")
        .append("select")
        .attr("class", "selector");

    lineSelectTrip.append("option")
        .text("Select line")
        .attr("disabled", true)
        .attr("selected", true);

    lineSelectTrip.selectAll(".line-option")
        .data(lines)
        .enter()
        .append("option")
        .attr("class", "line-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    lineSelectTrip.on("change", function() {

        d3.selectAll("#d-selector").remove();
        d3.selectAll("#t-selector").remove();
        d3.selectAll("#start-select, #end-select").remove();

        const selectedLineTrip = d3.select(this).property("value"); 
        const sliceLineTrip = WeekdayData.filter(d => d.line === selectedLineTrip); 
        console.log(sliceLineTrip);
        doWithLineTrip(sliceLineTrip);

    });

    function doWithLineTrip (sliced) {

        const directions = [...new Set(sliced.map(function(d) {
            return d.direction;
            }))];

        // create direction filter drop-down menu
        const directionSelectTrip = d3.select("#trip-menu")
        .append("select")
        .attr("class", "selector")
        .attr("id", "d-selector");

        directionSelectTrip.append("option")
        // .attr("value", "")
        .text("Select direction")
        .attr("disabled", true)
        .attr("selected", true);

        directionSelectTrip.selectAll(".direction-option")
        .data(directions)
        .enter()
        .append("option")
        .attr("class", "direction-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });


        directionSelectTrip.on("change", function() {

            d3.selectAll("#t-selector").remove();
            d3.selectAll("#start-select, #end-select").remove();
    
            const selectedDTrip = d3.select(this).property("value"); 
            const sliceDTrip = sliced.filter(d => d.direction === selectedDTrip); 
            console.log(sliceDTrip);
            doWithDTrip(sliceDTrip);
        });

    }

    function doWithDTrip (slicedDirection) {
        console.log(slicedDirection);

        // get unique values from "time" column
        const times = [...new Set(slicedDirection.map(function(d) {
            return d.time;
            }))];

        // create time filter drop-down menu
        const timeSelectTrip = d3.select("#trip-menu")
        .append("select")
        .attr("class", "selector")
        .attr("id", "t-selector");

        timeSelectTrip.append("option")
        // .attr("value", "")
        .text("Select travel time")
        .attr("disabled", true)
        .attr("selected", true);

        timeSelectTrip.selectAll(".time-option")
        .data(times)
        .enter()
        .append("option")
        .attr("class", "time-option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });


        timeSelectTrip.on("change", function() {

            d3.selectAll("#start-select, #end-select").remove();
    
            const selectedTTrip = d3.select(this).property("value"); 
            const sliceTTrip = slicedDirection.filter(d => d.time === selectedTTrip); 

            doWithTTrip(sliceTTrip);

            console.log(sliceTTrip);

        });

    }

    const update = drawTrip();

    function doWithTTrip (slicedTime) {
        console.log(slicedTime);
        // get unique values from "station" column
        const stations = [...new Set(slicedTime.map(function(d) {
            return d.station;
            }))];
    
            // start options 
            const startSelect = d3.select("#trip-menu")
            .append("select")
            .attr("class", "selector")
            .attr("id", "start-select");
    
            startSelect.append("option")
            .text("Select departure station")
            .attr("disabled", true)
            .attr("selected", true);
    
            startSelect.selectAll(".start-station")
                .data(stations)
                .enter()
                .append("option")
                .attr("class", "start-station")
                .text(function(d) { return d; })
                .attr("value", function(d) { return d; });
    
            // end options 
    
            const endSelect = d3.select("#trip-menu")
            .append("select")
            .attr("class", "selector")
            .attr("id", "end-select");
    
            endSelect.append("option")
            .text("Select destination station")
            .attr("disabled", true)
            .attr("selected", true);
    
            // Add event listener to startSelect
            startSelect.on("change", function() {
            // Clear existing options
            endSelect.selectAll("option").remove();
            
            // Get the selected start station
            const selectedStart = d3.select(this).property("value");
            
            // Get the index of the selected start station in the stations array
            const startIndex = stations.indexOf(selectedStart);
    
            // Filter stations to only include those below the selected start station
            const filteredStations = stations.slice(startIndex + 1);
    
    
            endSelect.selectAll(".end-station")
                .data(filteredStations)
                .enter()
                .append("option")
                .attr("class", "end-station")
                .text(function(d) { return d; })
                .attr("value", function(d) { return d; });
    
            });
    
            // Submit trip
    
            const submitTrip = document.querySelector("#buttTrip");
    
            
    
            submitTrip.addEventListener("click", function() {
    
                const selectedStart = startSelect.property("value");
                const selectedEnd = endSelect.property("value");

                console.log(selectedStart)
                console.log(selectedEnd)
    
                const startIdx = slicedTime.findIndex(d => d.station === selectedStart);
                const endIdx = slicedTime.findIndex(d => d.station === selectedEnd);
                const trip = slicedTime.slice(startIdx, endIdx+1);

                console.log(trip);

                update(trip)

            });

    }


    // Draw trip chart 

    function drawTrip (data) {

        const marginT = {top: 45, right: 10, bottom: 10, left: 10};
        const widthT = document.querySelector("#trip").clientWidth;
        const heightT = document.querySelector("#trip").clientHeight;

        var svgT = d3.select("#trip")
            .append("svg")
            .attr("viewBox", `0 0 ${widthT} ${heightT}`)
            .attr("preserveAspectRatio", "xMinYMin meet");

        const spacing = 50;
        const rectHeight = 29;
        const rectOffset = 5;
        const startC = 150;
        const diffL = 30;
        const r = 8;

        var colorT = d3.scaleOrdinal()
        .domain(["Very spacious", "Not crowded", "Moderately crowded", "Crowded", "Very crowded"])
        .range(["#1a9641", "#a6d96a", "#FEE090", "#fdae61", "#d7191c",]);

        var scaleT = d3.scaleLinear()
        .domain([perRange.min, perRange.max])
        .range([0, widthT-marginT.right- (marginT.left + startC + 30)]);

         // create a group element to hold the circles and text
        const groupT = svgT.append("g")
        .attr("transform", "translate(50, 50)"); // move the group down and to the right

        // add axis labels 

        svgT.append("text")
            .attr("x", marginT.left + startC + r + 5) 
            .attr("y", 0)
            .attr("text-anchor", "start")
            .attr("class", "labelT")
            .text("Passengers per car leaving from the station (weekday average)")
            .attr("transform", "translate(50, 50)");

        svgT.append("line")
            .attr("x1", marginT.left + startC + r + 5) 
            .attr("x2", widthT-marginT.right- (marginT.left + startC + 30) )
            .attr("y1", 12)
            .attr("y2", 12)
            .attr("stroke", "#494F5C")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2")
            .attr("transform", "translate(50, 50)");

        const update = (newData) => {
            
            // circles
            const circles = groupT.selectAll("circle")
            .data(newData);

            circles.exit()
            .transition()
            .duration(1000)
            .attr("stroke-width", "0px")
            .remove();

            circles.enter()
            .append("circle")
            .attr("cx", marginT.left + startC)
            .attr("r", 0)
            .merge(circles) 
            .attr("fill", "none")
            .attr("stroke-width", "6px")
            .attr("cy", (d, i) => i * spacing + marginT.top)
            .transition()
            .duration(1000)
            .attr("r", r)
            .attr("stroke", function(d) { return colorT(d.level)}); 

            // links
            const rects = groupT.selectAll(".between")
            .data(newData.slice(0,-1)); 

            rects.exit()
                .transition()
                .duration(1000)
                .attr("height", 0)
                .remove();

            rects.enter()
                .append("rect")
                .attr("x", (marginT.left + startC) - r/2 - 1) // offset the rectangles to touch the circles
                .attr("width", 2 * rectOffset)
                .attr("height", 0 )
                .attr("fill", "lightgray")
                .merge(rects) 
                .attr("y", (d, i) => i * spacing + spacing / 2 - rectHeight / 2 + marginT.top)
                .attr("fill", "none")
                .transition()
                .duration(1000)
                .attr("fill", function(d) { return colorT(d.level)})
                .attr("height", rectHeight )
                .attr("class", "between");

            // lines
            const lines = groupT.selectAll(".line")
            .data(newData.slice(0,-1)); 

            lines.exit()
                .transition()
                .duration(1000)
                .attr("width", 0)
                .remove();

            lines.enter()
                .append("rect")
                .attr("x", marginT.left + startC + r + 5) 
                .attr("height", 5 )
                .attr("fill", "#494F5C")
                .merge(lines) 
                .attr("class", "line")
                .attr("y", (d, i) => i * spacing - 3 + marginT.top)
                .transition()
                .delay (250)
                .duration(1500)
                .attr("width", function(d) { return scaleT(d.per)});

            // data label
            const points = groupT.selectAll(".point")
            .data(newData.slice(0,-1)); 

            points.exit()
                .remove();

            points.enter()
                .append("text")
                .attr("y", (d, i) => i * spacing + 4 + marginT.top)
                .merge(points) 
                .attr("x", function(d) { return marginT.left + startC + 20 + scaleT(d.per) })
                .attr("text-anchor", "start")
                .attr("fill", "none")
                .attr("class", "point")
                .transition()
                .delay (1600)
                .duration(1000)
                .text((d) => d.per)
                .attr("fill", "#494F5C"); 

            const labels = groupT.selectAll(".label")
            .data(newData);

            labels.exit()
            .remove();

            // headings
            labels.enter()
            .append("text")
            .attr("x", (marginT.left + startC) - diffL)
            .merge(labels) 
            .attr("y", (d, i) => i * spacing + 5 + marginT.top)
            .attr("text-anchor", "end")
            .text((d) => d.station)
            .attr("fill", "#1C1E23;")
            .attr("font-size", "1rem")
            .attr("class", "label"); 
        };

        // if there is data, update the visualization
        if (data) {
            update(data);
        }

        // return the update function, so it can be called again with new data
        return update;

    };
})