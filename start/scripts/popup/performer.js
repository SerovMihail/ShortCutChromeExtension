// $('.execute-flow').on('click', function () {

//     // chrome.tabs.executeScript(null, { file: "start/scripts/libs/jquery-3.3.1.min.js" }, function () {
//     //     chrome.tabs.executeScript(null, { file: 'start/scripts/injectModules/inject.js' });
//     // });

//     var settings = {
//         keys: [{
//             action: 'previousTab',
//             count: 1,
//             sekDelay: 1,
//             index: 1
//         }]
//     };

//     localStorage.shortkeys = JSON.stringify(settings);


//     chrome.runtime.sendMessage({ action: 'getKeys', url: document.URL }, function (response) {
//         // if (response) {
//         //     Shortkeys.keys = response
//         //     if (Shortkeys.keys.length > 0) {
//         //         Shortkeys.keys.forEach((key) => {
//         //             Shortkeys.activateKey(key)
//         //         })
//         //     }
//         // }
//         console.log(response);
//     })
// });

//var app = angular.module('ShortcutsFlow', ['ui.select']);
var app = angular.module('ShortcutsFlow', []);

app.controller('ShortcutsCtrl', ['$scope', function ($scope) {

    // $scope.data = {
    //     flows: [
    //         {
    //             index: 1,
    //             name: "Ownflow 1",
    //             shortcuts : [
    //                 {
    //                     index: 1,
    //                     action: "back",
    //                     count: 1,
    //                     sekDelay: 1
    //                 }
    //             ]
    //         }
    //     ]

    // }

    $scope.typesOfShortcut = [
        { 'id': 1, 'name': 'back' },
        { 'id': 2, 'name': 'forward' },
        { 'id': 3, 'name': 'reload' },
    ]

    $scope.data = {
        flows: []
    }

    // work with flows

    $scope.createNewFlow = function () {
        $scope.data.flows.push({
            index: $scope.data.flows.length + 1,
            name: $scope.newFlowName,
            shortcuts: []
        });

        $scope.newFlowName = "";
    }

    $scope.removeFlow = function (index) {
        $scope.data.flows = $scope.data.flows.filter(function (e) {
            return e.index != index;
        });
    }

    // shortcuts

    $scope.createNewShortcut = function (flow, type, count, delay) {

        flow.shortcuts.push({
            action: type,
            index: flow.shortcuts.length + 1,
            count: count,
            delay: delay
        });

        type = "";
    }

    $scope.removeShortcut = function (flow, shortcutIndex) {
        flow = flow.shortcuts.filter(function (e) {
            return e.index != shortcutIndex;
        });
    }


    // execute

    $scope.executeFlow = function (flowIndex) {

        localStorage.currentFlow = JSON.stringify($scope.data.flows[flowIndex - 1].shortcuts);

        chrome.runtime.sendMessage({ action: 'getKeys', flowIndex: flowIndex }, function (response) {
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
    }
}]);

$('.shortcut-add-new').on('click', function () {
    var prevElemIndexString = $(this).prev().attr('index');

    if (!prevElemIndexString)
        return;

    var prevElemIndex = parseInt(prevElemIndexString);

    var settings = JSON.parse(localStorage.shortkeys);

    settings.keys.push({
        action: 'back',
        count: 1,
        sekDelay: 1,
        index: prevElemIndex + 1
    });
});

