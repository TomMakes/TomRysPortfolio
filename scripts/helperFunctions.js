// Takes a string and puts a # in front of it
function idMe(name) {
  let string = "#" + name;
  return string;
}

// To print out quick messages without typing console.log all the time
function log(ev) {
 console.log(ev);
}

function typeWriterEffect( id, contents, i) {
  if(i === undefined) {
     i = 0;
  }

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