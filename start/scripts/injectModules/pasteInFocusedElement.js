var ev = new Event("input", { bubbles: true });
ev.simulated = true;
document.activeElement.value = data;
document.activeElement.dispatchEvent(ev);
document.activeElement.style.border = "2px solid red";