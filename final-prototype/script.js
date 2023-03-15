
// Data parse

function parseCsv(d) {
        return {
            id: d.ID,
            station: d.Place,
            boarding: +d.Boardings,
            off: +d.Alightings,
            load: +d.Load,
            time: d.Time, 
            passenger: +d.PasspengerPerCar, 
            crowd: d.Crowd,
            ppsm: +d.PPSM,
        }    
}


d3.csv("./data/sample.csv", parseCsv).then(function(data) {
    console.log(data);

    // drop down 

    const dropdown = d3.select("#dropdown"); // Get the select element

      // Loop through the data and add options to the dropdown
    data.forEach(function(d) {
        const option = dropdown.append("option"); // Create a new option element
        option.text(d.station); // Set the option text to the fruit value
        option.attr("value", d.id); // Set the option value to the id value
    });

    // Add an event listener to the dropdown
    let result = 0; 

    dropdown.on("change", function () {
        selectedId = d3.select(this).property("value"); // Set the selected fruit ID to the value of the selected option

        const selectedOption = d3.select(this).property("value"); // Get the value of the selected option
        const selectedRow = data.find(d => d.id === selectedOption); // Find the row that matches the selected option
        const boardInfo = `You board a southbound <span style="color: orange;">Orange Line</span> at ${selectedRow.station} during ${selectedRow.time} on an average weekday. <br>
        There are likely ${selectedRow.boarding} people board with you. <br>
        You will feel ${selectedRow.crowd} when you board the train, there are about ${selectedRow.passenger} per car leaving at this station.`; // Build a string with the fruit info
        d3.select("#text").html(boardInfo); // Update the fruit info paragraph with the string

        const boardStation = `How corwded is your train when you board at <span style="text-decoration: underline;">${selectedRow.station}</span>`
        d3.select("#boardStation").html(boardStation);
        
        result = selectedRow.passenger;
        doSomethingWithResult(result);
    });


    // draw the me circle first 

    // Draw svg canvas 
    const factor = 10;

    const width = 350;
    const height = 350;

    const svg = d3.select("#chart")
    .append("svg")
    .attr("class","canvas")
    .attr("width", width)
    .attr("height", height)

    // Me circle array

    let meArray = [
        { id: 6, name: 'Object 6', class: `me` }
    ];

    // assign color

    var color = d3.scaleOrdinal()
    .domain(["me", "other"])
    .range(d3.schemeSet1);

    // Draw me circle
    // Create the initial groups
    var groups = svg.selectAll("g")
    .data(meArray)
    .enter()
    .append("g")

    // Within each group, create some elements
    groups.append("circle")
    .attr("r", 0.4*factor)
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("fill-opacity", 1)
    .style("fill", function(d){ return color(d.class)});

    // const simulation = d3.forceSimulation()
    // .force("center", d3.forceCenter().x(width/2).y(height / 2)) // Attraction to the center of the svg area
    // .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    // .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping

    // simulation
    // .nodes(mewArray)
    // .on("tick", function(d){
    // node
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y)
    // });

function doSomethingWithResult(value) {
    // Use the updated value of result here
    console.log("The updated value of result is:", value);

    // create number of passenger according to the passed in value
    var number = Math.round(value);

    // Create new array with updated value and join the me array
    function createArrayOfObjects(num) {
        let arr = [];

        for (let i = 0; i < num; i++) {
        let obj = { id: i + 1, name: `Object ${i + 1}`, class:`other` };
        arr.push(obj);
        }

        return arr;
    }

    let newArray = meArray.concat(createArrayOfObjects(number-1));


    // Join the new data with the existing groups
    var groups = svg.selectAll("g")
    .data(newArray);

    // Create new groups for any new data
    var newGroups = groups.enter()
    .append("g")

    // Update the me circle 

    var me = newArray.filter(d => d.class === "me")[0];
    me.x = d3.mean(newArray.filter(d => d.class !== "me"), d => d.x);
    me.y = d3.mean(newArray.filter(d => d.class !== "me"), d => d.y);

    // Draw circles in new group
    newGroups.append("circle")
    .attr("r", 0.4*factor)
    .attr("cx", function(d) { return d.class === "me" ? me.x : width / 2; })
    .attr("cy", function(d) { return d.class === "me" ? me.y : height / 2; })
    .style("fill-opacity", 1)
    .style("fill", function(d){ return color(d.class)});

    // Remove any groups for data that no longer exists
    groups.exit().remove();

    // Select all the circles within the existing groups
    var circles = svg.selectAll("g circle");

    // Constrain a box for circle 

    // const boxWidth = 800;
    // const boxHeight = 600;
    // const boxMargin = 50;

    // const forceX = d3.forceX().x(function(d) {
    //     return Math.max(boxMargin, Math.min(boxWidth - boxMargin, d.x));
    // });
    // const forceY = d3.forceY().y(function(d) {
    //     return Math.max(boxMargin, Math.min(boxHeight - boxMargin, d.y));
    // });

    // Update the simulation with the new data
    const simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width/2).y(height/2))
    .force("charge", d3.forceManyBody().strength(.5))
    .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1))
    // .force("x", forceX)
    // .force("y", forceY)
    .nodes(newArray)
    .on("tick", function(d){
    circles
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
    }).restart(); // Restart the simulation with the new data
}



//Work on Start to End data subset 


// get unique values from "time" column
const times = [...new Set(data.map(function(d) {
    return d.time;
    }))];

// create time filter drop-down menu
const timeSelect = d3.select("#selection")
    .append("select")
    .attr("id", "column-select");

timeSelect.append("option")
    .text("Select your travel time")
    .attr("value", "")
    .attr("disabled", true)
    .attr("selected", true);

timeSelect.selectAll(".time-option")
    .data(times)
    .enter()
    .append("option")
    .attr("class", "time-option")
    .text(function(d) { return d; })
    .attr("value", function(d) { return d; });



// Draw area chart for selected route 

const marginA = { top: 20, right: 20, bottom: 50, left: 50 };
const widthA = 1000 - marginA.left - marginA.right;
const heightA = 500 - marginA.top - marginA.bottom;

// Create an ordinal scale for the X axis
const x = d3.scaleBand()
.range([0, widthA]);
// .padding(0.1);

// Set the x and y scales
var y = d3.scaleLinear().range([heightA, 0]);

// Define the SVG for area chart
var canvasA = d3.select("#route")
.append("svg")
.attr("width", widthA + marginA.left + marginA.right)
.attr("height", heightA + marginA.top + marginA.bottom)
.append("g")
.attr("transform",
    "translate(" + marginA.left + "," + marginA.top + ")");

    console.log(-marginA.left)


// Event listener to slice data when time selected 

timeSelect.on("change", function() {

    const selectedTime = d3.select(this).property("value"); // Get the selected time from the dropdown
    const slicedDataTime = data.filter(d => d.time === selectedTime); // Filter the data based on the selected time
    resultTime = slicedDataTime;
    doWithSlicedDataTime(resultTime);

    });

// Sumbit time selection result and draw charts


function doWithSlicedDataTime(resultTime) {
    // create start station drop-down menu

    // Remove existing dropdown menus before appending new ones
    d3.selectAll("#start-select, #end-select").remove();

    // get unique values from "station" column
    const stations = [...new Set(resultTime.map(function(d) {
        return d.station;
        }))];

    // create start station drop-down menu
    const startSelect = d3.select("#selection")
    .append("select")
    .attr("id", "start-select");

    // Add default text
    startSelect.append("option")
    .text("Select originating station")
    .attr("value", "")
    .attr("disabled", true)
    .attr("selected", true);

    startSelect.selectAll(".start-station")
        .data(stations)
        .enter()
        .append("option")
        .attr("class", "start-station")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // create end station drop-down menu
    const endSelect = d3.select("#selection")
    .append("select")
    .attr("id", "end-select");

    // Add default text
    endSelect.append("option")
    .text("Select destination station")
    .attr("value", "")
    .attr("disabled", true)
    .attr("selected", true);

    endSelect.selectAll(".end-station")
        .data(stations)
        .enter()
        .append("option")
        .attr("class", "end-station")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    



    // Submit 

    const submitButton = d3.select(".butt");

    submitButton.on("click", function() {

        // get selected values from drop-down menus
        const selectedStart = startSelect.property("value");
        const selectedEnd = endSelect.property("value");

    // slice data based on selected start and end rows

        const startIdx = resultTime.findIndex(d => d.station === selectedStart);
        const endIdx = resultTime.findIndex(d => d.station === selectedEnd);
        const NewslicedData = resultTime.slice(startIdx, endIdx + 1);

        console.log(NewslicedData);


    // update chart 

    function updateAreaChart (newData) {

        

        // Set the domain of the X and Y scales
        x.domain(newData.map(d => d.station));
        y.domain([0, d3.max(newData, d => d.passenger)]);

        // Update the X and Y axes
        canvasA.select(".x-axis")
        .call(d3.axisBottom(x).tickSizeInner(0).tickPadding(0).tickSizeOuter(0));
        canvasA.select(".y-axis")
        .call(d3.axisLeft(y));

        // Define the area generator function
        const area = d3.area()
        .x(d => x(d.station)) // use the category string for the X value
        .y0(heightA) // the bottom of the area is the bottom of the chart
        .y1(d => y(d.passenger)); // the top of the area is based on the Y value



        // // Remove the previous area and line
        canvasA.select(".area").remove();
        canvasA.selectAll(".dot").remove();
        canvasA.selectAll(".x-axis").remove();


        // Add the area and line
        canvasA.append("path")
        .datum(newData)
        .attr("class", "area")
        .attr("fill", "steelblue")
        .attr("d", area);

        // Add the dots 
        canvasA
        .selectAll(".dot")
        .data(newData)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.station))
        .attr("cy", d => y(d.passenger))
        .attr("r", 5);

        // Add x axis 
        
        canvasA.append("g")
        .attr("transform", `translate( -80 , ${heightA} )`)
        .call(d3.axisBottom(x).tickSizeInner(0).tickPadding(3).tickSizeOuter(0))
        .attr("class", "x-axis");


    }

    updateAreaChart(NewslicedData);











    // Draw route chart below 

//     function drawChart(data) {
//         const width = 500;
//         const height = 300;
        
//         // Define the color scale based on categorical data
//         const colorScale = d3.scaleOrdinal()
//             .domain(['Not crowded', 'Not too crowded', 'Crowded', 'Very crowded', 'Can not board'])
//             .range(['#0a9396', '#94d2bd', '#ee9b00', '#ca6702', '#ae2012', '#9b2226']);
        
//             // Create an SVG element and set its size
//             const canvasD = d3.select('#dot')
//             .append('svg')
//             .attr('width', width)
//             .attr('height', height);
        
//             // Create a group element to hold the dots and lines
//             const group = canvasD.append('g');
        
//             // Set the dot radius and line length
//             const r = 4;
//             const lineLength = 50;

//             // Define the spacing between groups of dots and lines
//             const groupSpacing = 60;

//             // Create a group element for each group of dots and lines
//                 const groups = canvasD.selectAll('.group')
//                 .data(data)
//                 .enter()
//                 .append('g')
//                 .attr('transform', (d, i) => `translate(${i * groupSpacing}, 0)`);

//                 // Draw the dots for each group
//                 groups.selectAll('circle')
//                 .data(d => [d]) // Use an array with a single element to bind data to the dot
//                 .enter()
//                 .append('circle')
//                 .attr('cx', 0)
//                 .attr('cy', height / 2)
//                 .attr('r', r)
//                 .attr('fill', d => colorScale(d.crowd))
//                 .append('title')
//                 .text(d => d.station);

//                 // Draw the lines for each group
//                 const line = d3.line()
//                 .x((d, i) => i * lineLength - (r / 2))
//                 .y(height / 2);
//                 groups.selectAll('path')
//                 .data((d, i, nodes) => {
//                 if (i === 0) return [];
//                 const prev = nodes[i - 1].__data__;
//                 return [{source: prev, target: d}];
//                 })
//                 .enter()
//                 .append('path')
//                 .attr('d', d => {
//                 const x1 = (d.source.station.length * r) + (r / 2);
//                 const x2 = (d.target.station.length * r) - (r / 2);
//                 return line([{x: x1, y: height / 2}, {x: x2, y: height / 2}]);
//                 })
//                 .attr('stroke', d => colorScale(d.target.crowd))
//                 .attr('stroke-width', 1)
//                 .attr('fill', 'none');


//         }

//         drawChart(NewslicedData);

});



}



});