// Takes a string and puts a # in front of it
function idMe(name) {
  let string = "#" + name;
  return string;
}

// To print out quick messages without typing console.log all the time
function log(ev) {
 console.log(ev);
}

// Function hooks onto element described by id,
// inserts the contents into the element character by character,
// which creates a typeWriter effect
function typeWriterEffect( id, contents, i) {
  // Check if this isn't looped yet.
  if(i === undefined) {
     i = 0;
  }
  // Return if the message is completed.
  if($("#"+id).html() === contents) {
    return;
  }
  if(i == 0) {
      $("#"+id).html("");
  }
  if (i < contents.length) {
    document.getElementById(id).innerHTML += contents.charAt(i);
    i++;
    setTimeout(function(){typeWriterEffect(id,contents, i)}, 20);
  }
}

// Function hooks onto element described by id,
// gives it the css elements to create a transition for opacity,
// changes the content in the element to new content, 
// fades that content in
function textFadeOutFadeInEffect( id, contents) {
  // element to modify
  let thisEl = document.getElementById(id);
  thisEl.style.transition = "opacity 0.25s";
  thisEl.style.opacity = "0";
  setTimeout(function(){thisEl.innerHTML = contents; thisEl.style.opacity = "1";}, 250);
}

// taken from https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events
function copyTouch(touch) {
  return { identifier: touch.identifier, screenX: touch.screenX, screenY: touch.screenY };
}
