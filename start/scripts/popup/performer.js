var app = angular.module('ShortcutsFlow', []);

app.controller('ShortcutsCtrl', ['$scope', function ($scope) {

    $scope.typesOfShortcut = [
        { 'id': 1, 'group': 'Location', 'name': 'back', 'action': 'back' },
        { 'id': 2, 'group': 'Location', 'name': 'forward', 'action': 'forward' },
        { 'id': 3, 'group': 'Location', 'name': 'reload', 'action': 'reload' },
        { 'id': 4, 'group': 'Location', 'name': 'copy current tab url', 'action': 'copyurl' },
        { 'id': 5, 'group': 'Tabs', 'name': 'new tab', 'action': 'newtab' },
        { 'id': 6, 'group': 'Tabs', 'name': 'close tab', 'action': 'closetab' },
        { 'id': 7, 'group': 'Tabs', 'name': 'previous tab', 'action': 'prevtab' },
        { 'id': 8, 'group': 'Tabs', 'name': 'new tab using buffer', 'action': 'gototab' },
        { 'id': 9, 'group': 'Document', 'name': 'Tabulation', 'action': 'tab' },
        { 'id': 10, 'group': 'Document', 'name': 'Copy focused element text', 'action': 'copyfocuedtext' },
        { 'id': 11, 'group': 'Document', 'name': 'Click focused element', 'action': 'clickfocusedelement' },
        { 'id': 12, 'group': 'Document', 'name': 'Past in focused element', 'action': 'pastinfocusedelement' }
    ]

    $scope.data = {
        flows: []
    }

    function init() {
        if (!localStorage.flows) {
            localStorage.flows = JSON.stringify($scope.data);
        } else {
            $scope.data = JSON.parse(localStorage.flows)
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

        localStorage.flows = JSON.stringify($scope.data);
    }

    $scope.removeFlow = function (index) {
        $scope.data.flows = $scope.data.flows.filter(function (e) {
            return e.index != index;
        });

        localStorage.flows = JSON.stringify($scope.data);
    }

    // shortcuts

    $scope.createNewShortcut = function (flow, type, count, delay) {

        if (!count)
            count = 1;

        if (!delay)
            delay = 1;

        flow.shortcuts.push({
            action: type.action,
            name: type.name,
            index: flow.shortcuts.length + 1,
            count: count,
            delay: delay
        });

        type = "";

        localStorage.flows = JSON.stringify($scope.data);
    }

    $scope.removeShortcut = function (flow, shortcutIndex) {
        flow.shortcuts = flow.shortcuts.filter(function (e) {
            return e.index != shortcutIndex;
        });

        localStorage.flows = JSON.stringify($scope.data);
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
}]);