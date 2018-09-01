let copyToClipboard = (text) => {
    let copyDiv = document.createElement('div')
    copyDiv.contentEditable = true
    document.body.appendChild(copyDiv)
    copyDiv.innerHTML = text
    copyDiv.unselectable = 'off'
    copyDiv.focus()
    document.execCommand('SelectAll')
    document.execCommand('Copy', false, null)
    document.body.removeChild(copyDiv)
}

let selectTab = (direction, callback) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        if (tabs.length <= 1) {
            callback();
            // return;
        }
        chrome.tabs.query({ currentWindow: true, active: true }, (currentTabInArray) => {
            let currentTab = currentTabInArray[0]
            let toSelect
            switch (direction) {
                case 'next':
                    toSelect = tabs[(currentTab.index + 1 + tabs.length) % tabs.length]
                    break
                case 'previous':
                    toSelect = tabs[(currentTab.index - 1 + tabs.length) % tabs.length]
                    break
                case 'first':
                    toSelect = tabs[0]
                    break
                case 'last':
                    toSelect = tabs[tabs.length - 1]
                    break
                default:
                    let index = parseInt(direction) || 0
                    if (index >= 1 && index <= tabs.length) {
                        toSelect = tabs[index - 1]
                    } else {
                        return
                    }
            }
            chrome.tabs.update(toSelect.id, { active: true }, callback)
        })
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.action === 'executeFlow') {

        var settings = JSON.parse(localStorage.currentFlow),
            index = 0;        

        delay_loop();

        function delay_loop() {

            setTimeout(function () {

                el = settings[index];

                handleAction(el.action, el.count, el.selector, el.url, el.data, el.column, el.row, function () {

                    index = ++index;
                    if (index < settings.length) {
                        delay_loop();
                    }
                });

            }, 1000);
        }       
    }
});



let handleAction = (action, count, selector, url, data, column, row, callback = {}) => {

    if (action === 'newtab') {
        chrome.tabs.create({}, function () {
            callback();
        });
    } else if (action === 'prevtab') {
        selectTab('previous', callback)
    } else if (action === 'nexttab') {
        selectTab('next', callback)
    } else if (action === 'closetab') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.tabs.remove(tab[0].id);
            callback();
        })
    } else if (action === 'copyurl') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            copyToClipboard(tab[0].url);
            localStorage.clipboardData = tab[0].url;
            callback();
        })
    } else if (action === 'gototab') {
        var clipboardData = localStorage.clipboardData;

        chrome.tabs.create({ url: clipboardData }, callback);
        
    } else if (action === 'back') {
        chrome.tabs.executeScript(null, { 'code': 'window.history.back()' }, function () {
            callback();
        })
    } else if (action === 'forward') {
        chrome.tabs.executeScript(null, { 'code': 'window.history.forward()' }, function () {
            callback();
        })
    } else if (action === 'reload') {
        chrome.tabs.executeScript(null, { 'code': 'window.location.reload()' }, function () {
            callback();
        })
    } else if (action === 'tab') {        

        chrome.tabs.executeScript(null, { 'file': "start/scripts/libs/jquery/jquery-3.3.1.min.js" }, function () {
            chrome.tabs.executeScript(null, { 'code': 'var count = ' + count + ';' }, function () {
                chrome.tabs.executeScript(null, { 'file': 'start/scripts/injectModules/tab.js' }, function () {
                    callback();
                });
            });
        });

    } else if (action === 'opentabbyurl') {

        chrome.tabs.create({ url: url }, function () {
            callback();
        });

    } else if (action === 'copyfocuedtext') {

        chrome.tabs.executeScript(null, { 'code': 'document.activeElement.innerText ? document.activeElement.innerText : document.activeElement.value' }
            , function (result) {
                localStorage.clipboardData = result[0].trim();
                callback();
            });

    } else if (action === 'clickfocusedelement') {

        chrome.tabs.executeScript(null, {
            file: 'start/scripts/injectModules/clickFocusedElement.js'
        }, function () {
            callback();
        });

    } else if (action === 'pasteinfocusedelement') {

        chrome.tabs.executeScript(null, { 'code': "var data = '" + localStorage.clipboardData + "';" }, function () {
            chrome.tabs.executeScript(null, {
                runAt: 'document_end',
                file: 'start/scripts/injectModules/pasteInFocusedElement.js'
            }, function () {
                callback();
            });
        });

    } else if (action === 'pasteusinginput') {

        chrome.tabs.executeScript(null, { 'code': "var data = '" + data + "';" }, function () {
            chrome.tabs.executeScript(null, {
                runAt: 'document_end',
                file: 'start/scripts/injectModules/pasteInFocusedElement.js'
            }, function () {
                callback();
            });
        });


    } else if (action === 'selectelementusingselector') {

        checkSelector();

        function checkSelector() {

            setTimeout(function () {

                chrome.tabs.executeScript(null, {
                    runAt: 'document_end',
                    code: "if(document.readyState === 'complete') document.querySelectorAll('" + selector + "').length"
                }, function (result) {

                    if (result && result[0] > 0) {
                        
                        chrome.tabs.executeScript(null, { 'code': "var selector = '" + selector + "';" }, function () {
                            chrome.tabs.executeScript(null, {
                                runAt: 'document_end',
                                file: "start/scripts/injectModules/selectelEmentUsingSelector.js"
                            }, function () {
                                callback();
                            });
                        });

                    } else {
                        checkSelector();
                    }

                });

            }, 100);

        }  

    } else if (action === 'loadgooglesheets') {

        debugger;

        Tabletop.init({
            key: url,
            callback: showInfo,
            simpleSheet: true
        });

        function showInfo(data) {
            localStorage.dataFromSheet = JSON.stringify(data);
            callback();
        }
        

    } else if (action === 'getvaluefromloadedsheet') {

        debugger;
        
        var data  = JSON.parse(localStorage.dataFromSheet);

        var selectedRow = Object.values(data[row - 1]);
        
        copyToClipboard(selectedRow[column - 1]);
        localStorage.clipboardData = selectedRow[column - 1];          
        callback();

    } else {
        return false;
    }
    return true;  


}