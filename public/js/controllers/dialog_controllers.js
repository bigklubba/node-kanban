angular.module('DialogControllers', [])
    .controller('NewDialogController', NewDialogController);

function NewDialogController($scope, $mdDialog, taskId) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        console.log('DialogController cancel');
        console.log('taskId:'+taskId);
        $mdDialog.cancel();
        $scope.taskForm = {};
    };

    $scope.ok = function (answer) {
        console.log('DialogController OK ' + $scope.taskForm.name + ' user ' + $scope.taskForm.user + ' taskId ' + taskId);
        if (taskId) {
            $scope.updateTask(taskId);
        } else {
            $scope.createTask();
        }
        $mdDialog.hide(answer);
    };
}