angular.module('todoController', ['ngMaterial'])

  // inject the Todo service factory into our controller
  .controller('mainController', ['$scope', '$http', 'Todos', '$mdDialog', function($scope, $http, Todos, $mdDialog) {
    $scope.formData = {};
    $scope.loading = true;
    $scope.users = [{
        user: 1,
        name: "piem"
      },
      {
        user: 2,
        name: "stem"
      }
    ];
    $scope.taskForm = {};

    $scope.tabs = [{
        label: "Backlog",
        data: $scope.todos,
        next_disabled: false
      },
      {
        label: "Ongoing",
        data: [],
        next_disabled: false
      },
      {
        label: "Done",
        data: [],
        next_disabled: true
      }
    ];

    $scope.moveRight = function(todoId) {
      console.log('Move item with id right :' + todoId);
      $scope.loading = true;
      Todos.nextState(todoId)
        .success(function(data) {
          $scope.loading = false;
          updateTabData(data);
        });
    };

    $scope.moveUp = function(todoId, state) {
      console.log('Move item up id: ' + todoId);
      $scope.loading = true;
      move(todoId, state, -1)
      Todos.up(todoId)
        .success(function(data) {
          $scope.loading = false;
          //updateTabData(data);
        });
    };

    $scope.moveDown = function(todoId, state) {
      console.log('Move item down id: ' + todoId);
      $scope.loading = true;
      move(todoId, state, 1)
      Todos.down(todoId)
        .success(function(data) {
          $scope.loading = false;
          //updateTabData(data);
        });
    };

    $scope.getUserName = function(userId) {
      for (var i in $scope.users) {
        if ($scope.users[i].user + "" === userId) {
          return $scope.users[i].name;
        }
      }
    };

    $scope.showNewDialog = function(taskId) {
      if (taskId != undefined) {
        Todos.getById(taskId)
          .success(function(data) {
            $scope.taskForm.name = data.text;
            $scope.taskForm.user = data.user;
            $scope.loading = false;
          });
      }
      $mdDialog.show({
        locals: {
          taskId: taskId
        },
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'templates/dialogs/dialog_new_task.html',
        controller: NewDialogController
      });
    };

    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    Todos.get()
      .success(function(data) {
        updateTabData(data);
        $scope.loading = false;
      });

    // CREATE ==================================================================
    $scope.createTask = function() {

      // validate the formData to make sure that something is there
      // if form is empty, nothing will happen
      if ($scope.taskForm.name != undefined) {
        $scope.loading = true;

        console.log('createTask: ' + $scope.taskForm.name + '->' + $scope.taskForm.user);
        // call the create function from our service (returns a promise object)
        Todos.create($scope.taskForm)

          // if successful creation, call our get function to get all the new tasks
          .success(function(data) {
            $scope.loading = false;
            $scope.taskForm = {}; // clear the form so our user is ready to enter another
            updateTabData(data);
          });
      }
    };

    // UPDATE
    $scope.updateTask = function(id) {
      console.log('update task ' + $scope.taskForm.name + ' ' + $scope.taskForm.user + ' ' + id);
      if ($scope.taskForm.name != undefined && id != undefined) {
        Todos.put(id, $scope.taskForm)
          .success(function(data) {
            $scope.loading = false;
            $scope.taskForm = {};
            updateTabData(data);
          });
      }
    };

    // DELETE ==================================================================
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
      $scope.loading = true;

      Todos.delete(id)
        // if successful creation, call our get function to get all the new todos
        .success(function(data) {
          $scope.loading = false;
          updateTabData(data);
        });
    };

    function updateTabData(data) {
      for (var i = 0; i < data.length; i++) {
        $scope.tabs[i].data = data[i];
      }
    }

    function move(todo_id, state, direction) {
      let stateTodos = $scope.tabs[state].data
      let todoIndex = stateTodos.findIndex(todo => todo._id == todo_id)
      let newIndex = todoIndex + direction

      if (newIndex >= 0 && newIndex < stateTodos.length) {
        stateTodos.splice(todoIndex, 0, stateTodos.splice(todoIndex + direction, 1)[0])
      }
    }

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        console.log('DialogController cancel');
        $mdDialog.cancel();
      };

      $scope.ok = function(answer) {
        console.log('DialogController OK ' + $scope.taskForm.name);
        console.log('DialogController OK ' + $scope.taskForm.user);
        $scope.createTask();
        $mdDialog.hide(answer);
      };
    }
  }]);
