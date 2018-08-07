// debugger;

waitForEl(selector, function() {
    
    var elem = document.querySelector(selector); 
    elem.style.background = "red"; 
    elem.tabIndex = 1; 
    elem.focus();
});

function waitForEl(selector,  callback) {
    var rowLength = document.querySelectorAll(selector).length;    

    

    if (rowLength == 1 ) {
        callback();
    } else {
        setTimeout(function () {
            waitForEl(selector, callback);
        }, 100);
    }
};