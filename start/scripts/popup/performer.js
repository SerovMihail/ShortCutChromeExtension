$('.execute-flow').on('click', function () {

    // chrome.tabs.executeScript(null, { file: "start/scripts/libs/jquery-3.3.1.min.js" }, function () {
    //     chrome.tabs.executeScript(null, { file: 'start/scripts/injectModules/inject.js' });
    // });

    var settings = {
        keys: [{
            action: 'previousTab',
            count: 1,
            sekDelay: 1
        }]
    };

    localStorage.shortkeys = JSON.stringify(settings);


    chrome.runtime.sendMessage({ action: 'getKeys', url: document.URL }, function (response) {
        // if (response) {
        //     Shortkeys.keys = response
        //     if (Shortkeys.keys.length > 0) {
        //         Shortkeys.keys.forEach((key) => {
        //             Shortkeys.activateKey(key)
        //         })
        //     }
        // }
        console.log(response);
    })
})