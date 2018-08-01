$('.execute-flow').on('click', function (e) {
    chrome.tabs.executeScript({
        file: 'start/scripts/injectModules/inject.js'
    });
})