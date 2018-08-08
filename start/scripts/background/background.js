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

        var settings = JSON.parse(localStorage.currentFlow);

        var index = 0;

        delay_loop();

        function delay_loop() {
            setTimeout(function () {

                el = settings[index];

                handleAction(el.action, el.count, el.selector, el.url, el.data, function () {

                    index = ++index;
                    if (index < settings.length) {
                        delay_loop();
                    }
                });

            }, 1000);

        }


        // settings.forEach(function (el, index) {

        //     setTimeout(() => {
        //         handleAction(el.action, el.count, el.selector, el.url);
        //     }, index * 2000);

        // });
    }

});



let handleAction = (action, count, selector, url, data, callback = {}) => {

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
        // let createNewTab = () => {
        //     chrome.tabs.create({ url: clipboardData })
        // }
        // if (request.matchurl) {
        //     let queryOption = { url: request.matchurl }
        //     if (request.currentWindow) {
        //         queryOption.currentWindow = true
        //     }
        //     chrome.tabs.query(queryOption, function (tabs) {
        //         if (tabs.length > 0) {
        //             chrome.tabs.update(tabs[0].id, { active: true })
        //             chrome.windows.update(tabs[0].windowId, { focused: true })
        //         } else {
        //             createNewTab()
        //         }
        //     })
        // } else {
        //    createNewTab()
        //}
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

        // var injectCode =
        //     'var elem = $(":input, a[href], area[href], iframe").eq(' + (count - 1) + ');' +

        //     'elem.css({"border" : "2px solid red"});' +
        //     'elem.focus();';

        chrome.tabs.executeScript(null, { 'file': "start/scripts/libs/jquery-3.3.1.min.js" }, function () {
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



    } else if (action === 'pastinfocusedelement') {

        chrome.tabs.executeScript(null, { 'code': "var data = '" + localStorage.clipboardData + "';" }, function () {
            chrome.tabs.executeScript(null, {
                runAt: 'document_end',
                file: 'start/scripts/injectModules/pastInFocusedElement.js'
            }, function () {
                callback();
            });
        });



    } else if (action === 'pastusinginput') {

        chrome.tabs.executeScript(null, { 'code': "var data = '" + data + "';" }, function () {
            chrome.tabs.executeScript(null, {
                runAt: 'document_end',
                file: 'start/scripts/injectModules/pastInFocusedElement.js'
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

        // chrome.tabs.executeScript(null, { 'code': "var selector = '" + selector + "';" }, function () {
        //     //    chrome.tabs.executeScript(null, {
        //     //         runAt: 'document_end',
        //     //         //code: "var selector = '" + selector + "'; waitForEl(selector,function(error){if(error){alert('Problems with flow. Reexecute your flow or change shortcuts')}; [].forEach.call(document.querySelectorAll('[tabindex]'),function(el){el.tabIndex=1}); var elem=document.querySelector(selector);elem.style.background='red';elem.tabIndex=1;elem.focus()});function waitForEl(selector,callback){var rowLength=document.querySelectorAll(selector).length;var watingCounter=0;if(rowLength==1){callback()}else{setTimeout(function(){waitForEl(selector,callback);watingCounter=++watingCounter;if(watingCounter>20){callback('error')}},100)}}"
        //     //         file: "start/scripts/injectModules/selectelEmentUsingSelector.js"
        //     //     }, function () {
        //     //         callback();
        //     //     });



        // });


    } else {
        return false;
    }
    return true;


    // possible to implement


    // if (action === 'nexttab') {
    //     selectTab('next')
    // }  else if (action === 'firsttab') {
    //     selectTab('first')
    // } else if (action === 'lasttab') {
    //     selectTab('last')
    // } else 


    // else if (action === 'reopentab') {
    //     chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function (sessions) {
    //         let closedTab = sessions[0]
    //         chrome.sessions.restore(closedTab.sessionId)
    //     })
    // } 


    // else if (action === 'clonetab') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.duplicate(tab[0].id)
    //     })
    // } else if (action === 'movetabtonewwindow') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.windows.create({ url: tab[0].url })
    //         chrome.tabs.remove(tab[0].id)
    //     })
    // } else if (action === 'onlytab') {
    //     chrome.tabs.query({ currentWindow: true, pinned: false, active: false }, (tabs) => {
    //         let ids = []
    //         tabs.forEach(function (tab) {
    //             ids.push(tab.id)
    //         })
    //         chrome.tabs.remove(ids)
    //     })
    // } 

    // else if (action === 'closelefttabs' || action === 'closerighttabs') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    //         let currentTabIndex = tabs[0].index
    //         chrome.tabs.query({ currentWindow: true, pinned: false, active: false }, (tabs) => {
    //             let ids = []
    //             tabs.forEach(function (tab) {
    //                 if ((action === 'closelefttabs' && tab.index < currentTabIndex) ||
    //                     (action === 'closerighttabs' && tab.index > currentTabIndex)) {
    //                     ids.push(tab.id)
    //                 }
    //             })
    //             chrome.tabs.remove(ids)
    //         })
    //     })
    // } 
    // else if (action === 'togglepin') {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    //         let toggle = !tab[0].pinned
    //         chrome.tabs.update(tab[0].id, { pinned: toggle })
    //     })
    // } else if (action === 'togglemute') {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    //         let toggle = !tab[0].mutedInfo.muted
    //         chrome.tabs.update(tab[0].id, { muted: toggle })
    //     })
    // } 

    // else if (action === 'movetableft') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         if (tab[0].index > 0) {
    //             chrome.tabs.move(tab[0].id, { 'index': tab[0].index - 1 })
    //         }
    //     })
    // } else if (action === 'movetabright') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.move(tab[0].id, { 'index': tab[0].index + 1 })
    //     })
    // } 


    // else if (action === 'gototabbyindex') {
    //     if (request.matchindex) {
    //         selectTab(request.matchindex)
    //     }
    // } else if (action === 'newwindow') {
    //     chrome.windows.create()
    // } else if (action === 'newprivatewindow') {
    //     chrome.windows.create({ incognito: true })
    // } else if (action === 'closewindow') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.windows.remove(tab[0].windowId)
    //     })
    // } 


    // else if (action === 'top') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, 0)' })
    // } else if (action === 'bottom') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, document.body.scrollHeight)' })
    // } 


}