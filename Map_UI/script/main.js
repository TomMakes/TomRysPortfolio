var firstImage = "images/Current/overall.png";
var secondImage = "images/Current/overall.png";
var circleToPosition;
var positionsOfCircle = [650, 860, 1095];
var positionsOfCircle2 = [675, 905, 1130];
var pulseImageIds = 15;
var bodyHTML;
var lastPage;


function drawLine(lineId, textId, i) {
  var line = document.getElementById(lineId);
  var lineLength = line.getTotalLength();
  var text = document.getElementById(textId);
  if(text.style.opacity == '1') {
    return;
  }
  if(i === undefined) {
    console.log(lineLength);
    i = lineLength;
    $('#' + lineId).css('stroke-dasharray',lineLength);
  }
    
  $('#' + lineId).css('stroke-dashoffset',i);
  if(i > 1){
    i = i - 10;
    setTimeout(function(){drawLine(lineId, textId, i)}, 50);
  } else if (i < 10 && i > 5) {
    i = i - 1;
    setTimeout(function(){drawLine(lineId, textId, i)}, 50);
  } else {
    console.log("Doign the thing " + text.width / 0.6);
    text.style.width = text.width / 0.6 + 'px';
    text.style.opacity = '1';
    text.style.filter  = 'alpha(opacity=100)';
  }
}

function indicatorCircleMove(position, i) {
  if(i === undefined) {
    i = 2;
    // $('#' + "yearSvgCircle").css('cx',position);
    document.getElementById("yearSvgCircle").setAttribute('cx',position);
  }
  document.getElementById("yearSvgCircle").setAttribute('r',i);
  
  if(i < 19){
    i = i + 2;
    setTimeout(function(){indicatorCircleMove(position, i)}, 25);
  }
}

function pulse(i) {
  // if this is the first time it has been run, make sure i is given a value
  if(i === undefined) {
    i = 0;
  }
  // Loop through and set each instance of a pulse to the desired image
  for(let pImage=0; pImage < pulseImageIds; pImage++) {
    if(i < 10) {
      document.getElementById('pulse' + pImage).src = "images/PulseImg/ShapeLayerComp1_0000" + i + ".png";
    } else { 
      document.getElementById('pulse' + pImage).src = "images/PulseImg/ShapeLayerComp1_000" + i + ".png";
    }
  }
  // Make sure that i didn't reach the end and might give error
  if(i == 40) {
    // Set i equal to 0
    i = 0;
  } else {
    // Otherwise increase by one
    i++;
  }
  // Send the next update in 50milliseconds
  setTimeout(function(){pulse(i)}, 50);
}

function typeWriterEffect( id, contents, i) {
  if(i === undefined) {
     i = 0;
  }
   //console.log(i);
   //console.log(id + ": " + $("#"+id).html());
  if($("#"+id).html() === contents) {
    return;
  }
  if(i == 0) {
      $("#"+id).html("");
  }
  if (i < contents.length) {
    document.getElementById(id).innerHTML += contents.charAt(i);
    i++;
    setTimeout(function(){typeWriterEffect(id,contents, i)}, 25);
  }
}

// Ideas for image comparison
// https://online-image-comparison.com/result
// https://github.com/imgly/rembrandt

function changeImage(buttonType) {

  // Set the button clicked as the current one
  if(buttonType != "year2020" && buttonType != "year2030" && buttonType != "year2040") {
    // Set all of the buttons to not selected
    $(":button").removeClass("selected");
    
    $("#"+buttonType).addClass("selected");
  }
  else {
    $(":button").removeClass("selectedYear");
    $("#"+buttonType).addClass("selectedYear");
  }
  
  // Change the description of what is being displayed.
  if(buttonType == "year2020") {
    typeWriterEffect( "displayYear", "2020");
    typeWriterEffect( "displayType", "Overall");
    cycleImage("images/Current/overall.png");
    showTypeMenu();
    indicatorCircleMove(positionsOfCircle2[0]);
    $(":button").removeClass("selected");
    
    $("#overall").addClass("selected");
    //circleToPosition.style.left = positionsOfCircle[0] + "px";
  } else if(buttonType == "year2030") {
    typeWriterEffect( "displayYear", "2030");
    typeWriterEffect( "displayType", "Overall");
    cycleImage("images/Future/map-2030-01.png");
    hideTypeMenu();
    indicatorCircleMove(positionsOfCircle2[1]);
    //circleToPosition.style.left = positionsOfCircle[1] + "px";
  } else if(buttonType == "year2040") {
    typeWriterEffect( "displayYear", "2040");
    typeWriterEffect( "displayType", "Overall");
    cycleImage("images/Future/map-2040-01.png");
    hideTypeMenu();
    indicatorCircleMove(positionsOfCircle2[2]);
    //circleToPosition.style.left = positionsOfCircle[2] + "px";
  } else if(buttonType == "oil") {
    typeWriterEffect( "displayYear", "Current water scarcity");
    typeWriterEffect( "displayType", "Oil & Gas");
    $("#timeLineMain").attr("src","images/Current/OilAndGas.png");
  } else if(buttonType == "FoodAndBeverage") {
    typeWriterEffect( "displayYear", "Current water scarcity");
    typeWriterEffect( "displayType", "Industrial");
    $("#timeLineMain").attr("src","images/Current/FoodAndBeverage.png");
  } else {
    typeWriterEffect( "displayYear", "Current water scarcity");
    typeWriterEffect( "displayType", $("#"+buttonType).html());
    $("#timeLineMain").attr("src","images/Current/" + buttonType + ".png");
	//cycleImage("images/Current/" + buttonType + ".png");
  }
}

function cycleImage(image) {
 $("#timeLineMain2").attr("src",image);
 document.getElementById("timeLineMain").style.opacity = "0.0"; 
    
  setTimeout(function(){
    $("#timeLineMain").attr("src",image);
    document.getElementById("timeLineMain").style.opacity = "1"; 
    
      
  }, 500);
}

function hideTypeMenu() {
  document.getElementById("scarcityTypeMenu").style.opacity = 0;
  setTimeout(function(){
    document.getElementById("scarcityTypeMenu").style.display = "none";
  }, 500);
}

function showTypeMenu() {
  document.getElementById("scarcityTypeMenu").style.display = "block";
  document.getElementById("scarcityTypeMenu").style.opacity = 1;
}

function displayPulses(category) {
  // Hide al of the images first to make it easier
  for(let pImage=0; pImage < pulseImageIds; pImage++) {
    document.getElementById('pulse' + pImage).style.display = "none";
  }
  document.getElementById('agricultureAfrica').style.display = "none";
  document.getElementById('agricultureUS').style.display = "none";
  document.getElementById('agricultureIndia').style.display = "none";
  document.getElementById('agricultureChina').style.display = "none";
  document.getElementById('agriculturePeru').style.display = "none";
  document.getElementById('agriAfricaLine').style.display = "none";
  document.getElementById('agriUSLine').style.display = "none";
  document.getElementById('agriIndiaLine').style.display = "none";
  document.getElementById('agriChinaLine').style.display = "none"; 
  document.getElementById('agriPeruLine').style.display = "none";
  
  document.getElementById('electricAfrica').style.display = "none";
    document.getElementById('electricUS').style.display = "none";
    document.getElementById('electricIndia').style.display = "none";
    document.getElementById('electricChina').style.display = "none";
    document.getElementById('electricAfricaLine').style.display = "none";
    document.getElementById('electricUSLine').style.display = "none";
    document.getElementById('electricIndiaLine').style.display = "none";
    document.getElementById('electricChinaLine').style.display = "none"; 
  
  document.getElementById('oilAfrica').style.display = "none";
    document.getElementById('oilIndia').style.display = "none";
    document.getElementById('oilChina').style.display = "none";
    document.getElementById('oilAfricaLine').style.display = "none";
    document.getElementById('oilIndiaLine').style.display = "none";
    document.getElementById('oilChinaLine').style.display = "none"; 
  
  document.getElementById('industrialUS').style.display = "none";
    document.getElementById('industrialIndia').style.display = "none";
    document.getElementById('industrialChina').style.display = "none";
    document.getElementById('industrialUSLine').style.display = "none";
    document.getElementById('industrialIndiaLine').style.display = "none";
    document.getElementById('industrialChinaLine').style.display = "none"; 
  
  if(category == "agriculture") {
    for(let pImage=0; pImage < 5; pImage++) {
      document.getElementById('pulse' + pImage).style.display = "inline";
    }
    document.getElementById('agricultureAfrica').style.display = "block";
    document.getElementById('agricultureUS').style.display = "block";
    document.getElementById('agricultureIndia').style.display = "block";
    document.getElementById('agricultureChina').style.display = "block";
    document.getElementById('agriculturePeru').style.display = "block";
    document.getElementById('agriAfricaLine').style.display = "block";
    document.getElementById('agriUSLine').style.display = "block";
    document.getElementById('agriIndiaLine').style.display = "block";
    document.getElementById('agriChinaLine').style.display = "block"; 
    document.getElementById('agriPeruLine').style.display = "block";
  }
  if(category == "electric") {
    for(let pImage=5; pImage < 9; pImage++) {
      document.getElementById('pulse' + pImage).style.display = "inline";
    }
    document.getElementById('electricAfrica').style.display = "block";
    document.getElementById('electricUS').style.display = "block";
    document.getElementById('electricIndia').style.display = "block";
    document.getElementById('electricChina').style.display = "block";
    document.getElementById('electricAfricaLine').style.display = "block";
    document.getElementById('electricUSLine').style.display = "block";
    document.getElementById('electricIndiaLine').style.display = "block";
    document.getElementById('electricChinaLine').style.display = "block"; 
  }
  if(category == "oil") {
    for(let pImage=9; pImage < 12; pImage++) {
      document.getElementById('pulse' + pImage).style.display = "inline";
    }
    document.getElementById('oilAfrica').style.display = "block";
    document.getElementById('oilIndia').style.display = "block";
    document.getElementById('oilChina').style.display = "block";
    document.getElementById('oilAfricaLine').style.display = "block";
    document.getElementById('oilIndiaLine').style.display = "block";
    document.getElementById('oilChinaLine').style.display = "block"; 
  }
  if(category == "industrial") {
    for(let pImage=12; pImage < 15; pImage++) {
      document.getElementById('pulse' + pImage).style.display = "inline";
    }
    document.getElementById('industrialUS').style.display = "block";
    document.getElementById('industrialIndia').style.display = "block";
    document.getElementById('industrialChina').style.display = "block";
    document.getElementById('industrialUSLine').style.display = "block";
    document.getElementById('industrialIndiaLine').style.display = "block";
    document.getElementById('industrialChinaLine').style.display = "block"; 
  }
}

/* const rembrandt = new Rembrandt({
  // `imageA` and `imageB` can be either Strings (file path on node.js,
  // public url on Browsers) or Buffers
  imageA: firstImage,
  imageB: secondImage,

  // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
  thresholdType: Rembrandt.THRESHOLD_PERCENT,

  // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
  maxThreshold: 0.01,

  // Maximum color delta (0...255):
  maxDelta: 20,

  // Maximum surrounding pixel offset
  maxOffset: 0,

  renderComposition: true, // Should Rembrandt render a composition image?
  compositionMaskColor: Rembrandt.Color.BLUE // Color of unmatched pixels
});

// Run the comparison
rembrandt.compare()
  .then(function (result) {
    console.log('Passed:', result.passed);
    console.log('Pixel Difference:', result.differences, 'Percentage Difference', result.percentageDifference, '%');
    console.log('Composition image buffer:', result.compositionImage);
    $("#timeLineMain").attr("src",result.compositionImage);

    // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
  })
  .catch((e) => {
    console.error(e)
  }); */

function checkLastPage() {
  if(lastPage == 0) {
    changeImage("overall"); displayPulses("overall");
  }
  if(lastPage == 1) {
    changeImage("agriculture"); displayPulses("agriculture");
  }
  if(lastPage == 2) {
    changeImage("FoodAndBeverage"); displayPulses("industrial");
  }
  if(lastPage == 3) {
    changeImage("electric"); displayPulses("electric");
  }
  if(lastPage == 4) {
    changeImage("oil"); displayPulses("oil");
  }
  if(lastPage == 5) {
    changeImage("year2020"); displayPulses("overall");
  }
  if(lastPage == 6) {
    changeImage("year2030"); displayPulses("year2020");
  }
  if(lastPage == 7) {
    changeImage("year2040"); displayPulses("year2020");
  }
}

function doTheThing() {
      document.getElementById("hi").innerHTML = bodyHTML;
      getEventListeners();
      checkLastPage();
}

function getEventListeners() {
  //bodyHTML = document.getElementById("hi").innerHTML;
  
  document.getElementById("overall").onclick =     function() 
    {  lastPage = 0; 
    doTheThing(); };
  document.getElementById("agriculture").onclick = function() 
    {  lastPage = 1;
     doTheThing(); };
  document.getElementById("FoodAndBeverage").onclick =  function() 
    { lastPage = 2; doTheThing(); };
  //document.getElementById("chemicals").onclick =   function() 
  //  { changeImage("chemicals"); displayPulses("chemicals"); };
  document.getElementById("electric").onclick =    function() 
    { lastPage = 3; doTheThing(); };
  document.getElementById("oil").onclick =         function() 
    { lastPage = 4; doTheThing(); };
  
  document.getElementById("year2020").onclick = function() 
    { changeImage("year2020"); displayPulses("overall"); };
  document.getElementById("year2030").onclick = function() 
    { changeImage("year2030"); displayPulses("year2020"); };
  document.getElementById("year2040").onclick = function() 
    { changeImage("year2040"); displayPulses("year2020"); };
  
  document.getElementById("pulse0").onclick = function() { drawLine("agriAfricaLine", "agricultureAfrica"); };
  document.getElementById("pulse1").onclick = function() { drawLine("agriUSLine", "agricultureUS"); };
  document.getElementById("pulse2").onclick = function() { drawLine("agriIndiaLine", "agricultureIndia"); };
  document.getElementById("pulse3").onclick = function() { drawLine("agriChinaLine", "agricultureChina"); };
  document.getElementById("pulse4").onclick = function() { drawLine("agriPeruLine", "agriculturePeru"); };
  document.getElementById("pulse5").onclick = function() { drawLine("electricUSLine", "electricUS");  };
  document.getElementById("pulse6").onclick = function() { drawLine("electricAfricaLine", "electricAfrica");  };
  document.getElementById("pulse7").onclick = function() { drawLine("electricIndiaLine", "electricIndia");  };
  document.getElementById("pulse8").onclick = function() { drawLine("electricChinaLine", "electricChina");  };
  document.getElementById("pulse9").onclick = function() { drawLine("oilAfricaLine", "oilAfrica");  };
  document.getElementById("pulse10").onclick = function() { drawLine("oilIndiaLine", "oilIndia");  };
  document.getElementById("pulse11").onclick = function() { drawLine("oilChinaLine", "oilChina");  };
  document.getElementById("pulse12").onclick = function() { drawLine("industrialUSLine", "industrialUS");  };
  document.getElementById("pulse13").onclick = function() { drawLine("industrialIndiaLine", "industrialIndia");  };
  document.getElementById("pulse14").onclick = function() { drawLine("industrialChinaLine", "industrialChina");  };
  
  circleToPosition = document.getElementById("yearIndicator");
  
  
  console.log("All things loaded");
}


window.onload = function() {
  
  
  document.getElementById("overall").onclick =     function() 
    { lastPage = 0; 
      doTheThing(); };
  document.getElementById("agriculture").onclick = function() 
    { lastPage = 1;
      doTheThing(); };
  document.getElementById("FoodAndBeverage").onclick =  function() 
    { lastPage = 2; doTheThing(); };
  //document.getElementById("chemicals").onclick =   function() 
  //  { changeImage("chemicals"); displayPulses("chemicals"); };
  document.getElementById("electric").onclick =    function() 
    { lastPage = 3; doTheThing();  };
  document.getElementById("oil").onclick =         function() 
    { changeImage("oil"); displayPulses("oil"); };
  
  document.getElementById("year2020").onclick = function() 
    { changeImage("year2020"); displayPulses("year2020");  };
  document.getElementById("year2030").onclick = function() 
    { changeImage("year2030"); displayPulses("year2020"); };
  document.getElementById("year2040").onclick = function() 
    { changeImage("year2040"); displayPulses("year2020"); };
  
  document.getElementById("pulse0").onclick = function() { drawLine("agriAfricaLine", "agricultureAfrica"); };
  document.getElementById("pulse1").onclick = function() { drawLine("agriUSLine", "agricultureUS"); };
  document.getElementById("pulse2").onclick = function() { drawLine("agriIndiaLine", "agricultureIndia"); };
  document.getElementById("pulse3").onclick = function() { drawLine("agriChinaLine", "agricultureChina"); };
  document.getElementById("pulse4").onclick = function() { drawLine("agriPeruLine", "agriculturePeru"); };
  document.getElementById("pulse5").onclick = function() { drawLine("electricUSLine", "electricUS");  };
  document.getElementById("pulse6").onclick = function() { drawLine("electricAfricaLine", "electricAfrica");  };
  document.getElementById("pulse7").onclick = function() { drawLine("electricIndiaLine", "electricIndia");  };
  document.getElementById("pulse8").onclick = function() { drawLine("electricChinaLine", "electricChina");  };
  document.getElementById("pulse9").onclick = function() { drawLine("oilAfricaLine", "oilAfrica");  };
  document.getElementById("pulse10").onclick = function() { drawLine("oilIndiaLine", "oilIndia");  };
  document.getElementById("pulse11").onclick = function() { drawLine("oilChinaLine", "oilChina");  };
  document.getElementById("pulse12").onclick = function() { drawLine("industrialUSLine", "industrialUS");  };
  document.getElementById("pulse13").onclick = function() { drawLine("industrialIndiaLine", "industrialIndia");  };
  document.getElementById("pulse14").onclick = function() { drawLine("industrialChinaLine", "industrialChina");  };
  
  circleToPosition = document.getElementById("yearIndicator");
  
  pulse();
  
  console.log("All things loaded");
  // Save the HTML
  bodyHTML = document.getElementById("hi").innerHTML;
}