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
        { 'id': 8, 'group': 'Tabs', 'name': 'Next tab', 'action': 'nexttab' },
        { 'id': 9, 'group': 'Tabs', 'name': 'New tab using buffer', 'action': 'gototab' },
        { 'id': 10, 'group': 'Tabs', 'name': 'New tab using input', 'action': 'opentabbyurl' },
        // { 'id': 9, 'group': 'Document', 'name': 'Tabulation', 'action': 'tab' },
        { 'id': 11, 'group': 'Document', 'name': 'Copy focused element text', 'action': 'copyfocuedtext' },
        { 'id': 12, 'group': 'Document', 'name': 'Click focused element', 'action': 'clickfocusedelement' },
        { 'id': 13, 'group': 'Document', 'name': 'Past in focused element using buffer', 'action': 'pastinfocusedelement' },
        { 'id': 14, 'group': 'Document', 'name': 'Select element using selector', 'action': 'selectelementusingselector' },
        { 'id': 15, 'group': 'Document', 'name': 'Past in focused element using input', 'action': 'pastusinginput' }
    ];

    $scope.temp = {};

    function init() {

        if (!localStorage.flows) {

            $scope.vm = {
                flows: []
            }

            saveInLocalStorage('flows', $scope.vm);
        } else {
            $scope.vm = getFromLocalStorage('flows');
        }

    }

    init();

    // work with flows

    $scope.createNewFlow = function () {
        $scope.vm.flows.push({
            index: $scope.vm.flows.length + 1,
            name: $scope.newFlowName,
            shortcuts: []
        });

        $scope.newFlowName = "";

        saveInLocalStorage('flows', $scope.vm);
    }

    $scope.removeFlow = function (index) {

        $scope.vm.flows = $scope.vm.flows.filter(function (e) {
            return e.index != index;
        });

        saveInLocalStorage('flows', $scope.vm);
    }

    $scope.toggleFlowVisible = function(flow) {
        flow.bodyVisible = !flow.bodyVisible;

        saveInLocalStorage('flows', $scope.vm);
    }

    // shortcuts

    $scope.createNewShortcut = function (flow) {
       
        var shortcutInfo = flow.temp.newShortcut;

        flow.shortcuts.push({
            index: flow.shortcuts.length + 1,
            action: shortcutInfo.type.action,
            name: shortcutInfo.type.name,
            count: shortcutInfo.count ? shortcutInfo.count : null,
            delay: shortcutInfo.delay ? shortcutInfo.delay : null,
            selector: shortcutInfo.selector ? shortcutInfo.selector : null  ,          
            url: shortcutInfo.url ? shortcutInfo.url : null,            
            data: shortcutInfo.data ? shortcutInfo.data : null            
        });       
        
        flow.temp = null;

        saveInLocalStorage('flows', $scope.vm);
    }

    $scope.removeShortcut = function (flow, shortcutIndex) {

        flow.shortcuts = flow.shortcuts.filter(function (e) {
            return e.index != shortcutIndex;
        });

        saveInLocalStorage('flows', $scope.vm);
    }

    // execute

    $scope.executeFlow = function (flowIndex) {

        localStorage.currentFlow = JSON.stringify($scope.vm.flows[flowIndex].shortcuts);

        chrome.tabs.getSelected(null, function (tab) {

            if (new RegExp("^(http|https)://").test(tab.url)) {

                chrome.runtime.sendMessage({ action: 'executeFlow', flowIndex: flowIndex }, function (response) {

                    console.log(response);
                });
            } else {

                $scope.vm.flows[flowIndex].error = "Unsupported active tab. Please change your location";
                $scope.$applyAsync();
            }

        });
    }

    function saveInLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}]);