// debugger;

// var focusableEls = $('body').find('a, object, input, iframe, [tabindex]'),
//     firstFocusableEl = focusableEls.first()[0],
//     lastFocusableEl = focusableEls.last()[0],
//     KEYCODE_TAB = 9;

// var e = $.Event('keypress');
// e.which = 9; // Character 'A'
// $('body').trigger(e);

// $('body').on('keypress', function (e) {
//     var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

//     if (!isTabPressed) {
//         return;
//     }

//     if (e.shiftKey) /* shift + tab */ {
//         if (document.activeElement === firstFocusableEl) {
//             lastFocusableEl.focus();
//             e.preventDefault();
//         }
//     } else /* tab */ {
//         if (document.activeElement === lastFocusableEl) {
//             firstFocusableEl.focus();
//             e.preventDefault();
//         }
//     }

// });

$("a, object, input, iframe, [tabindex]").slice(0, 1).focus().css({'background-color': 'green'});
document.activeElement.style.backgroundColor = "green";