$(function () {

    var shortKeys = JSON.parse(localStorage.shortkeys);

    if (shortKeys.keys.length > 0) {
        shortKeys.keys.forEach((key) => {

            console.log(key);

            var newLi = $('<li/>', { class: 'shortcut-item shortcut-exist'})

            newLi.attr('index', key.index);
            newLi.html(key.action + " " + key.count + " " + key.sekDelay);

            newLi.insertBefore('.shortcut-add-new');
        });
    }



    console.log(localStorage);


});