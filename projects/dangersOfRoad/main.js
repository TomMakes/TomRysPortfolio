/* UTILITY FUNCTIONS */

function rand(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function rowConverter(row) {
  //console.log("Rows");
  //console.dir(row.FatalCollisionBillion);
  return {
    State: row.State,
    FatalCollisionBillion: row.FatalCollisionBillion,
    PercentSpeeding: row.PercentSpeeding,
    PercentAlcoholImpaired: row.PercentAlcoholImpaired,
    PercentNotDistracted: row.PercentNotDistracted,
    PercentNewAccidents: row.PercentNewAccidents
  }
}

function setupEventListeners() {
  //Hide them until needed
  document.getElementById("barCatSelect").classList.add("dissapear");
  document.getElementById("backToMap").classList.add("dissapear");
  document.getElementById("barChartInfo").classList.add("dissapear");
  
  
  document.getElementById("barCatSelect").addEventListener("change", function(){
    console.dir(this.value);
    console.dir(selectedState);
    createStackedBarChart(selectedState.State, this.value);
  });
  document.getElementById("barCatSelect").addEventListener("click", function(){
    console.log("Clicked!");
    if(storyStep == 1){
      rollStory2();
    } else {
      document.getElementById("step2NotDistracted").style.opacity = "0.0";
      
      if(storyStep == 2){
        let step2Arr = document.getElementsByClassName('step2');
        for(let i = 0; i < step2Arr.length; i++){
          step2Arr[i].style.opacity = "1.0";
        }
        storyStep = 3;
        setTimeout(function() {
          document.getElementById("step2Back").style.opacity = "1.0";
          
        }, 4000)
      }
    }

  });
  document.getElementById("backToMap").addEventListener("click", function(){
    //Get rid of all bar chart specific items
    document.getElementById("barCatSelect").classList.add("dissapear");
    document.getElementById("backToMap").classList.add("dissapear");
    document.getElementById("barChartInfo").classList.add("dissapear");
    
    //Remove story part 0 from choropleth
    let paras = document.getElementsByClassName('step0');
    while(paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
    
    //Show the choropleth and hide bar chart
    let choro = document.getElementById("choropleth");
    let bar = document.getElementById("barChart");
    bar.style.opacity = "0.0";
    setTimeout(function() {
      choro.style.opacity = "1.0";
      bar.classList.add("dissapear");
      choro.classList.remove("dissapear");
    }, 1000)
    
    if(storyStep == 3) {
      rollStory3();
    }
    else if(storyStep == 4) {
      //remove the other data 
      let paras = document.getElementsByClassName('step4');
      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
    } 
    else {
      paras = document.getElementsByClassName('step0');
      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      paras = document.getElementsByClassName('step1');
      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      paras = document.getElementsByClassName('step1.5');
      while(paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
    }
      
  });
}

function rollStory1() {
  let step1Arr = document.getElementsByClassName('step1');
  for(let i = 0; i < step1Arr.length; i++){
    step1Arr[i].style.opacity = "1.0";
  }
    
  setTimeout(function() {
      document.getElementById("story1Intro3").style.opacity = "1.0";
    }, 8000)
  setTimeout(function() {
      document.getElementById("story1Intro4").style.opacity = "1.0";
    }, 10000)
  setTimeout(function() {
      document.getElementById("story1SelectMe").style.opacity = "1.0";
    }, 11000)
}

function rollStory2() {
  storyStep = 2;
  //remove the other data 
  let paras = document.getElementsByClassName('step1');
  while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  paras = document.getElementsByClassName('step1.5');
  while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  
  //Open the prompt to get more stuff
  document.getElementById("step2NotDistracted").style.opacity = "1.0";
}

function rollStory3() {
  //remove the other data 
  let paras = document.getElementsByClassName('step2');
  while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  paras = document.getElementsByClassName('step2.1');
  while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  
  let step3Arr = document.getElementsByClassName('step3');
  for(let i = 0; i < step3Arr.length; i++){
    step3Arr[i].style.opacity = "1.0";
    step3Arr[i].style.display = "block";
  }
}

function rollStory4() {
  //remove the other data 
  let paras = document.getElementsByClassName('step3');
  while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  
  let step4Arr = document.getElementsByClassName('step4');
  for(let i = 0; i < step4Arr.length; i++){
    step4Arr[i].style.opacity = "1.0";
  }
}

function showMapData(name, mouseLoc) {
  //Get the value that we will be displaying
  value = stateValues.get(name);
  
  let y = mouseLoc[1] + 30; 
  let x = mouseLoc[0] + 230; 

  d3.select('#title').text(name); 
  d3.select('#value').text(value); 

  d3.select('#Info')
    .classed('hidden', false)  // turn 'hidden' class off
    .style('left', x + "px")   // update div's left to bar's x 
    .style('top', y + "px");   // update div's top to bar's y
}

function showBarData(name, mouseLoc) {
  //Get the value that we will be displaying
  for(let i = 0; i < badDriverData.length; i++){
    if(badDriverData[i].State == name){
      value = badDriverData[i][variableCompared];
      break;
    }
  }
  
  let y = mouseLoc[1] + 200; 
  let x = mouseLoc[0] + 350; 

  d3.select('#title').text(variableCompared); 
  d3.select('#value').text(value + '%'); 

  d3.select('#Info')
    .classed('hidden', false)  // turn 'hidden' class off
    .style('left', x + "px")   // update div's left to bar's x 
    .style('top', y + "px");   // update div's top to bar's y
}

/* GLOBAL VARIABLES */
//Used to store the map of value of states and 
//Number of drivers involved in fatal collisions per billion miles
var stateValues;

//The choropleth state features
var stateJSON;

//The data grabbed from the csv
var badDriverData;

//The selected state
var selectedState;

//The selected variable to compare between states
var variableCompared;

//Story Telling Steps
var storyStep = 0;


/* VISUALIZATION CODE */

function createChoropleth(dataset, stateValues) {
  let w = 1200, h = 900;
  let svg = d3.select("#choropleth")
              .attr('width', w)
              .attr('height', h);

  // 2. Define a map projection
	let projection = d3.geoAlbersUsa()
								   .translate([w/2, h/2])
                                   .scale([1200]);

  // 3. Define a path generator using the projection
  let path = d3.geoPath()
            .projection(projection);
							 
  // 4. Create a color scale to use for the fill
  let color = d3.scaleQuantize()
            .range(["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]);


  //Set input domain for color scale
  let sValues = Array.from(stateValues.values()); // grab values from Map object and put into an array
  //color.domain(d3.extent(sValues));
  
  let sIntValues = [];
  for (var i = 0; i < sValues.length; i++) {
    sIntValues.push(parseFloat(sValues[i]));
  }
  console.dir(sValues);
  color.domain([
    d3.min(sValues, function(d) { return d; }),
    d3.max(sValues, function(d) { return d; })
  ]);

  // 5. Draw the map using SVG path elements, styling with fill values
  // from our color scale

  //Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
      .data(dataset.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .style("fill", d => {
        //Get data value
        let value = stateValues.get(d.properties.name);
        
        if (value) {
          //If value exists…
          //return "#fff";
          return color(value);
        } else {
          //If value is undefined…
          return "#000";
        }
      })
      .on('click', function(d) {
        d3.select(this)
          .classed('selected', !d3.select(this).classed('selected'))
        if(d3.select(this).classed('selected'))
          {
            d3.select(this)
              .style("stroke", "black")
              .style("stroke-width", 2)
          }
        else {
          /*d3.select(this)
            .style("stroke", "white")
            .style("stroke-width", 1) */
        }
        selectedState = d3.select(this);
        //Figure out if user is following the story line
        if(selectedState._groups[0][0].__data__.properties.name == "Ohio" && storyStep == 0) {
          storyStep++;
          console.log("StoryStep");
          console.log(storyStep);
          rollStory1();
        }
        else {
          
          if(selectedState._groups[0][0].__data__.properties.name == "Texas" && storyStep == 3) {
            storyStep = 4;
            rollStory4();
          } 
          else {
            storyStep = 100;
            console.log("StoryStep");
            console.log(storyStep);
          }
        }
        //Start the transition to bar graph
        document.getElementById("barCatSelect").selectedIndex = "PercentSpeeding";
        let choro = document.getElementById("choropleth");
        choro.style.opacity = "0.0";
        setTimeout(function() {
          choro.classList.add("dissapear");
          createStackedBarChart(selectedState._groups[0][0].__data__.properties.name, "PercentSpeeding");
        }, 1000)
        //console.dir(selectedState);
        //console.dir(selectedState._groups[0][0].__data__.properties.name);
      })
      .on('mouseover', function(d) {
        d3.select(this)
          .transition('hovered')
          .style('fill-opacity', '0.5');
        //showBarData(d, d3.select(this));
      }) 
      .on('mouseout', function(d) {
        d3.select(this)
          .transition('hovered')
          .style('fill-opacity', '1.0');
        d3.select('#Info')
          .classed('hidden', true);
        //.transition('hovered')
        
      })
      .on("mousemove", function(d) {
        const throwArray = d3.mouse(this);
        //Show the map's data which is the name and the fatal collision value and mouse location
        showMapData(d3.select(this)._groups[0][0].__data__.properties.name, throwArray);
      })
      ;
  
  //Make the Chart Heading
  svg.append('text')
    .attr('class', 'choroplethTitle')
    .attr('text-anchor', 'middle')
    .style("font", "25px times")
    .attr('x', (h/2+130))
    .attr('y', 160)
    .text('Number of drivers involved in fatal collisions per billion miles traveled in state');
  
  if (storyStep == 0) {
    console.log("StoryStep");
    console.log(storyStep);
    svg.append('text')
    .attr('class', 'step0')
    .attr('x', (h/2-200))
    .attr('y', 50)
    .text('This is a story in which we examine the most dangerous and safest states to drive in.');
    
    svg.append('text') 
    .attr('class', 'step0')
    .attr('x', (h/2-300))
    .attr('y', 75)
    .text('The choropleth displays data from 2012, generated by the National Highway Traffic Safety Administration (NHTSA).');
    
    svg.append('text') 
    .attr('class', 'step0')
    .attr('x', (h/2-0))
    .attr('y', 210)
    .text('Lets first take a look at a semi safe state, like this one here.');
    
    svg.append('text')
    .attr('class', 'step0')
    .attr('x', (-h/2+360))
    .attr('y', 900)
    .attr('transform', 'rotate(-75)')
    .attr('text-anchor', 'middle')
    .text('__________________')
    
    svg.append('text')
    .attr('class', 'step0')
    .style('fill', 'darkOrange')
    .attr('x', (h/2+100))
    .attr('y', 750)
    .attr('text-anchor', 'middle')
    .text('Click any other state to turn off story')
  } else {
    
  }
  
  
  //Make the legend for the map

var ordinal = d3.scaleOrdinal()
  .domain(["5.9 to 7.9", "8 to 9.9", "10 to 11.9", "12 to 13.9", "14 to 15.9", "16 to 17.9", "18 to 19.9", "20 to 21.9", "22 to 23.9"])
  .range(["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]);

svg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20,220)");

var legendOrdinal = d3.legendColor()
  .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
  .shapePadding(3)
  .title("Number of Drivers")
  .titleWidth(180)
  .scale(ordinal);

svg.select(".legendOrdinal")
  .call(legendOrdinal);
          
}


function createStackedBarChart(state, variableToCompare) {
  //Loop through to see which state was selected
  console.log(state);
  //make variables for the worst and best comparisons
  var lowerState;
  var upperState;
  
  //Show the bar chart stuff
  document.getElementById("barCatSelect").classList.remove("dissapear");
  document.getElementById("backToMap").classList.remove("dissapear");
  document.getElementById("barChartInfo").classList.remove("dissapear");
  

  for(let i = 0; i < badDriverData.length; i++) {
    if(state == badDriverData[i].State)
      {
        selectedState = badDriverData[i];
      }
  }
  
  //check which catagory was selected and grab specific data for it
  //For this sample, assume it is PercentSpeeding
  variableCompared = variableToCompare;
  console.log("Showing data for percent speeding");
  console.dir(badDriverData);
  for(let i = 0; i < badDriverData.length-1; i++) {
    
    //set a baseline for comparison
    if(i == 0){
      lowerState = badDriverData[i];
      upperState = badDriverData[i];
    }
    
    //find the lowest
    if(lowerState[variableCompared] > badDriverData[i][variableCompared]){
      lowerState = badDriverData[i];
      console.log("Tested for new accidents");
      console.dir(lowerState);
    }
    
    if(variableCompared == "PercentNewAccidents"){
      console.log("Not distracted Triggered");
      lowerState = badDriverData[17];
      upperState = badDriverData[7];
      break;
    }
    
    //Find the greatest
    if(badDriverData[i][variableCompared] > upperState[variableCompared]){
      upperState = badDriverData[i];

    }
  }
  
  console.dir(lowerState);
  console.dir(upperState);
  
  //Turn the FatalCollisionBillion into a stackable form
  let lowerStackableCollision = lowerState.FatalCollisionBillion - (lowerState[variableCompared]*0.01*lowerState.FatalCollisionBillion);
  let selectedStackableCollision = selectedState.FatalCollisionBillion - (selectedState[variableCompared]*0.01*selectedState.FatalCollisionBillion);
  let upperStackableCollision = upperState.FatalCollisionBillion - (upperState[variableCompared]*0.01*upperState.FatalCollisionBillion);
  
  // dataset for this stacked bar chart
  let dataset = [
      {State: lowerState.State, FatalCollisionBillion: lowerStackableCollision, 
       PercentAlcoholImpaired: (lowerState.PercentAlcoholImpaired*0.01*lowerState.FatalCollisionBillion),
       PercentNewAccidents: (lowerState.PercentNewAccidents*0.01*lowerState.FatalCollisionBillion),
       PercentNotDistracted: (lowerState.PercentNotDistracted*0.01*lowerState.FatalCollisionBillion),
       PercentSpeeding: (lowerState.PercentSpeeding*0.01*lowerState.FatalCollisionBillion)}, 
      {State: selectedState.State, FatalCollisionBillion: selectedStackableCollision, 
       PercentAlcoholImpaired: (selectedState.PercentAlcoholImpaired*0.01*selectedState.FatalCollisionBillion),
       PercentNewAccidents: (selectedState.PercentNewAccidents*0.01*selectedState.FatalCollisionBillion),
       PercentNotDistracted: (selectedState.PercentNotDistracted*0.01*selectedState.FatalCollisionBillion),
       PercentSpeeding: (selectedState.PercentSpeeding*0.01*selectedState.FatalCollisionBillion)}, 
      {State: upperState.State, FatalCollisionBillion: upperStackableCollision, 
       PercentAlcoholImpaired: (upperState.PercentAlcoholImpaired*0.01*upperState.FatalCollisionBillion),
       PercentNewAccidents: (upperState.PercentNewAccidents*0.01*upperState.FatalCollisionBillion),
       PercentNotDistracted: (upperState.PercentNotDistracted*0.01*upperState.FatalCollisionBillion),
       PercentSpeeding: (upperState.PercentSpeeding*0.01*upperState.FatalCollisionBillion)}];

  let stack = d3.stack()
                      .keys([variableCompared, 'FatalCollisionBillion']); 
  let stackedData = stack(dataset);

  console.table(stackedData);
  console.dir(dataset);
  
  //Clean out old svg data
  document.getElementById("barChart").innerHTML= '';
  document.getElementById("barChart").style.opacity = "1.0";
  if(document.getElementById("barChart").classList.contains("dissapear"))
      document.getElementById("barChart").classList.remove("dissapear");

  // SVG size of chart
  let w = 600;
  let h = 500;

  // create our SVG element
  let svg = d3
    .select("#barChart")
    .attr("width", w)
    .attr("height", h);

  // create a scale for y-axis
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d.FatalCollisionBillion + d[variableCompared] )])
    .range([h - 40, 20]);


  let xScale = d3.scaleBand()
    .domain(dataset.map((d) => d.State))
    .range([60, w - 20]);


  // use a color scale for the bar colors
  // ordinal scales created given an array of output range values
  // usually used by giving input indices into array 
  let cScale = d3.scaleOrdinal()
	           .domain(stackedData)
	           .range(['#980043', '#b78d9f']);
            //.range(["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]);
  
  
  let groups = 
    svg.selectAll('g')
        .data(stackedData)
        .enter()
        .append('g')
          .style('fill', (d, i) => cScale(i));

  let barlen = (w - 40) / dataset.length - 20;

  groups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
      .attr('x', (d, i) => xScale(d.data.State))
      .attr('y', d => yScale(d[1]))
      .attr('width', barlen)
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr("class", function(d){   
                return d.data.State;
            })
      .on('mouseover', function(d) {
        d3.selectAll(document.getElementsByClassName(d.data.State))
          .transition('hovered')
          .style('fill-opacity', '0.8');
        console.dir(d3.select(this)._groups[0][0].__data__.data.State);
        
        //showBarData(d, d3.select(this));
      }) 
      .on('mouseout', function(d) {
        d3.selectAll(document.getElementsByClassName(d.data.State))
          .transition('hovered')
          .style('fill-opacity', '1.0');
        d3.select('#Info')
          .classed('hidden', true);
        //.transition('hovered')
      })
      .on("mousemove", function(d) {
        const throwArray = d3.mouse(this);
        //Show the map's data which is the name and the fatal collision value and mouse location
        showBarData(d3.select(this)._groups[0][0].__data__.data.State, throwArray);
      })
      ;

  // AXES
  console.log(xScale(dataset[2].State));
  // create our x-axis and customize look with .ticks() and
  // .tickFormat()
  let xAxis = d3
    .axisBottom(xScale)
    .ticks(dataset.length + 1);
  let xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0, ${h - 40})`)
    .style("font", "16px times")
    .call(xAxis);

  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = svg
    .append("g")
    .attr("transform", `translate(60, 0)`)
    .call(yAxis);


  // AXES LABELS

  svg.append('text')
    .classed('axis-label', true)
    .attr('transform', 'rotate(-90)')
    .attr('x', -h/2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text('Number of drivers involved in fatal collisions')
    
  /*svg.append('text')
    .classed('axis-label', true)
    .attr('x', w/2)
    .attr('y', h - 5)
    .attr('text-anchor', 'middle')
    .text('2018') */
          
}

          
        


// load the state GeoJSON data

d3.json('us-states.json').then((json) => {
  let randMin = 10, randMax = 10000;
  let dataCounter = -1;
  console.log(json);
  stateJSON = json;

  // Make a second array with the state names and with rand data
  // We're using this as mock data. In a real scenario, you would 
  // probably load this data from elsewhere (e.g., CSV)
  
  //Starting to load in data and logging it to see how it behaves
  d3.csv('bad-driversSimplified.csv', rowConverter)
    .then((driverData) => {
    badDriverData = driverData;
    console.dir(badDriverData);
    let states = stateJSON.features.map(d => { 
      dataCounter++;
      
      if(dataCounter == 51){ //|| dataCounter == 2 Used to locate specific countries
        return {
          state: d.properties.name, 
          value: undefined
        }
      }
      return {
        state: d.properties.name, 
        value: driverData[dataCounter].FatalCollisionBillion, //rand(randMin, randMax)
      }
    }); 
    
    console.log("States");
    console.dir(states);
    console.log("State Values");
    
    stateValues = new Map(states.map(d => [d.state, parseFloat(d.value)]));
    console.log(stateValues);
    //Make event listeners for buttons and selections
    setupEventListeners();
    createChoropleth(stateJSON, stateValues);
  });
});

