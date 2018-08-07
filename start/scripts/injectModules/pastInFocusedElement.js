var ev = new Event("input", { bubbles: true }); 
ev.simulated = true; 
debugger;
document.activeElement.value = clipboardData; 
document.activeElement.dispatchEvent(ev); 
document.activeElement.style.border = "2px solid red";