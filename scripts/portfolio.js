"use strict";
// Figure out the resolution of the window so I can update variables accordingly
var windowWidth;
var windowHeight;
// Is the slide currently being changed or no?
var isSlideMoving;
// bool to say if user is at the top of the portfolio page
var isAtTopOfPage = true;
// array of navigation menu links.
var navLinks;
// object holding current slide positions on each slideshow
var slideShowPosition;

// DOR = Dangers of Road
// ST = Sticker Trader
// FT = Funtime Fuel
// DZ = Day Zero
var projectAcronyms = ["DOR","ST","FT","DZ"];
var slideAmount =     [ 4,    3,    3,  7  ];

/*var projectAcronyms = [
  { name: "DOR", slideAmount: 4},
  { name: "ST", slideAmount: 3},
  { name: "FT", slideAmount: 3},
  { name: "DZ", slideAmount: 7} ]; */


// windowWidth & windowHeight are automatically updated when the browser size is modified
$(window).resize(function(){
  windowWidth = $(window).width();
  windowHeight = $(window).height();
  
  $("#mainPage").css( "height", windowHeight );
  
  // Set the spacing on the main page, 
  // depends on if my full name can fit on one line or not
  if(windowWidth < 450) {
    $("#name").css( "top", ( windowHeight/2 -127 ) );
    $("#portfolioWord").css( "top", ( windowHeight/2 - 17 ));
  }
  else {
    $("#name").css( "top", ( windowHeight/2 -67 ) );
    $("#portfolioWord").css( "top", ( windowHeight/2 - 17 ));
  }
});


window.onload = function() {
  setupMainPageAndNav();
  setupNavHoverTriggers();
  
  setupProjectEvents(projectAcronyms, slideAmount);
  
};

// event listener for when the window is scrolled down. 
$(window).scroll(function() {
  if(!navLinks) return;
  if ($(window).scrollTop() == 0) {
	isAtTopOfPage = true; 
	for(let i = 0; i < navLinks.length; i++){
		navLinks[i].style.fontSize = '1.7em';
    // 1.7em for 1080p
	}
  } 
  else {
	if(!isAtTopOfPage) return;
	for(let i = 0; i < navLinks.length; i++){
		navLinks[i].style.fontSize = '1em';
    // 1em for 1080p
    
		isAtTopOfPage = false;
	}
  }
});

function setupMainPageAndNav() {
  windowWidth = $(window).width();
  windowHeight = $(window).height();
  navLinks = document.getElementById("heading").	
						getElementsByClassName("link");
						
  $("#mainPage").css( "height", windowHeight );
  
  // Set the spacing on the main page, 
  // depends on if my full name can fit on one line or not
  if(windowWidth < 450) {
    $("#name").css( "top", ( windowHeight/2 -127 ) );
    $("#portfolioWord").css( "top", ( windowHeight/2 - 17 ));
  }
  else {
    $("#name").css( "top", ( windowHeight/2 -67 ) );
    $("#portfolioWord").css( "top", ( windowHeight/2 - 17 ));
  }
  
  // Find where the user is on the page to determine font size
  if ($(window).scrollTop() == 0) {
	isAtTopOfPage = true; 
	for(let i = 0; i < navLinks.length; i++){
		navLinks[i].style.fontSize = '1.7em';
	}
  } 
  else {
	if(!isAtTopOfPage) return;
	for(let i = 0; i < navLinks.length; i++){
		navLinks[i].style.fontSize = '1em';
		isAtTopOfPage = false;
	}
  }
}

function setupNavHoverTriggers() {
	// setup the navigation link hovers
	for(let i = 1; i <= 4; ++i) {
		$("#navLink" + i).mouseover(function() {
			document.getElementById('navLinkUnderline' + i).style.transform = "scale(1,0.1)";
		});
		$("#navLink" + i).mouseleave(function() {
			document.getElementById('navLinkUnderline' + i).style.transform = "scale(0,0)";
		});
	}
}

// This function creates event listeners for each project.
// It creates an event listener for each left and right button 
// on a slideshow
function setupProjectEvents(projects, numOfSlides) {
  let slideWidth = 1100;
  isSlideMoving = false;
  slideShowPosition = {};
  
  if(windowWidth <= 380) {
    slideWidth = 320;
  } else if(windowWidth <= 440) {
    slideWidth = 400;
  } else if(windowWidth <= 1100) {
    slideWidth = 750;
  } 
  
  function thumbnailSlideSetup(project, direction, slides) {
    moveThumbnail(project, direction);
    moveSlides(project, direction, slides, slideWidth);
  }
  
  for(let i = 0; i < projects.length; i++) {
    // Put the slideshow in correct position
    $("#"+ projects[i] +"-slides").css("left", (-1*slideWidth) + "px");
    
    // Create object properties to hold which slide is currently being displayed
    slideShowPosition[projects[i]+"slidePosition"] = 0;
    
    // Set up event listeners for touch / swipe events
    setupTouchEvents(projects[i]);
    
    // Set up event listeners for clicking/pressing events
    $("#"+ projects[i] +"A1").click(function() {
        thumbnailSlideSetup(projects[i], "left", numOfSlides[i])}); 
    $("#"+ projects[i] +"A2").click(function() {
        thumbnailSlideSetup(projects[i], "right", numOfSlides[i])});
    
    $("#"+ projects[i] +"mobileArrowLeft").click(function() {
        thumbnailSlideSetup(projects[i], "left", numOfSlides[i])});
    $("#"+ projects[i] +"mobileArrowRight").click(function() {
        thumbnailSlideSetup(projects[i], "right", numOfSlides[i])});
  } 
  
  // Set up hover events for project links
  // currently only set up for DZ and DOR
  for(let i = 0; i < projects.length; ++i) {
    if(projects[i] == "ST") 
      continue;
    $( "#"+ projects[i] +"projLinkA" ).mouseover(function() {
      document.getElementById(projects[i]+"projLinkUnderline").style.transform = "scale(1,0.1)";
    });
    $( "#"+ projects[i] +"projLinkA" ).mouseleave(function() {
      document.getElementById(projects[i]+"projLinkUnderline").style.transform = "scale(0,0)";
    });
  }
}

// currently will be working on the text div's as a test
function setupTouchEvents(project) {
  document.getElementById(project+"-slides").addEventListener('touchstart', handleTouchstart, false);
  document.getElementById(project+"-slides").addEventListener('touchmove', handleTouchmove, false);
  //document.getElementById(project+"-slides").addEventListener('touchend', handleTouchend, false); 
  
  // array to store the identifier and position of touches
  var ongoingTouches = [];
  // the distance traveled by the finger horizontally
  let xdistanceMoved = 0;
  let engagedProject;
  let startingSlidePos;
  
  function handleTouchstart(ev) {
    // do nothing if the slide is currently in motion from a button pressing
    if(isSlideMoving)
      return;
    document.getElementById("DZprojLinkA").innerHTML = "Pressed On " +ev.targetTouches[0].target.parentElement.id.split("-")[0] + "!";
    
    // store the starting pixel position of the slide
    startingSlidePos = ev.targetTouches[0].target.parentElement.style.left.split("p")[0];
    engagedProject = ev.targetTouches[0].target.parentElement.id.split("-")[0];
    
    // turn off transition for movement
    $(idMe(engagedProject+"-slides")).css("transition", "left 0s");
    
    // Store the touches position and identifier in an array
    for (let i = 0; i < ev.changedTouches.length; i++) {
      ongoingTouches.push(copyTouch(ev.changedTouches[i]));
    }
  }
  
  function handleTouchmove(ev) {
    if(isSlideMoving)
      return;
    ev.preventDefault();
    
    let idx = ongoingTouchIndexById(ev.changedTouches[0].identifier);
    xdistanceMoved = ev.changedTouches[0].screenX - ongoingTouches[idx].screenX;
    // have slide postion respond to touch
    let leftVal = parseInt(startingSlidePos) + xdistanceMoved;
    document.getElementById(engagedProject+"-slides").style.left = 
      leftVal + "px";
      
    // console.log("Set " + engagedProject+"-slides" + " to " + leftVal + "px");
    // So this is a IFFE function that uses a ternary operator to return the string left or right to directionMoved
    // let directionMoved = (() => (xdistanceMoved<0) ? "left" : "right")();
    
    /* if(ev.changedTouches[0].target.tagName == "DIV")
      ev.changedTouches[0].target.getElementsByTagName("P")[0].innerHTML = 
      "Moved finger " + directionMoved + " " + xdistanceMoved + " pixels!";
    else
      ev.changedTouches[0].target.innerHTML = 
      "Moved finger " + directionMoved + " " + xdistanceMoved + " pixels!"; */
    
  }
  
  function handleTouchend(ev) {
    if(!ev.changedTouches[0])
      return;
    if(ev.changedTouches[0].target.tagName == "DIV")
      ev.changedTouches[0].target.getElementsByTagName("P")[0].innerHTML = "Pressed Off DIV!";
    else
      ev.changedTouches[0].target.innerHTML = "Pressed Off!"; 
    
    // determine where to move the slide after user finished interacting
    centerSlide(ev.changedTouches[0].target.id.split("p")[0], xdistanceMoved);
    // reset variable for next touch event
    ongoingTouches.pop();  // remove touch
  }
  
  
  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      if (ongoingTouches[i].identifier == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  } 
}

// TODO: have moveSlides figure out exactly what value to set left to in order to move the slide smoothly
// Do this by finding the current value of left, then comparing it to slideWidth, 
// and figuring out which slideWidth whole value is left closest to.

function centerSlide(project) {
  
}


// project: the id of the project we are targeting
// direction: are we moving left or right from the current slide
// numOfSlides: amount of slides within the slideshow
// slideWidth: how wide is each image

function moveSlides(project, direction, numOfSlides, slideWidth) {
  // Check if the slide isn't currently moving
  if(isSlideMoving) return;
  // Set moving to true while completing this function
  isSlideMoving = true;
  // Set it back to false after moving is completed in duration of time
  setTimeout(function(){
    isSlideMoving = false;
  }, 500);
  
  let slide = project +"-slides";
  let cssLeft =  parseInt($(idMe(slide)).css("left").split("p")[0]);
  
  // These four vairables are for determining the end points of the slide show
  // They are important for making the slides wrap
  let firstSlide = 0 - slideWidth;
  let lastSlide = 0 - slideWidth * numOfSlides;
  let boundryLeft = firstSlide/2;
  let bountryRight = lastSlide - (slideWidth/2);
  
  
  // If slides want to go left, run this, otherwise go right
  if(direction == 0 || direction == "left" || direction == "Left") {
    $(idMe(slide)).css("left", (cssLeft + slideWidth));
    // Decrease slideShowPosition[n] by one, then check if this is less than 0. If it is, set it to one less than total slides,
    // otherwise keep the value.
    slideShowPosition[project+"slidePosition"] = 
    ((--slideShowPosition[project+"slidePosition"]) < 0) ? (numOfSlides - 1) : slideShowPosition[project+"slidePosition"];
  } else {
    $(idMe(slide)).css("left", (cssLeft - slideWidth));
    slideShowPosition[project+"slidePosition"] = 
    ((++slideShowPosition[project+"slidePosition"]) > (numOfSlides - 1)) ? 0 : slideShowPosition[project+"slidePosition"];
  }
  
  // Changes the text under image
  // Currently works for Day Zero, Dangers of Road, and Fun Time
  
  changeProjectText(project, slideShowPosition[project+"slidePosition"]); 
  
    
  setTimeout(function(){
    if(parseInt($(idMe(slide)).css("left").split("p")[0]) >= boundryLeft){
      // Remove transition temporarily so user doesn't notice slide switching
      $(idMe(slide)).css("transition", "left 0s");
      $(idMe(slide)).css("left", lastSlide + "px");
       console.log("hit left: " + boundryLeft);
    }
    if(parseInt($(idMe(slide)).css("left").split("p")[0]) <= bountryRight){
      $(idMe(slide)).css("transition", "left 0s");
      $(idMe(slide)).css("left", firstSlide + "px");
       console.log("hit right: " + bountryRight);
    }
  }, 450);
  setTimeout(function(){
    if(parseInt($(idMe(slide)).css("left").split("p")[0]) == lastSlide 
    || parseInt($(idMe(slide)).css("left").split("p")[0]) == firstSlide){
      $(idMe(slide)).css("transition", "left 0.5s ease-out");
    } 
  }, 480);
  
}

function changeProjectText(project, slideNum) {
  switch(project) {
    case "DZ":
      typeWriterEffect(project + "projBody", document.getElementById(project + "message" + slideNum).innerHTML);
      break;
    case "DOR":
    case "FT":
    case "ST":
      textFadeOutFadeInEffect(project + "projBody", document.getElementById(project + "message" + slideNum).innerHTML);
      break;
    default:
  }

}

// This function moves the border around the thumbnails for the slideshow
// group: the class of images that will be controlled
// direction: does the border move left or right?

function moveThumbnail(group, direction) {
  // Check if the slide isn't currently moving
  if(isSlideMoving) return;
  
  // get array of thumbnail images
  let thumbnails = document.getElementsByClassName(group +"thumbnail");
  let currentlyHighlighted = 0;
  
  // find which thumbnail is currently highlighted
  for(let i = 0; i < thumbnails.length; i++) {
    if( $(thumbnails[i]).hasClass(group + "thumbnailSelected")){
      currentlyHighlighted = i;
      break;
    }
  }
  
  // Determine if moving left or right
  if(direction == 0 || direction == "left" || direction == "Left") {
    thumbnails[currentlyHighlighted].classList.remove(group + "thumbnailSelected");
    if(currentlyHighlighted == 0) 
      currentlyHighlighted = thumbnails.length;
    thumbnails[currentlyHighlighted-1].classList.add(group + "thumbnailSelected");
  } else {
    //console.log(currentlyHighlighted);
    thumbnails[currentlyHighlighted].classList.remove(group + "thumbnailSelected");
    if(currentlyHighlighted == (thumbnails.length-1))
      currentlyHighlighted = -1; 
    thumbnails[currentlyHighlighted+1].classList.add(group + "thumbnailSelected");
    //console.log(thumbnails.length);
  }
}


