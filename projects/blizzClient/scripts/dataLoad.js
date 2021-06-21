// Sends an Ajax request to Blizz server
function fetchData(name, realm, type, callback){
  let url = 
  "https://us.api.blizzard.com/profile/wow/character/";
  url += realm.toLowerCase() + "/";
  url += name.toLowerCase() + "/";
  url += type.toLowerCase();
  url += "?namespace=profile-us&locale=en_US&access_token=" + wowClient.token;
  console.log(url);
  $.ajax({
          dataType: "json",
          url: url,
          data: null,
          success: callback,
      error: handleErr
  });
}
  
function loadTestData(e) {
  e.preventDefault();
  
  let name = document.getElementById("charName").value;
  let realm = document.getElementById("realmName").value;
  
  let url = 
    "https://blizz-test.herokuapp.com/";
    
  $.ajax({
    dataType: "json",
    url: (url + "testEquiptment" + "?charName=" + name.toLowerCase() + "&realmName=" + realm.toLowerCase()),
    data: null,
    success: loadEquiptment,
    error: handleErr
  });

  $.ajax({
    dataType: "json",
    url: (url + "testStats" + "?charName=" + name.toLowerCase() + "&realmName=" + realm.toLowerCase()),
    data: null,
    success: loadStats,
    error: handleErr
  });
  
}

function loadData(e) {
  e.preventDefault();
  
  let name = document.getElementById("charName").value;
  let realm = document.getElementById("realmName").value;
  
  fetchData(name, realm, "equipment", loadEquiptment);
  fetchData(name, realm, "statistics", loadStats);
  
}

function loadEquiptment(obj) {
  // This is only in here so it's called as the data comes in. Not the best practice
  // Button changing value tells the user the data has finished loading
  document.getElementById("charSearch").value = "Search";
  
  // Variables to access the different divs to place item data in
  let itemSlot = document.getElementById("div-pve-item-col-left");
  let itemName = document.getElementById("div-pve-item-col-middle");
  let itemValue = document.getElementById("div-pve-item-col-right");
  let coins = document.getElementById("div-coin-imgs");

  // Get the div element to give hover info to
  let infoDiv = document.getElementById("div-information");
  
  // Loop through and grab each item from data
  for(let i=0; i < obj.equipped_items.length; i++){
    itemSlot.innerHTML += "<p>" + obj.equipped_items[i].slot.name + "</p>"
    itemName.innerHTML += '<p id="'+ obj.equipped_items[i].item.id + '">' + fitName(obj.equipped_items[i].name) + "</p>";
    itemValue.innerHTML += '<p class="stat coins">' + 
    (() => (obj.equipped_items[i].sell_price) ? prettySalePrice(obj.equipped_items[i].sell_price.value) : "N/A")() + "</p>";
    coins.innerHTML += '<img src="media/gold.png" class="coin" alt="Gold coin" />';
  }
  // loop through a second time to attatch every event listener
  for(let i=0; i < obj.equipped_items.length; i++){
    hoverItemDescriptionSetup(obj.equipped_items[i], infoDiv);
  }
  //hoverTest(obj.equipped_items[1], infoDiv);
  hoverSetupCoins();

}

function loadStats(obj) {
  // Tell information div who is being displayed
  wowClient.char1 = obj.character.name;
  // Attributes
  document.getElementById("strength-stat").innerText = obj.strength.effective;
  document.getElementById("agility-stat").innerText = obj.agility.effective;
  document.getElementById("intellect-stat").innerText = obj.intellect.effective;
  document.getElementById("stamina-stat").innerText = obj.stamina.effective;
  
  // Attack
  document.getElementById("damage-stat").innerText = 
  obj.main_hand_damage_min.toFixed(2) + "-" + obj.main_hand_damage_max.toFixed(2);
  document.getElementById("speed-stat").innerText = obj.main_hand_speed.toFixed(2);
  
  // Spell
  document.getElementById("mana-regen-stat").innerText = obj.mana_regen;
  
  // Defense
  document.getElementById("armor-stat").innerText = obj.armor.effective;
  document.getElementById("dodge-stat").innerText = obj.dodge.value.toFixed(2);
  document.getElementById("parry-stat").innerText = obj.parry.value.toFixed(2);
  document.getElementById("block-stat").innerText = obj.block.value;
  
  // Enhancements
  document.getElementById("crit-stat").innerText = obj.melee_crit.value.toFixed(2) + "%";
  document.getElementById("haste-stat").innerText = obj.melee_haste.value.toFixed(2) + "%";
  document.getElementById("mastery-stat").innerText = obj.mastery.value.toFixed(2) + "%";
  document.getElementById("leech-stat").innerText = obj.lifesteal.value.toFixed(2) + "%";
  document.getElementById("versatility-stat").innerText = obj.versatility_damage_done_bonus.toFixed(2) + "%";
  document.getElementById("avoidance-stat").innerText = 
  (parseFloat(obj.dodge.value) + parseFloat(obj.block.value) + parseFloat(obj.parry.value)).toFixed(2) + "%";
}

function loadComparisonStats(obj) {
  // Tell the information div name of character
  wowClient.char2 = obj.character.name;
  // First show the elements being edited
  let divs = document.getElementsByClassName('hidden');
  for(let i =0; i < divs.length; i++) {
    divs[i].style.display = "block";
  }
  // Attributes
  document.getElementById("strength-comp-stat").innerText = obj.strength.effective;
  document.getElementById("agility-comp-stat").innerText = obj.agility.effective;
  document.getElementById("intellect-comp-stat").innerText = obj.intellect.effective;
  document.getElementById("stamina-comp-stat").innerText = obj.stamina.effective;
  
  // Attack
  document.getElementById("damage-comp-stat").innerText = 
  obj.main_hand_damage_min.toFixed(2) + "-" + obj.main_hand_damage_max.toFixed(2);
  document.getElementById("speed-comp-stat").innerText = obj.main_hand_speed.toFixed(2);
  
  // Spell
  document.getElementById("mana-regen-comp-stat").innerText = obj.mana_regen;
  
  // Defense
  document.getElementById("armor-comp-stat").innerText = obj.armor.effective;
  document.getElementById("dodge-comp-stat").innerText = obj.dodge.value.toFixed(2);
  document.getElementById("parry-comp-stat").innerText = obj.parry.value.toFixed(2);
  document.getElementById("block-comp-stat").innerText = obj.block.value;
  
  // Enhancements
  document.getElementById("crit-comp-stat").innerText = obj.melee_crit.value.toFixed(2) + "%";
  document.getElementById("haste-comp-stat").innerText = obj.melee_haste.value.toFixed(2) + "%";
  document.getElementById("mastery-comp-stat").innerText = obj.mastery.value.toFixed(2) + "%";
  document.getElementById("leech-comp-stat").innerText = obj.lifesteal.value.toFixed(2) + "%";
  document.getElementById("versatility-comp-stat").innerText = obj.versatility_damage_done_bonus.toFixed(2) + "%";
  document.getElementById("avoidance-comp-stat").innerText = 
  (parseFloat(obj.dodge.value) + parseFloat(obj.block.value) + parseFloat(obj.parry.value)).toFixed(2) + "%";
}