var myApp = angular.module('add-row', []);
myApp.controller('MainCtrl', function ($scope) {
    $scope.produits = [
        {id: 1, colId:['col1', 'col4'], dataTypeName: 'Date'},
        {id: 2, colId:['col2', 'col3'], dataTypeName: 'Alpha'},
        {id: 3, colId:['col5', 'col6', 'col7', 'col8'], dataTypeName: 'List Value'}
    ];

    $scope.columns = [{colId: 'col1', name:'', produits:[], dataFormat:'',  excludedChar:'', maxLength:'', isKeyField:false, isKeyRequired:false }];

    $scope.addNewColumn = function() {
        var newItemNo = $scope.columns.length+1;
        $scope.columns.push({'colId':'col'+newItemNo});
    };


    $scope.removeColumn = function(index) {
        // remove the row specified in index
        $scope.columns.splice( index, 1);
        // if no rows left in the array create a blank array
        if ( $scope.columns.length() === 0 || $scope.columns.length() == null){
            alert('no rec');
            $scope.columns.push = [{"colId":"col1"}];
        }


    };
});
