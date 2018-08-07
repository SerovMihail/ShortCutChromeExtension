function waitForEl(selector, callback) {
    var rowLength = document.querySelectorAll(selector).length;

    var watingCounter = 0;

    if (rowLength == 1) {
        callback();
    } else {
        setTimeout(function () {

            waitForEl(selector, callback);

            watingCounter = ++watingCounter;

            if (watingCounter > 20) {
                callback('error');
            }
        }, 100);
    }
};

waitForEl(selector, function (error) {

    if (error) {
        alert('Problems with flow. Reexecute your flow or change shortcuts');
    }

    [].forEach.call(document.querySelectorAll('[tabindex]'),
        function (el) {
            el.tabIndex = 0;
        });

    var elem = document.querySelector(selector);
    elem.style.background = "red";
    elem.tabIndex = 1;
    elem.focus();

    alert('finish wait for');

    return true;
});

alert('finish');