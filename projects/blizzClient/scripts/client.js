'use strict';

var wowClient = {
  char1: "No Data",
  char2: "",
  token: null
};
  
window.onload = () => {
  // Make sure no incorrect attributes get added onto wowClient on running
  Object.preventExtensions(wowClient);

  formSetup();
  hoverCharNameSetup();
  // Start session with Bnet, currently WIP
  /*$.ajax({
		  url: "https://blizz-test.herokuapp.com/auth/bnet",
		  data: null,
		  success: printResults,
      error: handleErr
    });*/
  // Request token to use for calls to Bnet
  $.ajax({
		  dataType: "text",
		  url: "https://blizz-test.herokuapp.com/getToken",
		  data: null,
		  success: storeToken,
      error: handleErr
    });
  
  // Setting it up so the first picture under 
  // Compare Stats works
  document.getElementById("compPic1").onclick =
  () => {
    let url = 
    "https://blizz-test.herokuapp.com/testCompStats";
    
    $.ajax({
		  dataType: "json",
		  url: url,
		  data: null,
		  success: loadComparisonStats,
      error: handleErr
    });
  }; 
}

function printResults(obj){
  console.dir(obj);
}

function storeToken(obj) {
  wowClient.token = obj;
}

// Adds ','s in the sale price value, making it easier to read.
function prettySalePrice(price){
  price = price.toString();
  if(price.length>2) {
    if(price.length>4) { 
      return(`${price.slice(0, price.length - 4)},${price.slice(-4, -2)},${price.slice(-2, price.length)}`);
    }
    return(`${price.slice(0, price.length-2)},${price.slice(-2, price.length)}`);
  } else { return price; }
}

// Takes the item rarity description (Poor, Rare, Legendary) and gives back the hex color value associated with it
function getRarityColor(quality) {
  switch(quality){
    case "POOR":
      return "#9d9d9d";
    case "COMMON":
      return "#ffffff";
    case "UNCOMMON":
      return "#1eff00";
    case "RARE":
      return "#0070dd";
    case "EPIC":
      return "#a335ee";
    case "LEGENDARY":
      return "#ff8000";
    case "ARTIFACT":
      return "#e6cc80";
    case "HEIRLOOM":
      return "#00ccff";
    default:
      return "#423c2c";
  }
}

// Combines seperate object variables into one rgb value to use for styling
function getRGBColor(obj) {
  var string = "rgb(";
  string += obj.r + ",";
  string += obj.g + ","
  string += obj.b + ")";

  return string;
}

function fitName(name) {
  if(name.length > 30) {
    name = name.substring(0,25);
    name += "...";
    return name;
  } else {
    return name;
  }
}

function formSetup() {
  // have the text clear itself from text field for ease of use by user.
  var charField = document.getElementById("charName");
  charField.onclick = () => {
    switch(charField.value) {
      case "Character Name":
      case "Error: 401":
        charField.value = "";
        break;
    }
  }
  charField.onblur = () => {
    if(charField.value == "")
      charField.value = "Character Name";
  }
  var realmField = document.getElementById("realmName");
  realmField.onclick = () => {
    switch(realmField.value) {
      case "Realm Name":
      case "Character Not Found":
        realmField.value = "";
        break;
    }
  }
  realmField.onblur = () => {
    if(realmField.value == "")
      realmField.value = "Realm Name";
  }

  // setup the click interaction for the submit button
  var submitButton = document.getElementById("charSearch");
  submitButton.onmousedown = function() {
    submitButton.style.backgroundImage = "linear-gradient(#0C544E, #407B8B)";
    submitButton.value = "Fetching...";
  }
  submitButton.onmouseup = function() {
    submitButton.style.backgroundImage = "linear-gradient(#148981, #407B8B)";
  }
  submitButton.onmouseout = function() {
    submitButton.style.backgroundImage = "linear-gradient(#148981, #407B8B)";
  }
}

function handleErr(jqXHR, status, errorThrown) {
  document.getElementById("charSearch").value = "Search";
  document.getElementById("charName").value = "Error: " + jqXHR.status;
  document.getElementById("realmName").value = "Character Not Found";
}
