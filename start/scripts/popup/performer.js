var app = angular.module('ShortcutsFlow', []);

app.controller('ShortcutsCtrl', ['$scope', function ($scope) {

    $scope.typesOfShortcut = [
        { 'id': 1, 'group': 'Location', 'name': 'Back', 'action': 'back' },
        { 'id': 2, 'group': 'Location', 'name': 'Forward', 'action': 'forward' },
        { 'id': 3, 'group': 'Location', 'name': 'Reload', 'action': 'reload' },
        { 'id': 4, 'group': 'Location', 'name': 'Copy current tab url', 'action': 'copyurl' },
        { 'id': 5, 'group': 'Tabs', 'name': 'New tab', 'action': 'newtab' },
        { 'id': 6, 'group': 'Tabs', 'name': 'Close tab', 'action': 'closetab' },
        { 'id': 7, 'group': 'Tabs', 'name': 'Previous tab', 'action': 'prevtab' },
        { 'id': 8, 'group': 'Tabs', 'name': 'New tab using buffer', 'action': 'gototab' },
        { 'id': 9, 'group': 'Document', 'name': 'Tabulation', 'action': 'tab', 'additionalInput' : true },
        { 'id': 10, 'group': 'Document', 'name': 'Copy focused element text', 'action': 'copyfocuedtext' },
        { 'id': 11, 'group': 'Document', 'name': 'Click focused element', 'action': 'clickfocusedelement' },
        { 'id': 12, 'group': 'Document', 'name': 'Past in focused element', 'action': 'pastinfocusedelement' },
        { 'id': 13, 'group': 'Document', 'name': 'Select element using selector', 'action': 'selectelementusingselector', 'additionalInput' : true  }
    ]

    $scope.data = {
        flows: []
    }

    function init() {
        if (!localStorage.flows) {
            saveInLocalStorage('flows', $scope.data);           
        } else {
            $scope.data = getFromLocalStorage('flows');            
        }

    }

    init();

    // work with flows

    $scope.createNewFlow = function () {
        $scope.data.flows.push({
            index: $scope.data.flows.length + 1,
            name: $scope.newFlowName,
            shortcuts: []
        });

        $scope.newFlowName = "";

        saveInLocalStorage('flows', $scope.data);   
    }

    $scope.removeFlow = function (index) {
        
        $scope.data.flows = $scope.data.flows.filter(function (e) {
            return e.index != index;
        });

        saveInLocalStorage('flows', $scope.data);   
    }

    // shortcuts

    $scope.createNewShortcut = function (flow, type, count, delay, selector) {

        // if (!count)
        //     count = 1;

        // if (!delay)
        //     delay = 1;

        flow.shortcuts.push({
            action: type.action,
            name: type.name,
            index: flow.shortcuts.length + 1,
            count: count,
            delay: delay,
            selector: selector,
            additionalInput: count || selector ? true : false
        });

        type = "";

        saveInLocalStorage('flows', $scope.data);   
    }

    $scope.removeShortcut = function (flow, shortcutIndex) {
        flow.shortcuts = flow.shortcuts.filter(function (e) {
            return e.index != shortcutIndex;
        });

        saveInLocalStorage('flows', $scope.data);   
    }

    // execute

    $scope.executeFlow = function (flowIndex) {

        localStorage.currentFlow = JSON.stringify($scope.data.flows[flowIndex].shortcuts);

        chrome.tabs.getSelected(null, function (tab) {

            if (new RegExp("^(http|https)://").test(tab.url)) {

                chrome.runtime.sendMessage({ action: 'executeFlow', flowIndex: flowIndex }, function (response) {
                    
                    console.log(response);
                });
            } else {
                $scope.data.flows[flowIndex].error = "Unsupported active tab. Please change your location";
                $scope.$applyAsync();
            }
        });
    }

    function saveInLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getFromLocalStorage(key) {
        return localStorage.getItem(key);
    }
}]);