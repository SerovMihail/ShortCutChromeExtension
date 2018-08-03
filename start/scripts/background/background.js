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

let selectTab = (direction) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        if (tabs.length <= 1) {
            return
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
            chrome.tabs.update(toSelect.id, { active: true })
        })
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const action = request.action
    if (action === 'getKeys') {
        //const currentUrl = request.url
        var settings = JSON.parse(localStorage.currentFlow)
        // var keys = []
        // if (settings.keys.length > 0) {
        //     settings.keys.forEach((key) => {
        //         // if (isAllowedSite(key, currentUrl)) {
        //         keys.push(key)
        //         // }
        //     })
        // }
        //sendResponse(keys)
    }

    settings.forEach(function (el, index) {

        setTimeout(() => {
            handleAction(el.action, el.count, request);
        }, el.delay * index * 1000);

    });

});



let handleAction = (action, count, request = {}) => {

    if (action === 'nexttab') {
        selectTab('next')
    } else if (action === 'prevtab') {
        selectTab('previous')
    } else if (action === 'firsttab') {
        selectTab('first')
    } else if (action === 'lasttab') {
        selectTab('last')
    } else if (action === 'newtab') {
        chrome.tabs.create({})
    } else if (action === 'reopentab') {
        chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function (sessions) {
            let closedTab = sessions[0]
            chrome.sessions.restore(closedTab.sessionId)
        })
    } else if (action === 'closetab') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.tabs.remove(tab[0].id)
        })
    } else if (action === 'clonetab') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.tabs.duplicate(tab[0].id)
        })
    } else if (action === 'movetabtonewwindow') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.windows.create({ url: tab[0].url })
            chrome.tabs.remove(tab[0].id)
        })
    } else if (action === 'onlytab') {
        chrome.tabs.query({ currentWindow: true, pinned: false, active: false }, (tabs) => {
            let ids = []
            tabs.forEach(function (tab) {
                ids.push(tab.id)
            })
            chrome.tabs.remove(ids)
        })
    } else if (action === 'closelefttabs' || action === 'closerighttabs') {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let currentTabIndex = tabs[0].index
            chrome.tabs.query({ currentWindow: true, pinned: false, active: false }, (tabs) => {
                let ids = []
                tabs.forEach(function (tab) {
                    if ((action === 'closelefttabs' && tab.index < currentTabIndex) ||
                        (action === 'closerighttabs' && tab.index > currentTabIndex)) {
                        ids.push(tab.id)
                    }
                })
                chrome.tabs.remove(ids)
            })
        })
    } else if (action === 'togglepin') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
            let toggle = !tab[0].pinned
            chrome.tabs.update(tab[0].id, { pinned: toggle })
        })
    } else if (action === 'togglemute') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
            let toggle = !tab[0].mutedInfo.muted
            chrome.tabs.update(tab[0].id, { muted: toggle })
        })
    } else if (action === 'copyurl') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            copyToClipboard(tab[0].url);
            localStorage.clipboardData = tab[0].url;
        })
    } else if (action === 'movetableft') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            if (tab[0].index > 0) {
                chrome.tabs.move(tab[0].id, { 'index': tab[0].index - 1 })
            }
        })
    } else if (action === 'movetabright') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.tabs.move(tab[0].id, { 'index': tab[0].index + 1 })
        })
    } else if (action === 'gototab') {
        var clipboardData = localStorage.clipboardData;

        let createNewTab = () => {
            chrome.tabs.create({ url: clipboardData })
        }
        if (request.matchurl) {
            let queryOption = { url: request.matchurl }
            if (request.currentWindow) {
                queryOption.currentWindow = true
            }
            chrome.tabs.query(queryOption, function (tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.update(tabs[0].id, { active: true })
                    chrome.windows.update(tabs[0].windowId, { focused: true })
                } else {
                    createNewTab()
                }
            })
        } else {
            createNewTab()
        }
    } else if (action === 'gototabbyindex') {
        if (request.matchindex) {
            selectTab(request.matchindex)
        }
    } else if (action === 'newwindow') {
        chrome.windows.create()
    } else if (action === 'newprivatewindow') {
        chrome.windows.create({ incognito: true })
    } else if (action === 'closewindow') {
        chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
            chrome.windows.remove(tab[0].windowId)
        })
    } else if (action === 'back') {
        chrome.tabs.executeScript(null, { 'code': 'window.history.back()' })
    } else if (action === 'forward') {
        chrome.tabs.executeScript(null, { 'code': 'window.history.forward()' })
    } else if (action === 'reload') {
        chrome.tabs.executeScript(null, { 'code': 'window.location.reload()' })
    } else if (action === 'top') {
        chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, 0)' })
    } else if (action === 'bottom') {
        chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, document.body.scrollHeight)' })
    } else if (action === 'tab') {

        var injectCode =
            'var element = [].slice.call(document.querySelectorAll("a, object, input, iframe, [tabindex]"), ' + count + ', ' + (count + 1) + ')[0];' +
            'element.style.border = "2px solid red";' +
            'element.focus();';

        chrome.tabs.executeScript(null, { 'code': injectCode });

    } else if (action === 'copyfocuedtext') {

        chrome.tabs.executeScript(null, { 'code': 'document.activeElement.innerText' }
            , function (result) {
                localStorage.clipboardData = result[0];
            });
            
    } else if (action === 'clickfocusedelement') {

        chrome.tabs.executeScript(null, { 'code': 'document.activeElement.click()' });
            
    } else {
        return false
    }
    return true
}