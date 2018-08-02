// chrome.commands.onCommand.addListener(function (command) {

//     //command = command.split('-')[1];
//     handleAction(command);
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const action = request.action
    if (action === 'getKeys') {
        const currentUrl = request.url
        let settings = JSON.parse(localStorage.shortkeys)
        let keys = []
        if (settings.keys.length > 0) {
            settings.keys.forEach((key) => {
                if (isAllowedSite(key, currentUrl)) {
                    keys.push(key)
                }
            })
        }
        sendResponse(keys)
    }
    handleAction(action, request)
});



let handleAction = (action, request = {}) => {
    // if (action === 'cleardownloads') {
    //     chrome.browsingData.remove({ 'since': 0 }, { 'downloads': true })
    // } else if (action === 'viewsource') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.create({ url: 'view-source:' + tab[0].url })
    //     })
    // } else if (action === 'nexttab') {
    //    selectTab('next')
    // } else if (action === 'prevtab') {
    //     selectTab('previous')
    // } else if (action === 'firsttab') {
    //     selectTab('first')
    // } else if (action === 'lasttab') {
    //     selectTab('last')
    // } else if (action === 'newtab') {
    //     chrome.tabs.create({})
    // } else if (action === 'reopentab') {
    //     chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function (sessions) {
    //         let closedTab = sessions[0]
    //         chrome.sessions.restore(closedTab.sessionId)
    //     })
    // } else if (action === 'closetab') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.remove(tab[0].id)
    //     })
    // } else if (action === 'clonetab') {
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
    // } else if (action === 'closelefttabs' || action === 'closerighttabs') {
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
    // } else if (action === 'togglepin') {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    //         let toggle = !tab[0].pinned
    //         chrome.tabs.update(tab[0].id, { pinned: toggle })
    //     })
    // } else if (action === 'togglemute') {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    //         let toggle = !tab[0].mutedInfo.muted
    //         chrome.tabs.update(tab[0].id, { muted: toggle })
    //     })
    // } else if (action === 'copyurl') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         copyToClipboard(tab[0].url)
    //     })
    // } else if (action === 'searchgoogle') {
    //     chrome.tabs.executeScript({
    //         code: 'window.getSelection().toString();'
    //     }, function (selection) {
    //         if (selection[0]) {
    //             let query = encodeURIComponent(selection[0])
    //             chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    //                 chrome.tabs.create({ url: 'https://www.google.com/search?q=' + query, index: tabs[0].index + 1 })
    //             })
    //         }
    //     })
    // } else if (action === 'movetableft') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         if (tab[0].index > 0) {
    //             chrome.tabs.move(tab[0].id, { 'index': tab[0].index - 1 })
    //         }
    //     })
    // } else if (action === 'movetabright') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.move(tab[0].id, { 'index': tab[0].index + 1 })
    //     })
    // } else if (action === 'gototab') {
    //     let createNewTab = () => {
    //         chrome.tabs.create({ url: request.openurl })
    //     }
    //     if (request.matchurl) {
    //         let queryOption = { url: request.matchurl }
    //         if (request.currentWindow) {
    //             queryOption.currentWindow = true
    //         }
    //         chrome.tabs.query(queryOption, function (tabs) {
    //             if (tabs.length > 0) {
    //                 chrome.tabs.update(tabs[0].id, { active: true })
    //                 chrome.windows.update(tabs[0].windowId, { focused: true })
    //             } else {
    //                 createNewTab()
    //             }
    //         })
    //     } else {
    //         createNewTab()
    //     }
    // } else if (action === 'gototabbytitle') {
    //     if (request.matchtitle) {
    //         let queryOption = { title: request.matchtitle }
    //         if (request.currentWindow) {
    //             queryOption.currentWindow = true
    //         }
    //         chrome.tabs.query(queryOption, function (tabs) {
    //             if (tabs.length > 0) {
    //                 chrome.tabs.update(tabs[0].id, { active: true })
    //                 chrome.windows.update(tabs[0].windowId, { focused: true })
    //             }
    //         })
    //     }
    // } else if (action === 'gototabbyindex') {
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
    // } else if (action === 'zoomin') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.getZoom(tab[0].id, (zoomFactor) => {
    //             console.log(zoomFactor)
    //             chrome.tabs.setZoom(tab[0].id, zoomFactor + 0.1)
    //         })
    //     })
    // } else if (action === 'zoomout') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.getZoom(tab[0].id, (zoomFactor) => {
    //             chrome.tabs.setZoom(tab[0].id, zoomFactor - 0.1)
    //         })
    //     })
    // } else if (action === 'zoomreset') {
    //     chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //         chrome.tabs.setZoom(tab[0].id, 0)
    //     })
    // } else if (action === 'back') {
    chrome.tabs.executeScript(null, { 'code': 'window.history.back()' })
    // } else if (action === 'forward') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.history.forward()' })
    // } else if (action === 'reload') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.location.reload()' })
    // } else if (action === 'top') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, 0)' })
    // } else if (action === 'bottom') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollTo(0, document.body.scrollHeight)' })
    // } else if (action === 'scrollup') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(0,-50)' })
    // } else if (action === 'scrollupmore') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(0,-500)' })
    // } else if (action === 'scrolldown') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(0,50)' })
    // } else if (action === 'scrolldownmore') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(0,500)' })
    // } else if (action === 'scrollleft') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(-50,0)' })
    // } else if (action === 'scrollleftmore') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(-500,0)' })
    // } else if (action === 'scrollright') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(50,0)' })
    // } else if (action === 'scrollrightmore') {
    //     chrome.tabs.executeScript(null, { 'code': 'window.scrollBy(500,0)' })
    // } else if (action === 'openbookmark' || action === 'openbookmarknewtab' || action === 'openbookmarkbackgroundtab' || action === 'openbookmarkbackgroundtabandclose') {
    //     chrome.bookmarks.search({ title: request.bookmark }, function (nodes) {
    //         let openNode
    //         for (let i = nodes.length; i-- > 0;) {
    //             let node = nodes[i]
    //             if (node.url && node.title === request.bookmark) {
    //                 openNode = node
    //                 break
    //             }
    //         }
    //         if (action === 'openbookmark') {
    //             chrome.tabs.query({ currentWindow: true, active: true }, (tab) => {
    //                 chrome.tabs.update(tab[0].id, { url: decodeURI(openNode.url) })
    //             })
    //         } else if (action === 'openbookmarkbackgroundtab') {
    //             chrome.tabs.create({ url: decodeURI(openNode.url), active: false })
    //         } else if (action === 'openbookmarkbackgroundtabandclose') {
    //             chrome.tabs.create({ url: decodeURI(openNode.url), active: false }, (createdTab) => {
    //                 var closeListener = function (tabId, changeInfo, updatedTab) {
    //                     if (tabId === createdTab.id && changeInfo.status === 'complete') {
    //                         chrome.tabs.remove(createdTab.id)
    //                         chrome.tabs.onUpdated.removeListener(closeListener)
    //                     }
    //                 }
    //                 chrome.tabs.onUpdated.addListener(closeListener)
    //             })
    //         } else {
    //             chrome.tabs.create({ url: decodeURI(openNode.url) })
    //         }
    //     })
    // } else {
    //     return false
    // }
    // return true
}