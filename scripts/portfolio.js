// Figure out the resolution of the window so I can update variables accordingly
var windowWidth;
var windowHeight;
// Is the slide currently being changed or no?
var movingSlide;
// bool to say if user is at the top of the portfolio page
var isAtTopOfPage = true;
// array of navigation menu links.
var navLinks;
// object holding current slide positions on each slideshow
var slideShowPosition;

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
  setupHoverEventTriggers();

  // DOR = Dangers of Road
  // ST = Sticker Trader
  // FT = Funtime Fuel
  // DZ = Day Zero
  let projectAcronyms = ["DOR","ST","FT","DZ"];
  let slideAmount =     [ 4,    3,    3,  7  ];
  
  setupProjectSlideShowButtons(projectAcronyms, slideAmount);
  
};

// event listener for when the window is scrolled down. 
$(window).scroll(function() {
  if(!navLinks) return;
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

function setupHoverEventTriggers() {
	// setup the navigation link hovers
	for(let i = 1; i <= 4; ++i) {
		$("#navLink" + i).mouseover(function() {
			document.getElementById('navLinkUnderline' + i).style.transform = "scale(1,0.1)";
		});
		$("#navLink" + i).mouseleave(function() {
			document.getElementById('navLinkUnderline' + i).style.transform = "scale(0,0)";
		});
	}
	
	$( "#DZprojLinkA" ).mouseover(function() {
		document.getElementById("DZprojLinkUnderline").style.transform = "scale(1,0.1)";
	});
	$( "#DZprojLinkA" ).mouseleave(function() {
		document.getElementById("DZprojLinkUnderline").style.transform = "scale(0,0)";
    });
	
	
}

// This function creates event listeners for each project.
// It creates an event listener for each left and right button 
// on a slideshow
function setupProjectSlideShowButtons(projects, numOfSlides) {
  let slideWidth = 1100;
  movingSlide = false;
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
    $("#"+ projects[i] +"slides").css("left", (-1*slideWidth) + "px");
    
    // Create object properties to hold which slide is currently being displayed
    slideShowPosition[projects[i]+"slidePosition"] = 0;
    
    // Set up event listeners for swipe events
    let md = new Hammer(document
                        .getElementById(projects[i] +'slidesDiv'));
    md.on("swiperight", function() {
        thumbnailSlideSetup(projects[i], "left", numOfSlides[i])}); 
    md.on("swipeleft", function() {
        thumbnailSlideSetup(projects[i], "right", numOfSlides[i])}); 
    
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
}


// slide: the id of the container that holds every image
// direction: are we moving left or right from the current slide
// numOfSlides: amount of slides within the slideshow
// slideWidth: how wide is each image

function moveSlides(project, direction, numOfSlides, slideWidth) {
  // Check if the slide isn't currently moving
  if(movingSlide) return;
  // Set moving to true while completing this function
  movingSlide = true;
  // Set it back to false after moving is completed in duration of time
  setTimeout(function(){
    movingSlide = false;
  }, 500);
  
  let slide = project +"slides";
  let left =  parseInt($(idMe(slide)).css("left").split("p")[0]);
  
  // These four vairables are for determining the end points of the slide show
  // They are important for making the slides wrap
  let firstSlide = 0 - slideWidth;
  let lastSlide = 0 - slideWidth * numOfSlides;
  let boundryLeft = firstSlide/2;
  let bountryRight = lastSlide - (slideWidth/2);
  
  
  // If slides want to go left, run this, otherwise go right
  if(direction == 0 || direction == "left" || direction == "Left") {
    $(idMe(slide)).css("left", (left + slideWidth));
    slideShowPosition[project+"slidePosition"] = 
    ((--slideShowPosition[project+"slidePosition"]) < 0) ? 6 : slideShowPosition[project+"slidePosition"];
  } else {
    $(idMe(slide)).css("left", (left - slideWidth));
    slideShowPosition[project+"slidePosition"] = 
    ((++slideShowPosition[project+"slidePosition"]) > 6) ? 0 : slideShowPosition[project+"slidePosition"];
  }
  
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
    if(parseInt($(idMe(slide)).css("left").split("p")[0]) == lastSlide || parseInt($(idMe(slide)).css("left").split("p")[0]) == firstSlide){
      $(idMe(slide)).css("transition", "left 0.5s ease-out");
    } 
  }, 480);
  
}

// This function moves the border around the thumbnails for the slideshow
// group: the class of images that will be controlled
// direction: does the border move left or right?

function moveThumbnail(group, direction) {
  // Check if the slide isn't currently moving
  if(movingSlide) return;
  
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


