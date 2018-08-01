var e = new Event("keydown");
  e.key="d";    // just enter the char you want to send 
  e.keyCode=e.key.charCodeAt(e.key);
  e.which=e.keyCode;
  e.altKey=true;
  e.ctrlKey=false;
  e.shiftKey=false;
  e.metaKey=false;
  e.bubbles=false;
  document.dispatchEvent(e);

  document.addEventListener('keydown', function(e) {
      console.log(e);
  })