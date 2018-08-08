[].forEach.call(document.querySelectorAll('[tabindex]'),
    function (el) {
        el.removeAttribute('tabindex');
    });

var elem = document.querySelector(selector);
elem.style.background = "red";
elem.tabIndex = 1;
elem.focus();