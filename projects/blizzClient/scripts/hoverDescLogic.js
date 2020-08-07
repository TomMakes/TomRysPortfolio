
function hoverCharNameSetup() {
  // Get the div element to move about
  let infoDiv = document.getElementById("div-information");

  // Set up for when hovering over searched char data
  let char1DataToHover = document.getElementsByClassName("char1-data");
  let char2DataToHover = document.getElementsByClassName("char2-data");
  
  for(let i=0; i< char1DataToHover.length; i++) {
    char1DataToHover[i].onmousemove = function(e) {
      infoDiv.innerHTML = "<p>"+wowClient.char1+"</p>";
      infoDiv.style.left = (parseInt(e.clientX) -0) + "px";
      infoDiv.style.top = (parseInt(e.clientY) - 50 + window.scrollY) + "px";
    }
    char1DataToHover[i].onmouseout = function(e) {
      infoDiv.style.left = "-500px";
    }
  }
  
  for(let i=0; i< char2DataToHover.length; i++) {
    char2DataToHover[i].onmousemove = function(e) {
      infoDiv.innerHTML = "<p>"+wowClient.char2+"</p>";
      infoDiv.style.left = (parseInt(e.clientX) -0) + "px";
      infoDiv.style.top = (parseInt(e.clientY) - 50 + window.scrollY) + "px";
    }
    char2DataToHover[i].onmouseout = function(e) {
      infoDiv.style.left = "-500px";
    }
  }

  // get comparison character data
  let compStat1 = document.getElementById("compPic1");
  compStat1.onmousemove = function(e) {
    infoDiv.innerHTML = "<p>Asmongold</p>";
    infoDiv.style.left = (parseInt(e.clientX) -0) + "px";
    infoDiv.style.top = (parseInt(e.clientY) - 50 + window.scrollY) + "px";
  }
  compStat1.onmouseout = function(e) {
    infoDiv.style.left = "-500px";
  }

  // Tell user what are the available characters to search for in the database
  let search = [ document.getElementById("charName"), document.getElementById("realmName") ];
  for(let i = 0; i < search.length; i++){
    search[i].onmousemove = function(e) {
      infoDiv.innerHTML = '<p>Searchable characters are:</p> <p style="color:gold"> Name : Realm </p>';
      infoDiv.innerHTML += "<p> Dalaran : Uther </p>";
      infoDiv.innerHTML += "<p> Asmongold : Kelthuzad </p>";
      infoDiv.innerHTML += "<p> Dancn : Dalaran </p>";
      infoDiv.style.left = (parseInt(e.clientX) + 150) + "px";
      infoDiv.style.top = (parseInt(e.clientY) - 50 + window.scrollY) + "px";
    }
    search[i].onmouseout = function(e) {
      infoDiv.style.left = "-500px";
    }
  } 
  
}

// Setting up item descriptions
function hoverItemDescriptionSetup(obj, infoDiv) {
  let text = "";
  // Name of item
  text += '<p style="color:'+ getRarityColor(obj.quality.type) +'">';
    text += obj.name;
  text += '</p>';
  // Item special status 
  if(obj.name_description) {
    text += '<p style="color:'+ getRGBColor(obj.name_description.color) +'">';
      text += obj.name_description.display_string;
    text += '</p>';
  }
  // Item level   
  if(obj.level) {
    text += '<p style="color: #E8AE31">';
      text += obj.level.display_string;
    text += '</p>';
  }
  // Item + stats
  if(obj.stats) {
    let stats = obj.stats;
    for(let i = 0; i < stats.length; i++) {
      text += '<p style="color:'+ getRGBColor(stats[i].display.color) +'">';
        text += stats[i].display.display_string;
      text += '</p>';
    }
  }
  // Item durability
  if(obj.durability) {
    text += '<p style="color: #FFFFFF">';
      text += obj.durability.display_string;
    text += '</p>';
  }
  // Item required level
  if(obj.requirements) {
    if(obj.requirements.level) {
      text += '<p style="color: #FFFFFF">';
        text += obj.requirements.level.display_string;
      text += '</p>';
    }
  }
  let targetEl = document.getElementById(obj.item.id);
  targetEl.onmousemove = function(e) {
    infoDiv.innerHTML = text;
    infoDiv.style.left = (parseInt(e.clientX) - infoDiv.offsetWidth - 10) + "px";
    infoDiv.style.top = (parseInt(e.clientY) - 150 + window.scrollY) + "px";
  }
  targetEl.onmouseout = function(e) {
    infoDiv.style.left = "-500px";
  }
}

function hoverSetupCoins() {
  // Get the div element to move about
  let infoDiv = document.getElementById("div-information");
  // Setup for hovering over coins/sale price
  let coinDataToHover = document.getElementsByClassName("coins");

  for(let i=0; i< coinDataToHover.length; i++) {
    coinDataToHover[i].onmousemove = function(e) {
      infoDiv.innerHTML = '<p> Sale Price: <span class="gold">Gold</span>,<span class="silver">Silver</span>,<span class="copper">Copper</span> </p>';
      infoDiv.style.left = (parseInt(e.clientX) -0) + "px";
      infoDiv.style.top = (parseInt(e.clientY) - 50 + window.scrollY) + "px";
    }
    coinDataToHover[i].onmouseout = function(e) {
      infoDiv.style.left = "-500px";
    }
  }
}