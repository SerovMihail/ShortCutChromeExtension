// chrome.commands.onCommand.addListener(function (command) {

//     //command = command.split('-')[1];
//     handleAction(command);
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const action = request.action
    if (action === 'getKeys') {
        //const currentUrl = request.url
        var settings = JSON.parse(localStorage.shortkeys)
        var keys = []
        if (settings.keys.length > 0) {
            settings.keys.forEach((key) => {
                // if (isAllowedSite(key, currentUrl)) {
                keys.push(key)
                // }
            })
        }
        sendResponse(keys)
    }
    handleAction(action, request)
});



let handleAction = (action, request = {}) => {
    
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
            copyToClipboard(tab[0].url)
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
        let createNewTab = () => {
            chrome.tabs.create({ url: request.openurl })
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
    } else {
        return false
    }
    return true
}